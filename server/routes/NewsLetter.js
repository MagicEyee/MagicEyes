const express = require("express");
const router = express.Router();
const newslettermodel = require("./../models/newsLetter");
const userController = require("../controllers/UserController");

const asyncErrorhandler = require("./../utils/asynsErrorHandler");
router.route("/signup").post(
  asyncErrorhandler(async function (req, res) {
    const newSubscription = new newslettermodel({
      email: req.body.email,
    });
    await newSubscription.save();

    res
      .status(200)
      .json({ message: "Newsletter subscription request received" });
  })
);
router.route("/getAll").get(
  userController.protect,
  userController.isAdminforInteriorUse,
  asyncErrorhandler(async (req, res) => {
    const newsletters = await newslettermodel.find({});
    res.json(newsletters);
  })
);

module.exports = router;
