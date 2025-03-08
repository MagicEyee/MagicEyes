const Category = require("../models/CategoryModel");
const asyncErrorHandler = require("../utils/asynsErrorHandler");
const Product = require("../models/BroductsModel");
const cloudinary = require("cloudinary").v2;

// Get all categories
exports.getAllCategories = asyncErrorHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

// Get a single category by ID
exports.getCategoryById = asyncErrorHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json(category);
});

// Create a new category
exports.createCategory = asyncErrorHandler(async (req, res) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  });
  if (req.file) {
    const { public_id, originalName, secure_url, bytes, format } =
      await cloudinary.uploader.upload(req.file.path);
    category.image = {
      public_id,
      originalName,
      secure_url,
      bytes,
      format,
    };
  }

  const newCategory = await category.save();
  res.status(201).json(newCategory);
});

// Update an existing category
exports.updateCategory = asyncErrorHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  category.name = req.body.name || category.name;
  category.description = req.body.description || category.description;

  const updatedCategory = await category.save();
  res.status(200).json(updatedCategory);
});

// Delete a category
exports.deleteCategory = asyncErrorHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await category.remove();
  res.status(200).json({ message: "Category deleted" });
});

// Get all products in a category

exports.getProductsInCategory = asyncErrorHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const products = await Product.find({ mainCategoryID: category._id });
  res.status(200).json(products);
});
exports.getNumberOfProducts = asyncErrorHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const products = await Product.find({ mainCategoryID: category._id });
  res.status(200).json({ count: products.length });
});
