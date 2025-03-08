const express = require("express");
const router = express.Router();

const Message = require("../models/MessagesModel");
const nodemailer = require("nodemailer");
const messagecontroller = require("../controllers/MessageController");
const userController = require("../controllers/UserController");
router.route("/createMessage").post(messagecontroller.createMessage); //OMAR
router
  .route("/response/:id")
  .post(
    userController.protect,
    userController.isAdminforInteriorUse,
    messagecontroller.responsemessage
  );

router
  .route("/getAll")
  .get(
    userController.protect,
    userController.isAdminforInteriorUse,
    messagecontroller.getAll
  );
module.exports = router;
