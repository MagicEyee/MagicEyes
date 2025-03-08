const Product = require("./../models/BroductsModel");
const asyncErrorHandler = require("./../utils/asynsErrorHandler");
const cloudinary = require("cloudinary").v2;
const Category = require("./../models/CategoryModel");
const asynsErrorHandler = require("./../utils/asynsErrorHandler");
exports.getByCategory = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find({
    categories: req.params.category,
  });
  res.status(200).json({ data: products });
});
exports.getByMainCategory = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find({
    mainCategoryID: req.params.categoryID,
  });
  res.status(200).json({ data: products });
});
exports.editInverntoryStock = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { invertoryStock: req.body.count },
    { new: true }
  );
  if (!product) return res.status(404).json({ msg: "Product not found" });
  res.status(200).json({ data: product });
});

exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;

  let product = new Product(req.body);

  console.log(req.body.mainCategoryID);
  const mainCategory = await Category.findById(req.body.mainCategoryID);
  if (!mainCategory) {
    return res.status(404).json({ msg: "Main category not found" });
  }

  if (!req.body.Name) {
    return res.status(400).json({ msg: "Name is required" });
  }
  if (!req.body.Brand) {
    return res.status(400).json({ msg: "Brand is required" });
  }
  product.mainCategory = mainCategory.name;
  let itemsProcessed = 0;

  req.files.forEach(async (element, index, array) => {
    let uploadedFile = await cloudinary.uploader.upload(element.path, {
      folder: "productsImages",
      resource_type: "image",
    });
    console.log(uploadedFile);

    product.images.push({
      public_id: uploadedFile.public_id,
      originalName: element.originalname,
      secure_url: uploadedFile.secure_url,
      bytes: uploadedFile.bytes,
      format: uploadedFile.format,
    });

    itemsProcessed++;
    if (itemsProcessed === array.length) {
      callback(product);
    }
  });
  async function callback(product) {
    await product.save();
    res.status(200).json({ data: product });
  }
});
exports.uploadImages = asyncErrorHandler(async (req, res, next) => {
  await cloudinary.uploader.upload(req.file.path, {
    folder: "productsImages",
    resource_type: "image",
  });
  next();
});

// exports.createProduct = asyncErrorHandler(async (req, res, next) => {});

exports.editProduct = asyncErrorHandler(async (req, res, next) => {
  const Name = req.body.Name;
  const Brand = req.body.Brand;
  var categories;
  if (
    typeof req.body.categories === Array ||
    req.body.categories === undefined
  ) {
    categories = req.body.categories;
  } else if (typeof req.body.categories !== Array) {
    categories = req.body.categories.trim().split(" ");
  }
  const mainCategory = req.body.mainCategory;
  const price = req.body.Price;
  const invertoryStock = req.body.invertoryStock;
  const inStock = req.body.inStock;
  const avaliable = req.body.available;
  const description = req.body.Description;
  const salePrice = req.body.SalePrice;
  const thereIsSale = req.body.thereIsSale;
  console.log(description);
  const product = await Product.findByIdAndUpdate(
    req.params.id.toString(),
    {
      Name,
      Brand,
      categories,
      mainCategory,
      price,
      invertoryStock,
      inStock,
      avaliable,
      description,
      salePrice,
      thereIsSale,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product) return res.status(404).json({ msg: "Product not found" });
  res.status(200).json({ data: product });
});

exports.deleteImage = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ msg: "Product not found" });
  const e = product.images.find((e) => {
    return e.public_id === req.body.public_id;
  });
  if (!e) return res.status(404).json({ msg: "Image not found" });

  cloudinary.uploader
    .destroy(e.public_id, function (result) {
      console.log(result);
    })
    .then(console.log("deleted"))
    .catch((e) => console.log(e));

  product.images = product.images.filter((e) => {
    return e.public_id !== req.body.public_id;
  });
  await product.save();
  res.status(200).json({ data: product });
});
exports.addImage = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ msg: "Product not found" });
  console.log(req.file);
  let uploadedFile = await cloudinary.uploader
    .upload(req.file.path, {
      folder: "productsImages",
      resource_type: "image",
    })
    .catch((e) => res.status(400).json({ msg: "Image not uploaded" }));
  product.images.push({
    public_id: uploadedFile.public_id,
    originalName: req.file.originalname,
    secure_url: uploadedFile.secure_url,
    bytes: uploadedFile.bytes,
    format: uploadedFile.format,
  });
  await product.save();
  res.status(200).json({ data: product });
});

exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  product.images.forEach((e) => {
    cloudinary.uploader
      .destroy(e.public_id, function (result) {
        console.log(result);
      })
      .then(console.log("deleted"))
      .catch((e) => console.log(e));
  });
  if (!product) return res.status(404).json({ msg: "Product not found" });
  res.status(200).json({ msg: "Product deleted successfully" });
});

exports.getproduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ msg: "Product not found" });
  res.status(200).json({ data: product });
});
exports.getAllproduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.find({});
  if (!product) return res.status(404).json({ msg: "Product not found" });
  res.status(200).json({ data: product });
});

exports.setReview = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ msg: "Product not found" });
  if (
    product.reviews.find((e) => e.userId.toString() === req.user._id.toString())
  ) {
    return res
      .status(400)
      .json({ msg: "You have already reviewed this product" });
  }
  if (!product.reviews) {
    product.reviews = [];
    product.avgRating = 0;
  }
  const avgRating =
    (product.reviews.reduce((acc, curr) => acc + +curr.rating, 0) +
      req.body.rating) /
    (product.reviews.length + 1);

  product.reviews.push({
    userId: req.user._id,
    comment: req.body.comment,
    rating: req.body.rating,
  });
  product.avgRating = avgRating;
  await product.save();
  res.status(200).json({ data: product });
});

exports.editReview = asyncErrorHandler(async () => {
  const user = req.user;
  const Product = await Product.findById(req.params.id);
  const review = Product.reviews.find((e) => {
    return e.userId.toString() === user._id.toString();
  });
  if (!review) return res.status(404).json({ msg: "Review not found" });
  review.rating = req.body.rating;
  review.comment = req.body.comment;
  const avgRating =
    Product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
    Product.reviews.length;
  Product.avgRating = avgRating;
  if (!Product) return res.status(404).json({ msg: "Product not found" });
  await Product.save();
  res.status(200).json({ data: Product });
});

exports.deleteReview = asyncErrorHandler(async () => {
  const user = req.user;
  const product = await Product.findById(req.params.id);
  const review = Product.reviews.find((e) => {
    return e.userId.toString() === user.id.toString();
  });
  if (!review) return res.status(404).json({ msg: "Review not found" });
  Product.reviews = Product.reviews.filter((e) => {
    return e.userId.toString() !== user.id.toString();
  });
  if (!product) return res.status(404).json({ msg: "Product not found" });
  const avgRating =
    product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
    product.reviews.length;
  product.avgRating = avgRating;
  await product.save();

  res.status(200).json({ data: Product });
});

exports.getTopRatedProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find({})
    .sort({ orderedManyTimes: -1 })
    .limit(5);
  res.status(200).json({ data: products });
});

exports.bestSeller = asynsErrorHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ orderedManyTimes: -1 })
    .limit(12);
  res.status(200).json({ data: products });
});

exports.searchProducts = asyncErrorHandler(async (req, res, next) => {
  const query = req.query.q;
  const regex = new RegExp(query, "gi");
  const products = await Product.find({
    $or: [
      { Name: regex },
      { Brand: regex },
      { categories: { $in: query.split(" ") } },
      { description: regex },
    ],
  });
  res.status(200).json({ data: products });
});

exports.latestBroduct = asyncErrorHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(12);
  res.status(200).json({ data: products });
});

exports.saleProduct = asyncErrorHandler(async (req, res) => {
  const products = await Product.find({ thereIsSale: true })
    .sort({ salePrice: 1 })
    .limit(12);
  res.status(200).json({ data: products });
});

exports.getProductsByBrand = asyncErrorHandler(async (req, res) => {
  const brand = req.params.brand;
  const products = await Product.find({ Brand: brand }).sort({ createdAt: -1 });
  res.status(200).json({ data: products });
});

exports.addColor = asyncErrorHandler(async (req, res) => {
  let uploadedFile;
  if (req.file) {
    uploadedFile = await cloudinary.uploader.upload(req.file.path, {
      folder: "productsImages",
      resource_type: "image",
    });
  }

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ msg: "Product not found" });
  if (product.variants.includes(req.body.color)) {
    return res
      .status(400)
      .json({ msg: "This color already exists in the product" });
  }
  if (req.body.stock > product.invertoryStock) {
    return res.status(400).json({
      msg: "The stock value cannot be greater than the inventory stock",
    });
  }

  product.variants.push({
    name: req.body.color,
    inStock: req.body.inStock,
    price: req.body.price || product.price,
    stock: req.body.stock,
  });
  if (uploadedFile) {
    product.variants[product.variants.length - 1].images.push({
      public_id: uploadedFile.public_id,
      originalName: req.file.originalname,
      secure_url: uploadedFile.secure_url,
      bytes: uploadedFile.bytes,
      format: uploadedFile.format,
    });
  }

  await product.save();
  res.status(200).json({ data: product });
});

exports.removeColor = asyncErrorHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ msg: "Product not found" });
  const variantIndex = product.variants.findIndex(
    (variant) => variant.name === req.body.color
  );
  if (variantIndex === -1) {
    return res.status(404).json({ msg: "Color not found in the product" });
  }
  product.variants.splice(variantIndex, 1);
  await product.save();
  res.status(200).json({ data: product });
});

exports.getAllColor = asyncErrorHandler(async (req, res) => {
  const products = await Product.find({});
  const variantNames = new Set();

  products.forEach((product) => {
    product.variants.forEach((variant) => {
      variantNames.add(variant.name);
    });
  });

  res.status(200).json({ data: Array.from(variantNames) });
});

exports.getProductsByColor = asyncErrorHandler(async (req, res) => {
  const color = req.params.color;
  const products = await Product.find({
    "variants.name": color,
  }).sort({ createdAt: -1 });
  res.status(200).json({ data: products });
});
