const Shipping = require("./../models/ShippingModel");
const asyncErrorHandler = require("../utils/asynsErrorHandler");
const { check, validationResult } = require("express-validator");

exports.createShipping = [
  check("city").trim().escape(),
  check("shippingPrice").isNumeric().toFloat(),
  asyncErrorHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { city, shippingPrice } = req.body;
    const newShipping = await Shipping.create({
      city,
      shippingPrice,
    });
    res.status(201).json(newShipping);
  }),
];

exports.getShippingPrice = [
  check("CityName").trim().escape(),
  asyncErrorHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { CityName } = req.params;
    const shippingPrice = await Shipping.findOne({ city: CityName });
    if (!shippingPrice) {
      return res
        .status(404)
        .json({ message: "This city is not allowed for shipment" });
    }
    res.status(200).json({ data: shippingPrice });
  }),
];

exports.deleteShipping = [
  check("id").isMongoId(),
  asyncErrorHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const shipping = await Shipping.findByIdAndDelete(id);
    if (!shipping) {
      return res.status(404).json({ message: "Shipping not found" });
    }
    res.status(200).json({ message: "Shipping deleted successfully" });
  }),
];

exports.editShipping = [
  check("id").isMongoId(),
  check("city").trim().escape(),
  check("shippingPrice").isNumeric().toFloat(),
  asyncErrorHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { city, shippingPrice } = req.body;
    const updatedShipping = await Shipping.findByIdAndUpdate(
      id,
      { city, shippingPrice },
      { new: true, runValidators: true }
    );
    if (!updatedShipping) {
      return res.status(404).json({ message: "Shipping not found" });
    }
    res.status(200).json(updatedShipping);
  }),
];
