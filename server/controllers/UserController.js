const User = require("../models/UserModel");
const asyncErrorHandler = require("./../utils/asynsErrorHandler");
const jwt = require("jsonwebtoken");
const util = require("util");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");
const Order = require("../models/OrdersModel");
const Product = require("../models/BroductsModel");
const Address = require("../models/AddressModel");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

exports.register = asyncErrorHandler(async (req, res, next) => {
  // 1. check if user already exist
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ msg: "User already exists" });

  // 2. Create a new user
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);

  // 5. Return json response
  res
    .status(201)
    .cookie("jwt", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    })
    .json({ data: newUser, token: token, msg: "User registered successfully" });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }
  // 1. check if user already exist
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) return res.status(400).json({ msg: "User not found" });
  console.log(user);
  if (
    !user ||
    user.status === "inactive" ||
    !(await user.comparePasswordInDB(req.body.password, user.password))
  ) {
    return res.status(401).json({ msg: "Invalid email or password" });
  }
  const token = signToken(user._id);
  // 4. Return json response
  res
    .status(200)
    .cookie("jwt", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    })
    .json({ data: user, token: token, msg: "User logged in successfully" });
});

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;

  user.isActive = false;
  await user.save();
  res
    .cookie("jwt", "inactived")
    .status(200)
    .json({ user: user, msg: "User has been successfully deactivated." });
});
exports.isActive = asyncErrorHandler(async (req, res, next) => {
  if (req.body.email) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!user.isActive) {
      return res.status(403).json({ msg: "Account is inactive" });
    }
  } else if (req.user) {
    const user = req.user;
    if (!user.isActive) {
      return res.status(403).json({ msg: "Account is inactive" });
    }
  }

  next();
});
exports.getUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json({ data: user });
});
exports.updateUserDetails = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const firstName = req.body.firstName;
  const username = req.body.username;
  const lastName = req.body.lastName;
  const birthDate = req.body.birthDate;
  const phoneNumber = req.body.phoneNumber;
  const newUser = await User.findByIdAndUpdate(user._id.toString(), {
    username,
    firstName,
    lastName,
    birthDate,
    phoneNumber,
  });
  if (!newUser || !user) return res.status(404).json({ msg: "User not found" });
  const updated = await User.findById(user._id.toString());

  res.json({ data: updated });
});
exports.changePassword = asyncErrorHandler(async (req, res) => {
  const user = req.user;
  const OldPassword = req.body.OldPassword;
  const NewPassword = req.body.NewPassword;
  const confirmNewPassword = req.body.confirmNewPassword;

  // 2. validate old password
  if (!user.comparePasswordInDB(OldPassword, user.password)) {
    return res.status(401).json({ msg: "Incorrect old password" });
  }

  user.password = NewPassword;
  user.confirmPassword = confirmNewPassword;
  user.passwordChangedAt = Date.now();

  await user.save({ validateBeforeSave: true });

  // 5. Return json response
  res.json({ msg: "Password changed successfully" });
});

let token;
exports.protect = asyncErrorHandler(async (req, res, next) => {
  console.log("protect entered");
  // 1. read the token & check if exist
  const testToken = req.headers.authorization;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  if (
    !token ||
    token == null ||
    token == undefined ||
    token == "undefined" ||
    token == "null"
  ) {
    return res.status(401).json("you are not logged in!");
  }

  // 2. validate the token

  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return res.status(401).json("the user with the given token does not exist");
  }

  // 4. if the Admin changeed password after the token was issued
  if (await user.isPasswordChanged(decodedToken.iat)) {
    return res
      .status(401)
      .json("the password has been changed recently. please login again");
  }
  // 5. allow Admin to access route
  req.user = user;

  next();
});

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  // 1. get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }
  // 2. generate random token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // 3. send email with reset token
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested a password reset. Please make a PUT request to: \n\n${resetUrl}\n\nIf you did not make this request, please ignore this email and no changes will be made.`;
  await sendEmail({
    email: user.email,
    subject: "Password Reset",
    message: message,
  });
  // 4. return json response
  res.json({ msg: "Reset password email sent successfully" });
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  // 1. get user by reset token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ msg: "Invalid token or expired token" });
  }
  if (!req.body.password || !req.body.confirmPassword) {
    return res
      .status(400)
      .json({ msg: "Please provide a password and confirm password" });
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save({ validateBeforeSave: true });
  // // 3. send json response
  res.status(200).json({ msg: "Password reset successfully" });
});
exports.isAdminforInteriorUse = asyncErrorHandler(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "User is not an admin" });
  }
  console.log(req.user.isAdmin);
  next();
});
exports.isSuberAdminforInteriorUse = asyncErrorHandler(
  async (req, res, next) => {
    if (!req.user.isSuberAdmin) {
      return res.status(403).json({ msg: "User is not an a SuberAdmin" });
    }
    next();
  }
);
exports.getMe = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ data: user });
});
exports.isAdmin = asyncErrorHandler(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ result: false, msg: "User is not an admin" });
  }
  res.status(200).json({ result: true, msg: "User is admin" });
});
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const orders = await Order.find({ customerId: user._id });
  res.status(200).json({ data: orders });
});

exports.addToCart = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const productt = await Product.findById(req.params.id);
  if (!productt) return res.status(404).json({ msg: "Product not found" });
  console.log(user.Cart);
  let produ = user.Cart.products.find((pro) => {
    return pro.productId.toString() === req.params.id.toString();
  });
  if (produ) {
    return res
      .status(200)
      .json({ msg: "Product already in your cart", data: user });
  }
  if (!req.body.quantity) {
    req.body.quantity = 1;
  }
  if (!req.body.quantity || isNaN(req.body.quantity)) {
    return res.status(400).json({ msg: "Quantity must be a number" });
  }
  if (req.body.quantity < 1 || req.body.quantity > productt.invertoryStock) {
    return res
      .status(400)
      .json({ msg: "Quantity must be between 1 and the  Invertory Stock" });
  }
  user.Cart.products.push({
    productId: productt._id,
    quantity: req.body.quantity,
    price: productt.price,
    totalForProduct: +req.body.quantity * +productt.price,
    Name: productt.Name,
    imageLink: productt.images[0].secure_url,
  });
  user.Cart.totalPrice = 0;

  user.Cart.products.forEach((product) => {
    user.Cart.totalPrice =
      +user.Cart.totalPrice + +product.price * +product.quantity;
  });
  await user.save();
  res.status(200).json({ msg: "Product added to cart", data: user });
});

exports.changeUserToAdmin = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isAdmin: true, isSuberAdmin: false },
    { new: true }
  );
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json({ msg: "User updated as admin", data: user });
});

exports.changeAdminToUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isAdmin: false, isSuberAdmin: false },
    { new: true }
  );
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json({ msg: "Admin updated To User", data: user });
});
exports.changeSAdminToAdmin = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isAdmin: true, isSuberAdmin: false },
    { new: true }
  );
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json({ msg: "Admin updated To User", data: user });
});
exports.changeAdminToSAdmin = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isAdmin: true, isSuberAdmin: true },
    { new: true }
  );
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json({ msg: "Admin updated To User", data: user });
});

exports.getCart = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const userCart = user.Cart;
  if (!userCart)
    return res.status(404).json({ msg: "No products in cart", data: userCart });

  res.status(200).json({ data: userCart });
});

exports.addToWishList = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ msg: "Product not found" });
  let produ = user.Wishlist.products.find((pro) => {
    return pro.productId.toString() === req.params.id.toString();
  });
  if (produ) {
    return res
      .status(200)
      .json({ msg: "Product already in wishlist", data: user });
  }
  if (!req.body.quantity) {
    req.body.quantity = 1;
  }
  user.Wishlist.products.push({
    productId: product._id,
    quantity: req.body.quantity,
    price: product.price,
    totalForProduct: +req.body.quantity * +product.price,
    Name: product.Name,
    imageLink: product.images[0].secure_url,
  });
  user.Wishlist.totalPrice = 0;

  user.Wishlist.products.forEach((product) => {
    user.Wishlist.totalPrice =
      +user.Wishlist.totalPrice + +product.price * +product.quantity;
  });
  await user.save();
  res.status(200).json({ msg: "Product added to wishlist", data: user });
});

exports.getwishList = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const wishList = user.Wishlist;
  if (!wishList)
    return res.status(404).json({ msg: "No products in wishlist" });
  res.status(200).json({ data: wishList });
});

exports.EditQuatityInWishList = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const productId = req.params.id;
  const quantity = req.body.quantity;
  const product = user.Wishlist.products.find(
    (product) => product.productId.toString() === productId
  );

  const newproduct = await Product.findById(productId);
  if (!newproduct)
    return res.status(404).json({ msg: "Product not found in the database" });
  if (!product) return res.status(404).json({ msg: "Product not found" });
  product.quantity = +quantity;
  product.totalForProduct = +product.price * +quantity;
  product.imageLink = newproduct.images[0].secure_url;
  user.Wishlist.totalPrice = 0;
  user.Wishlist.products.forEach((product) => {
    user.Wishlist.totalPrice =
      +user.Wishlist.totalPrice + +product.price * +product.quantity;
  });
  await user.save();

  res.status(200).json({ msg: "Quantity updated in wishlist", data: user });
});

exports.DeleteFormWishList = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const productId = req.params.id;

  user.Wishlist.products = user.Wishlist.products.filter(
    (product) => product.productId.toString() !== productId
  );
  user.Wishlist.totalPrice = 0;
  user.Wishlist.products.forEach((product) => {
    user.Wishlist.totalPrice =
      +user.Wishlist.totalPrice + +product.price * +product.quantity;
  });

  await user.save();
  res.status(200).json({ msg: "Product removed from wishlist", data: user });
});

exports.addAllToCart = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  if (!user.Wishlist) {
    return res.status(404).json({ msg: "No products in wishlist" });
  }

  const existingProductIds = new Set(
    user.Cart.products.map((product) => product.productId.toString())
  );
  const newProducts = user.Wishlist.products.filter(
    (product) => !existingProductIds.has(product.productId.toString())
  );

  user.Cart.products = [...user.Cart.products, ...newProducts];
  user.Cart.totalPrice = 0;
  user.Cart.products.forEach((product) => {
    user.Cart.totalPrice += product.price * product.quantity;
  });
  user.Wishlist.products = [];
  user.Wishlist.totalPrice = 0;

  await user.save();
  res.status(200).json({ msg: "Products added to cart", data: user });
});

exports.AddMoneyToWallet = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  if (req.body.amount <= 0) {
    return res.status(400).json({ msg: "Amount must be positive" });
  }
  if (user.wallet + req.body.amount > 100000) {
    return res.status(400).json({
      msg: "Adding this amount would exceed the maximum wallet limit",
    });
  }
  const amount = req.body.amount;
  user.walletbalance = +user.walletbalance + +amount;
  await user.save();
  res.status(200).json({ msg: "Money added to wallet", data: user });
});

exports.getMoneyInWallet = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json({ msg: "Money in wallet", data: user.walletbalance });
});

exports.getAllAdressForMe = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const adresses = await Address.find({ userId: user._id });
  res.status(200).json({ data: adresses });
});
exports.getAllAdress = asyncErrorHandler(async (req, res, next) => {
  const adresses = await Address.find();
  res.status(200).json({ data: adresses });
});
exports.getAllAdressForUser = asyncErrorHandler(async (req, res, next) => {
  const adresses = await Address.find({ userId: req.params.id });
  if (!req.params.id)
    return res.status(400).json({ msg: "Please provide a user id" });

  if (!adresses || adresses.length === 0)
    return res.status(404).json({ msg: "No adresses found for this user" });
  console.log(req.params.id);
  res.status(200).json({ data: adresses });
});
exports.getAllAdmins = asyncErrorHandler(async (req, res, next) => {
  const admins = await User.find({ isAdmin: true });
  if (!admins) {
    return res.status(404).json({ msg: "No admins found" });
  }
  res.status(200).json({ number: admins.length, data: admins });
});

exports.DeleteFromCart = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const productId = req.params.id;
  user.Cart.products = user.Cart.products.filter(
    (product) => product.productId.toString() !== productId
  );
  user.Cart.totalPrice = 0;
  user.Cart.products.forEach((product) => {
    user.Cart.totalPrice =
      +user.Cart.totalPrice + +product.price * +product.quantity;
  });
  await user.save();
  res.status(200).json({ msg: "Product removed from cart", data: user });
});

exports.updateUserDetailsForUser = asyncErrorHandler(async (req, res, next) => {
  const firstName = req.body.firstName;
  const username = req.body.username;
  const lastName = req.body.lastName;
  const birthDate = req.body.birthDate;
  const phoneNumber = req.body.phoneNumber;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      username,
      firstName,
      lastName,
      birthDate,
      phoneNumber,
    },
    {
      new: true,
    }
  );
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json({ msg: "User details updated", data: user });
});

exports.deleteUserForUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json({ msg: "User is inactive", data: user });
});
exports.reActiveUserForUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  );
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json({ msg: "User is active", data: user });
});

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();
  if (!users) return res.status(404).json({ msg: "No users found" });
  res.status(200).json({ numberoFUsers: users.length, data: users });
});

exports.getUserByEmail = asyncErrorHandler(async (req, res, next) => {
  console.log(req.params.email);
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json({ data: user });
});
exports.getUserByUserName = asyncErrorHandler(async (req, res, next) => {
  console.log(req.params.UserName);
  if (!req.params.UserName) {
    return res.status(400).json({ msg: "Please provide a username" });
  }
  const user = await User.findOne({ username: req.params.UserName });
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json({ data: user });
});

exports.editAdressForUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const adress = await Address.findById(req.body.adressId);
  if (adress.userId.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ msg: "You are not authorized to edit this adress" });
  }
  if (!adress) return res.status(404).json({ msg: "Adress not found" });
  await adress.updateOne(req.body);
  await adress.save();
  const newadress = await Address.findById(req.body.adressId);
  res.status(200).json({ data: newadress });
});

exports.editCart = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const productId = req.params.id;
  const quantity = req.body.quantity;
  const product = user.Cart.products.find(
    (product) => product.productId.toString() === productId
  );
  if (!product)
    return res.status(404).json({ msg: "Product not found in cart" });
  const newproduct = await Product.findById(productId);
  if (!newproduct) return res.status(404).json({ msg: "Product not found" });

  if (!req.body.quantity || isNaN(req.body.quantity)) {
    return res.status(400).json({ msg: "Quantity must be a number" });
  }
  if (req.body.quantity < 1 || req.body.quantity > newproduct.invertoryStock) {
    return res
      .status(400)
      .json({ msg: "Quantity must be between 1 and the  Invertory Stock" });
  }

  product.quantity = +quantity;
  product.imageLink = newproduct.images[0].secure_url;
  product.totalForProduct = +product.price * +quantity;
  user.Cart.totalPrice = 0;
  user.Cart.products.forEach((product) => {
    user.Cart.totalPrice =
      +user.Cart.totalPrice + +product.price * +product.quantity;
  });

  await user.save();
  res.status(200).json({ msg: "Quantity updated in cart", data: user });
});
