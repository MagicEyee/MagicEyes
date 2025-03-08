const express = require("express");
const router = express.Router();
const OrderController = require("./../controllers/OrderController");
const UserController = require("./../controllers/UserController");
const utillsController = require("./../controllers/UtiilsController");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router
  .route("/createOrder")
  .post(UserController.protect, OrderController.createOrder); //done //done
router
  .route("/getOrder/:id")
  .get(UserController.protect, OrderController.getOrder); //done //done
router
  .route("/admin/getOrder/:id")
  .get(
    UserController.protect,
    UserController.isAdminforInteriorUse,
    OrderController.getAdminOrder
  ); //done //done

router
  .route("/admin/getCustomerOrders/:id")
  .get(
    UserController.protect,
    UserController.isAdminforInteriorUse,
    OrderController.getCustomerOrders
  ); //done //done
router
  .route("/admin/changeStatus/:id")
  .patch(
    UserController.protect,
    UserController.isAdminforInteriorUse,
    OrderController.changeStatus
  ); //done //done

router
  .route("/returnOrder/:id")
  .patch(UserController.protect, OrderController.returnOrder); //done
router
  .route("/cancelOrder/:id")
  .patch(UserController.protect, OrderController.cancelOrder); //done //done
router
  .route("/cancelReturn/:id")
  .patch(UserController.protect, OrderController.cancelReturn); //done

router
  .route("/EditOrder/:id")
  .patch(UserController.protect, OrderController.editOrder); //done //done

router
  .route("/changeAdress/:id")
  .patch(UserController.protect, OrderController.changeAdress); //done //done

router
  .route("/uploadPaymentPicture/:id")
  .patch(
    upload.single("picture"),
    utillsController.checkImage,
    UserController.protect,
    OrderController.uploadPaymentPicture
  ); //done //done

router
  .route("/getAllOredrsForMe")
  .get(UserController.protect, OrderController.getAllOrders); //done //done

router
  .route("/admin/getAllOredrsForAdmin")
  .get(
    UserController.protect,
    UserController.isAdminforInteriorUse,
    OrderController.getAdminOrders
  ); //done //done
router
  .route("/admin/EditOrder/:id")
  .patch(UserController.protect, OrderController.editOrderForAdmin); //done
module.exports = router;
