const express = require("express");
const router = express.Router();
const productcontroller = require("./../controllers/productcontroller");
const usercontroller = require("../controllers/UserController");
const multer = require("multer");
const UtiilsController = require("./../controllers/UtiilsController");
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
    );
  },
});
let miltiUpload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      console.log(file.originalname);
      return cb(new Error("Please upload an image"));
    }
    cb(null, true);
  },
});

router
  .route("/admin/createProduct")
  .post(
    miltiUpload.array("picture", 10),
    UtiilsController.checkImage,
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    productcontroller.createProduct
  );
router
  .route("/admin/Edit/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    productcontroller.editProduct
  );
router
  .route("/admin/deleteImage/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    productcontroller.deleteImage
  );
router
  .route("/admin/addImage/:id")
  .patch(
    miltiUpload.single("picture"),
    UtiilsController.checkImage,
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    productcontroller.addImage
  );
router
  .route("/admin/Delete/:id")
  .delete(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    productcontroller.deleteProduct
  );

router.route("/get/:id").get(productcontroller.getproduct);

router.route("/getAll").get(productcontroller.getAllproduct);

// router.route("/getTopRatedProducts").get(productcontroller.getTopRatedProducts);
router.route("/latestProduct").get(productcontroller.latestBroduct);
router.route("/bestSeller").get(productcontroller.bestSeller);
router.route("/saleProduct").get(productcontroller.saleProduct);
router.route("/getByCategory/:category").get(productcontroller.getByCategory);
router
  .route("/getByMainCategory/:category")
  .get(productcontroller.getByMainCategory);

router
  .route("/admin/addColor/:id")
  .patch(
    miltiUpload.single("picture"),
    UtiilsController.checkImage,
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    productcontroller.addColor
  );

router
  .route("/admin/removecolor/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    productcontroller.removeColor
  );

router.route("/getAllcolor").get(productcontroller.getAllColor);
router
  .route("/getProductsByColor/:color")
  .get(productcontroller.getProductsByColor);
router
  .route("/getProductsByBrand/:brand")
  .get(productcontroller.getProductsByBrand);
module.exports = router;
