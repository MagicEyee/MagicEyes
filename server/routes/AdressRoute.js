const express = require("express");
const router = express.Router();
const userController = require("./../controllers/UserController");
const adressController = require("./../controllers/AdressController");
router
  .route("/createAdress")
  .post(userController.protect, adressController.createAdress); //done
router
  .route("/editAdress/:id")
  .patch(userController.protect, adressController.editAdress); //done
router
  .route("/DeleteAdress/:id")
  .delete(userController.protect, adressController.deleteAdress); //done
router
  .route("/getAdress/:id")
  .get(userController.protect, adressController.getAdress); //done

module.exports = router;
