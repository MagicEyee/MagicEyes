const express = require("express");
const ShippingController = require("./../controllers/ShippingController");
const usercontroller = require("../controllers/UserController");

const router = express.Router();

router
  .route("/createshipping")
  .post(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    ShippingController.createShipping
  );

router
  .route("/getShippingPrice/:CityName")
  .get(ShippingController.getShippingPrice);

router
  .route("/deleteShipping/:id")
  .delete(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    ShippingController.deleteShipping
  );
router
  .route("/editShipping/:id")
  .delete(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    ShippingController.editShipping
  );
module.exports = router;
