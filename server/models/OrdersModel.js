const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

const genetateTrackingNumber = () => {
  return `TRK-${crypto.randomUUID().toUpperCase()}`;
};

const OrderSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      default: genetateTrackingNumber,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,

      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, "ar-EG");
        },
        message: "{VALUE} is not a valid phone number",
      },
    },
    customerId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
        },
        totalForProduct: {
          type: Number,
          required: true,
          default: 0,
        },
        Name: {
          type: String,
          required: true,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Processing",
        "waiting for payment",
        "shipping",
        "Shipped",
        "Delivered",
        "canceled",
        "returning",
        "returned",
      ],
      default: "Processing",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash on delivery", "Vodafone Cash", "instapay"],
      required: true,
    },
    instapay: {
      paymentPicture: {
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
        originalName: {
          type: String,
        },
      },
      paymentStatus: {
        type: String,
        enum: ["NoInstaPay", "Uploaded", "Pending", "Accepted", "Rejected"],
        default: "NoInstaPay",
      },
    },

    deliveryAddressID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addresses",
      required: true,
    },
    fullAddressText: {
      type: String,
      required: true,
    },
    enableReturn: {
      type: Boolean,
      default: true,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },

    returnRequestDate: {
      type: Date,
      default: null,
    },

    returnRequestStatus: {
      type: String,
      enum: [
        "NoReturnYet",
        "Requested",
        "Pending",
        "onWay",
        "Canceled",
        "Returned",
        "Accepted",
        "Rejected",
      ],
      default: "NoReturnYet",
    },

    EnableCancelation: {
      type: Boolean,
      default: true,
    },

    returnedProduct: {
      product: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
            default: 1,
          },
          price: {
            type: Number,
          },
          totalForProduct: {
            type: Number,
            default: 0,
            validate: {
              validator: function (v) {
                return v >= 0;
              },
              message: "{VALUE} must be a positive number",
            },
          },
          Name: {
            type: String,
            required: true,
          },
        },
      ],
      totalPrice: {
        type: Number,
      },
    },

    returnMaxTime: {
      type: Date,
      default: Date.now() + 1209600000,
    },

    enableEdit: {
      type: Boolean,
      default: true,
    },

    deliveredDate: {
      type: Date,
      default: null,
    },

    returnreason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
