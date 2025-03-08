const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    logo: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
      bytes: {
        type: Number,
      },
      format: {
        type: String,
      },
      original_filename: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brand", BrandSchema);
