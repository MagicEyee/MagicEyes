const express = require("express");
const {
  getAllBrands,
  createBrand,
  deleteBrand,
} = require("../controllers/BrandsController");
const multer = require("multer");
const UtiilsController = require("./../controllers/UtiilsController");
const UserController = require("./../controllers/UserController");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

const router = express.Router();

// Get all brands
router.get("/", getAllBrands);

// Create a new brand
router.post(
  "/",
  upload.single("picture"),
  UserController.protect,
  UserController.isAdminforInteriorUse,
  UtiilsController.checkImage,
  createBrand
);

// Delete a brand
router.delete("/:id", deleteBrand);

module.exports = router;
