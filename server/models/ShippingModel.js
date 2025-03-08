const mongoose = require("mongoose");

const ShippingSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  shippingPrice: {
    type: Number,
    required: true,
  },
});

const Shipping = mongoose.model("Shipping", ShippingSchema);

module.exports = Shipping;
