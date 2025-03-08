const Order = require("./../models/OrdersModel");
const asynsErrorHandler = require("../utils/asynsErrorHandler");
const Address = require("./../models/AddressModel");
const AddressModel = require("./../models/AddressModel");
const User = require("./../models/UserModel");
const BroductsModel = require("../models/BroductsModel");
const ShippingModel = require("../models/ShippingModel");
const cloudinary = require("cloudinary").v2;
exports.createOrder = asynsErrorHandler(async (req, res, next) => {
  const user = req.user;
  const products = req.user.Cart.products;

  if (!products || products.length === 0) {
    return res.status(400).json({ msg: "Products are required" });
  }

  const customerName = req.user.firstName + " " + req.user.lastName;
  const phoneNumber = req.user.phoneNumber;
  const customerId = req.user._id;
  const paymentMethod = req.body.paymentMethod;
  let deliveryFee = 0;
  let instapay;
  if (paymentMethod === "instapay" || paymentMethod === "vodafone cash") {
    instapay = {
      paymentPicture: {
        secure_url: "",
        bytes: 0,
        format: "",
        originalName: "",
      },
      paymentStatus: "Pending",
    };
  } else if (paymentMethod === "cash on delivery") {
    deliveryFee = 10;
    instapay = {
      paymentPicture: {
        secure_url: "",
        bytes: 0,
        format: "",
        originalName: "",
      },
      paymentStatus: "NoInstaPay",
    };
  }

  const deliveryAddressID = req.body.deliveryAddressID;
  if (!deliveryAddressID) {
    return res.status(400).json({ msg: "Delivery address is required" });
  }
  const address = await Address.findById(deliveryAddressID);
  if (!address) {
    return res.status(404).json({ msg: "Address not found" });
  }
  if (address.userId.toString() !== user._id.toString()) {
    return res.status(403).json({ msg: "Unauthorized" });
  }

  const shippingPrice = await ShippingModel.findOne({ city: address.city });
  if (!shippingPrice) {
    return res.status(404).json({ msg: "Shipping price not found" });
  }
  const totalPrice =
    req.user.Cart.totalPrice + shippingPrice.shippingPrice + deliveryFee;

  for (const product of products) {
    const p = await BroductsModel.findById(product.productId);
    if (!p) {
      return res.status(404).json({ msg: "Product not found" });
    } else if (p.invertoryStock < product.quantity) {
      return res.status(400).json({ msg: "Product is out of stock" });
    } else {
      p.invertoryStock = p.invertoryStock - product.quantity;
      p.orderedManyTimes = p.orderedManyTimes + product.quantity;
    }
    await p.save();
  }

  const fullAddressText = address.fullAddress;

  const newOrder = new Order({
    products,
    customerName,
    phoneNumber,
    customerId,
    totalPrice,
    paymentMethod,
    instapay,
    deliveryAddressID,
    fullAddressText,
  });

  await newOrder.save();

  req.user.orders.push(newOrder._id);

  req.user.Cart.products = [];
  req.user.Cart.totalPrice = 0;
  await req.user.save();

  res.status(201).json({ data: newOrder });
});

exports.getOrder = asynsErrorHandler(async (req, res, next) => {
  const user = req.user;
  const order = await Order.findById(req.params.id);
  if (user._id.toString() !== order.customerId.toString())
    return res.status(403).json({ msg: "Unauthorized" });
  if (!order) return res.status(404).json({ msg: "Order not found" });
  res.status(200).json({ data: order });
});

exports.changeStatus = asynsErrorHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) return res.status(404).json({ msg: "Order not found" });
  res.status(200).json({ data: order });
});

exports.returnOrder = asynsErrorHandler(async (req, res, next) => {
  const user = req.user;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ msg: "Order not found" });

  if (
    Date.now() >= new Date(order.returnMaxTime).getTime() ||
    order.returnMaxTime == null
  ) {
    return res.status(400).json({ msg: "Return request time exceeded" });
  }
  if (!(order.status == "Delivered")) {
    return res.status(400).json({ msg: "Order must be delivered first" });
  }
  if (user._id.toString() !== order.customerId.toString())
    return res.status(403).json({ msg: "Unauthorized" });

  if (!req.body.products) {
    return res.status(400).json({ msg: "Products are required" });
  }

  const returnedProducts = [];
  const totalPrice = 0;
  req.body.products.forEach(async (element) => {
    const p = order.products.find((e) => {
      return (
        e.productId.toString() == element.productId.toString() &&
        e.quantity >= element.quantity
      );
    });

    if (!p || p == null) {
      return res.status(400).json({ msg: "there is an error in returning " });
    }

    returnedProducts.push({
      productId: p.productId,
      quantity: element.quantity,
      price: p.price,
      Name: p.Name,
      totalForProduct: +p.price * +element.quantity,
    });
    totalPrice = totalPrice + p.price * element.quantity;
  });

  order.isReturned = true;
  order.returnRequestDate = Date.now();
  order.returnRequestStatus = "Requested";
  order.returnedProduct.product = returnedProducts;
  order.returnedProduct.totalPrice = totalPrice;
  order.returnMaxTime = null;
  order.EditMaxTime = null;
  order.status = "returning";
  await order.save();
  const newOrder = await Order.findById(req.params.id);
  res.status(200).json({ data: newOrder });
});

exports.cancelReturn = asynsErrorHandler(async (req, res, next) => {
  const user = req.user;
  const order = await Order.findById(req.params.id);
  if (user._id.toString() !== order.customerId.toString())
    return res.status(403).json({ msg: "Unauthorized" });
  if (!order.returnRequestDate || order.returnRequestDate == null) {
    return res.status(400).json({ msg: "there is no Return request" });
  }
  if (order.returnRequestStatus == "Canceled") {
    return res.status(400).json({ msg: "Return request is already canceled" });
  }
  if (!order.status == "returning") {
    return res
      .status(400)
      .json({ msg: "Return request must be in returning state" });
  }
  if (!order) return res.status(404).json({ msg: "Order not found" });

  order.returnRequestStatus = "Canceled";
  order.returnedProduct = [];
  order.returnMaxTime = null;
  order.status = "canceled";
  order.EditMaxTime = null;

  await order.save();
  res.status(200).json({ data: order });
});

exports.cancelOrder = asynsErrorHandler(async (req, res, next) => {
  const user = req.user;
  const order = await Order.findById(req.params.id);
  if (user._id.toString() !== order.customerId.toString())
    return res.status(403).json({ msg: "Unauthorized" });
  if (!order) return res.status(404).json({ msg: "Order not found" });
  if (!order.status === "Pending") {
    return res.status(400).json({ msg: "Order must be in pending state" });
  }
  if (!order.EnableCancelation) {
    return res.status(400).json({ msg: "Cancel request time exceeded" });
  }

  order.status = "canceled";
  order.returnMaxTime = null;
  order.EditMaxTime = null;
  order.trackingNumber = null;
  order.enableEdit = false;

  order.products.forEach(async (product) => {
    const p = await BroductsModel.findById(product.productId);
    if (!p) {
      return res.status(404).json({ msg: "Product not found" });
    }
    p.invertoryStock = p.invertoryStock + product.quantity;
    p.orderedManyTimes = p.orderedManyTimes - product.quantity;
    await p.save();
  });

  await order.save();

  res.status(200).json({ data: order });
});

exports.editOrder = asynsErrorHandler(async (req, res, next) => {
  const user = req.user;
  const order = await Order.findById(req.params.id);
  if (user._id.toString() !== order.customerId.toString()) {
    return res.status(403).json({ msg: "Unauthorized" });
  }
  if (!order.enableEdit) {
    return res.status(400).json({ msg: "Edit request time exceeded" });
  }
  if (!order) return res.status(404).json({ msg: "Order not found" });
  if (!order.status === "Pending") {
    return res.status(400).json({ msg: "Order must be in pending state" });
  }
  let previusOrderProducts = order.products;
  const products = req.body.products;
  if (products && products.length >= 1) {
    order.products = [];
    order.totalPrice = 0;
    for (const element of products) {
      const p = await BroductsModel.findById(element.productId);
      console.log(order.products);
      const previusProduct = previusOrderProducts.find((e) => {
        return e.productId.toString() === element.productId.toString();
      });
      if (!p) {
        return res.status(404).json({ msg: "Product not found" });
      }
      if (!previusProduct) {
        return res.status(404).json({ msg: "previusProduct not found" });
      }
      // Delete the previusProduct from the previusOrderProducts
      previusOrderProducts = previusOrderProducts.filter(
        (e) => e.productId.toString() !== element.productId.toString()
      );

      order.products.push({
        productId: element.productId,
        quantity: element.quantity,
        price: p.price,
        totalForProduct: +p.price * +element.quantity,
        Name: p.Name,
      });
      p.invertoryStock = p.invertoryStock + previusProduct.quantity;
      p.invertoryStock = p.invertoryStock - element.quantity;
      p.orderedManyTimes = p.orderedManyTimes + element.quantity;
      p.orderedManyTimes = p.orderedManyTimes - previusProduct.quantity;
      order.totalPrice = +order.totalPrice + +p.price * +element.quantity;
      await p.save();
    }
  }
  if (previusOrderProducts.length >= 1) {
    for (const element of previusOrderProducts) {
      const p = await BroductsModel.findById(element.productId);
      p.invertoryStock = p.invertoryStock + element.quantity;
      p.orderedManyTimes = p.orderedManyTimes - element.quantity;
      await p.save();
    }
  }
  if (req.body.paymentMethod) {
    order.paymentMethod = req.body.paymentMethod;
    if (
      req.body.paymentMethod === "instapay" ||
      req.body.paymentMethod === "vodafone cash"
    ) {
      order.instapay.paymentStatus = "Pending";
    } else if (req.body.paymentMethod === "cash on delivery") {
      order.instapay.paymentStatus = "NoInstaPay";
    }
  }
  if (req.body.deliveryAddressID) {
    order.deliveryAddressID = req.body.deliveryAddressID;
    const address = await AddressModel.findById(req.body.deliveryAddressID);
    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }
    if (address.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    order.fullAddressText = address.fullAddress;
  }

  await order.save();
  const newOrder = await Order.findById(req.params.id);
  res.status(200).json({ data: newOrder });
});

exports.changeDeliveryNumber = asynsErrorHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { deliveryPhoneNumber: req.body.deliveryPhoneNumber },
    { new: true }
  );
  if (!order) return res.status(404).json({ msg: "Order not found" });
  res.status(200).json({ data: order });
});

exports.changeAdress = asynsErrorHandler(async (req, res, next) => {
  const user = req.user;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ msg: "Order not found" });
  if (user._id.toString() !== order.customerId.toString()) {
    return res.status(403).json({ msg: "Unauthorized" });
  }
  if (!order.enableEdit) {
    return res.status(400).json({ msg: "Edit request time exceeded" });
  }
  if (order.status !== "Pending") {
    return res.status(400).json({ msg: "Order must be in pending state" });
  }
  if (!req.body.deliveryAddressID) {
    return res.status(400).json({ msg: "Delivery address is required" });
  }
  order.deliveryAddressID = req.body.deliveryAddressID;
  const address = await AddressModel.findById(req.body.deliveryAddressID);
  if (!address) {
    return res.status(404).json({ msg: "Address not found" });
  }
  if (address.userId.toString() !== user._id.toString()) {
    return res.status(403).json({ msg: "Unauthorized" });
  }
  order.fullAddressText = address.fullAddress;
  await order.save();

  res.status(200).json({ data: order });
});

exports.getAllOrders = asynsErrorHandler(async (req, res, next) => {
  const user = req.user;
  const orders = await Order.find({ customerId: user._id });
  res.status(200).json({ Number: orders.length, data: orders });
});

exports.getAdminOrders = asynsErrorHandler(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({ Number: orders.length, data: orders });
});

exports.editOrderForAdmin = asynsErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  const order = await Order.findById(req.body.orderId);
  if (!order) return res.status(404).json({ msg: "Order not found" });

  if (user._id.toString() !== order.customerId.toString()) {
    return res.status(403).json({ msg: "Unauthorized" });
  }
  let previusOrderProducts = order.products;
  const products = req.body.products;
  if (products && products.length >= 1) {
    order.products = [];
    order.totalPrice = 0;
    for (const element of products) {
      const p = await BroductsModel.findById(element.productId);
      console.log(order.products);
      const previusProduct = previusOrderProducts.find((e) => {
        return e.productId.toString() === element.productId.toString();
      });
      if (!p) {
        return res.status(404).json({ msg: "Product not found" });
      }
      if (!previusProduct) {
        return res.status(404).json({ msg: "previusProduct not found" });
      }
      // Delete the previusProduct from the previusOrderProducts
      previusOrderProducts = previusOrderProducts.filter(
        (e) => e.productId.toString() !== element.productId.toString()
      );

      order.products.push({
        productId: element.productId,
        quantity: element.quantity,
        price: p.price,
        totalForProduct: +p.price * +element.quantity,
        Name: p.Name,
      });
      p.invertoryStock = p.invertoryStock + previusProduct.quantity;
      p.invertoryStock = p.invertoryStock - element.quantity;
      p.orderedManyTimes = p.orderedManyTimes + element.quantity;
      p.orderedManyTimes = p.orderedManyTimes - previusProduct.quantity;
      order.totalPrice = +order.totalPrice + +p.price * +element.quantity;
      await p.save();
    }
  } else if (!products || products.length == 0) {
    order.products = [];
    order.totalPrice = 0;
    for (const p of order.products) {
      p.invertoryStock = p.invertoryStock + previusProduct.quantity;
      p.orderedManyTimes = p.orderedManyTimes - previusProduct.quantity;
      order.totalPrice = +order.totalPrice + +p.price * +element.quantity;
      await p.save();
    }
  }
  if (previusOrderProducts.length >= 1) {
    for (const element of previusOrderProducts) {
      const p = await BroductsModel.findById(element.productId);
      p.invertoryStock = p.invertoryStock + element.quantity;
      p.orderedManyTimes = p.orderedManyTimes - element.quantity;
      await p.save();
    }
    order.totalPrice = +order.totalPrice - +p.price * +element.quantity;
  }

  if (req.body.deliveryAddressID) {
    const address = await AddressModel.findById(req.body.deliveryAddressID);
    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }
    if (address.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    order.fullAddressText = address.fullAddress;
    order.deliveryAddressID = req.body.deliveryAddressID;
  }

  await order.updateOne({
    status: req.body.status,
    phoneNumber: req.body.phoneNumber,
    paymentMethod: req.body.paymentMethod,
    isReturned: req.body.isReturned,
    returnRequestStatus: req.body.returnRequestStatus,
    EnableCancelation: req.body.EnableCancelation,
    enableEdit: req.body.enableEdit,
  });
  await order.save();
  const newOrder = await Order.findById(req.body.orderId);
  res.status(200).json({ data: newOrder });
});

exports.uploadPaymentPicture = asynsErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ msg: "Order not found" });
  if (order.paymentMethod !== "instapay") {
    return res.status(400).json({ msg: "Payment method is not instapay" });
  }
  if (order.customerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: "Unauthorized" });
  }
  if (order.instapay.paymentStatus === "NoInstaPay") {
    return res.status(400).json({ msg: "Payment is not required" });
  }

  if (order.instapay.paymentStatus !== "Pending") {
    return res.status(400).json({ msg: "Payment is already done" });
  }
  let uploadedFile = await cloudinary.uploader.upload(req.file.path, {
    folder: "paymentPictures",
    resource_type: "image",
  });
  if (!uploadedFile) {
    return res.status(400).json({ msg: "Error uploading image" });
  }

  order.instapay.paymentPicture = {
    public_id: uploadedFile.public_id,
    secure_url: uploadedFile.secure_url,
    bytes: uploadedFile.bytes,
    format: uploadedFile.format,
    originalName: req.file.originalname,
  };
  order.instapay.paymentStatus = "Uploaded";
  await order.save();
  res.status(200).json({ data: order });
});

exports.getAdminOrder = asynsErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ msg: "Order not found" });
  res.status(200).json({ data: order });
});

exports.getCustomerOrders = asynsErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ customerId: req.params.id });
  res.status(200).json({ Number: orders.length, data: orders });
});
