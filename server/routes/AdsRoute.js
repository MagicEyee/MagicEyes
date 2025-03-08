const express = require("express");
const router = express.Router();
const AdsFornav = require("../models/AdsFornavModel");
const multer = require("multer");
const UtiilsController = require("./../controllers/UtiilsController");
const userController = require("./../controllers/UserController");
const adsControlller = require("../controllers/AdsController");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

router
  .route("/createAds")
  .post(
    upload.single("picture"),
    UtiilsController.checkImage,
    userController.protect,
    userController.isAdminforInteriorUse,
    adsControlller.createAd
  ); //OMAR
router
  .route("/editAd/:id")
  .patch(
    userController.protect,
    userController.isAdminforInteriorUse,
    adsControlller.editAd
  ); //OMAR
router
  .route("/changeActivation/:id")
  .post(
    userController.protect,
    userController.isAdminforInteriorUse,
    adsControlller.changeActivation
  ); //OMAR

router
  .route("/deleteAd/:id")
  .delete(
    userController.protect,
    userController.isAdminforInteriorUse,
    adsControlller.deleteAd
  );
router
  .route("/get/:id")
  .delete(
    userController.protect,
    userController.isAdminforInteriorUse,
    adsControlller.getAdById
  );

router.route("/getAll").get(userController.protect, adsControlller.getAllAds);

module.exports = router;
