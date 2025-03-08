const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cookiesMiddleware = require("universal-cookie-express");
const UserRoute = require("./routes/UserRoute");
const OrderRoute = require("./routes/OrderRoute");
const AdsRoute = require("./routes/AdsRoute");
const AdressRoute = require("./routes/AdressRoute");
const categoryRoute = require("./routes/CategoryRoute");
const ShippingRoute = require("./routes/Shipping");
const NewsletterRoute = require("./routes/NewsLetter");
// const aboutUsRoute = require("./routes/aboutUsRoute");
// const OwnerRoute = require("./routes/OwnerRoute");
// const ContactRoute = require("./routes/contactRoute");
const productRoute = require("./routes/productRoute");
const messageRoute = require("./routes/messagesRoute");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

const BrandRoute = require("./routes/BrandsRoute");

dotenv.config({ path: "./config.env" });

let app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cookiesMiddleware());
app.use(express.static("./public"));
app.use(
  cors({
    origin: "https://magicceyee.netlify.app",
    credentials: true,
    withCredentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.APIKey,
  api_secret: process.env.APISecret,
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" }); // Welcome message for any unmatched route
});
app.use("/user", UserRoute);
app.use("/order", OrderRoute);
app.use("/ads", AdsRoute);
app.use("/adress", AdressRoute);
app.use("/shipping", ShippingRoute);
app.use("/newsletter", NewsletterRoute);
// app.use("/aboutUs", aboutUsRoute);
// app.use("/owner", OwnerRoute);
// app.use("/contact", ContactRoute);

app.use("/Brands", BrandRoute);
app.use("/product", productRoute);
app.use("/message", messageRoute);
app.use("/category", categoryRoute);
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `can't find ${req.originalUrl} on the server`,
  });

  // const err = new Error(`can't find ${req.originalUrl} on the server`);
  // err.status = "fail";
  // err.statusCode = 404;

  // const err = new CustomError(
  //   `can't find ${req.originalUrl} on the server`,
  //   404
  // );
  // next(err);
});
app.use(express.static("public"));

module.exports = app;
