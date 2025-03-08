const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

let dbnamee;
if (process.env.NODE_ENV == "production") {
  dbnamee = "CircleEye_Production";
} else if (process.env.NODE_ENV == "development") {
  dbnamee = "CircleEye_Dev";
}
const app = require("./app");
mongoose.connect(process.env.CONN_STR, { dbName: dbnamee }).then((CONN) => {
  console.log("DB COnnection Successful");
});

const port = process.env.PORT || 3002;
console.log(process.env.PORT);
module.exports = app;
const server = app.listen(port, () => {
  console.log("server has started in port..." + `${port}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// const express = require("express");
// const app = express();

// // Sample route
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // Export the app (DO NOT use app.listen)
// module.exports = app;
