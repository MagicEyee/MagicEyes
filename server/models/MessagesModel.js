const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const messageSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Email: {
      type: String,
      required: true,
      trim: true,
      validator: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
      },
    },
    Phone: {
      type: String,
      trim: true,
    },
    Message: {
      type: String,
      required: true,
      maxLength: 500,
    },
    response: {
      type: String,
      default: null,
      maxLength: 500,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Message", messageSchema);
