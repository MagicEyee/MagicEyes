const mongoose = require("mongoose");

const BroductSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      unique: true,
    },
    Brand: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 50,
    },
    categories: {
      type: [String],
      required: true,
      default: [],
    },
    mainCategory: {
      type: String,
      required: true,
    },
    mainCategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    discription: {
      type: String,
      minlength: 10,
      maxlength: 1000,
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        originalName: {
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
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    variants: [
      {
        images: [
          {
            public_id: {
              type: String,
            },
            originalName: {
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
          },
        ],
        name: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 50,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
          default: this.price,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
        inStock: {
          type: Boolean,
          required: true,
          default: true,
        },
      },
    ],
    invertoryStock: {
      type: Number,
      required: true,
      min: 0,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    orderedManyTimes: {
      type: Number,
      required: false,
      default: 0,
    },
    returnedManyTimes: {
      type: Number,
      required: false,
      default: 0,
    },
    avaliable: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: {
      type: String,
      required: false,
    },
    salePrice: {
      type: Number,
      required: false,
      validators: {
        validator: function (value) {
          return value >= this.price;
        },
        message: "Sale price must be a >= the actual Price.",
      },
    },
    thereIsSale: {
      type: Boolean,
      required: true,
      default: false,
    },
    // reviews: [
    //   {
    //     userId: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User",
    //     },
    //     rating: {
    //       type: Number,
    //       min: 1,
    //       max: 5,
    //     },
    //     comment: {
    //       type: String,
    //       minlength: 2,
    //       maxlength: 1000,
    //     },
    //     createdAt: {
    //       type: Date,
    //       default: Date.now(),
    //     },
    //   },
    // ],
    // avgRating: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    //   max: 5,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", BroductSchema);
