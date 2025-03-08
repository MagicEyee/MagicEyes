const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const UserController = require("../controllers/UserController");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
    );
  },
});
const upload = multer({ storage });

// Get all categories
router.get("/getAll", CategoryController.getAllCategories);

// Get category by ID
router.get("/get/:id", CategoryController.getCategoryById);

// Create a new category
router.post(
  "/create",
  upload.single("picture"),
  UserController.protect,
  UserController.isAdminforInteriorUse,
  CategoryController.createCategory
);

// Update a category by ID
router.patch(
  "/update/:id",
  UserController.protect,
  UserController.isAdminforInteriorUse,
  CategoryController.updateCategory
);

// Delete a category by ID
router.delete(
  "/delete/:id",
  UserController.protect,
  UserController.isAdminforInteriorUse,
  CategoryController.deleteCategory
);

router.get("/getNumberOfProducts/:id", CategoryController.getNumberOfProducts);
router.get(
  "/getProductsInCategory/:id",
  CategoryController.getProductsInCategory
);

module.exports = router;
