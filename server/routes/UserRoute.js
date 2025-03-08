const express = require("express");
const usercontroller = require("../controllers/UserController");
// const { route } = require("./OrderRoute");
// controller import
const router = express.Router();
router.route("/register").post(usercontroller.register); //done
router
  .route("/admin/getUserById/:id")
  .get(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    usercontroller.getUser
  ); //done

router
  .route("/admin/getUserByEmail/:email")
  .get(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    usercontroller.getUserByEmail
  ); //done
router
  .route("/admin/getUserByusername/:UserName")
  .get(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    usercontroller.getUserByUserName
  ); //done

router.route("/getMe").get(usercontroller.protect, usercontroller.getMe); //done

router.route("/login").post(usercontroller.isActive, usercontroller.login); //done

router.route("/resetpassword/:token").patch(usercontroller.resetPassword);

router
  .route("/forgotpassword")
  .patch(usercontroller.isActive, usercontroller.forgotPassword); //done

router
  .route("/edit")
  .patch(usercontroller.protect, usercontroller.updateUserDetails); //done
router
  .route("/delete")
  .patch(usercontroller.protect, usercontroller.deleteUser); //done

router
  .route("/changePassword")
  .patch(usercontroller.protect, usercontroller.changePassword); //done

router
  .route("/admin/changeUserToAdmin/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isSuberAdminforInteriorUse,
    usercontroller.changeUserToAdmin
  );

router
  .route("/admin/changeAdminToUser/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isSuberAdminforInteriorUse,
    usercontroller.changeAdminToUser
  );
router
  .route("/admin/changeSAdminToAdmin/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isSuberAdminforInteriorUse,
    usercontroller.changeSAdminToAdmin
  );
router
  .route("/admin/changeAdminToSAdmin/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isSuberAdminforInteriorUse,
    usercontroller.changeAdminToSAdmin
  );
router.route("/isAdmin").get(usercontroller.protect, usercontroller.isAdmin); //done

router
  .route("/getAllAdressForMe")
  .get(usercontroller.protect, usercontroller.getAllAdressForMe); //done

router
  .route("/admin/getAllAdressForUser/:id")
  .get(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    usercontroller.getAllAdressForUser
  );

router
  .route("/admin/editAdress/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    usercontroller.editAdressForUser
  ); //done

router
  .route("/admin/getAllAdmins")
  .get(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    usercontroller.getAllAdmins
  ); //done

router
  .route("/addtoWishList/:id")
  .post(usercontroller.protect, usercontroller.addToWishList); //done
router
  .route("/addTocart/:id")
  .post(usercontroller.protect, usercontroller.addToCart); //done

router
  .route("/editCart/:id")
  .patch(usercontroller.protect, usercontroller.editCart); //done
router
  .route("/DeleteFormWishList/:id")
  .post(usercontroller.protect, usercontroller.DeleteFormWishList); //done
router
  .route("/addAllToCart")
  .post(usercontroller.protect, usercontroller.addAllToCart); //done
router
  .route("/EditQuatityInWishList/:id")
  .patch(usercontroller.protect, usercontroller.EditQuatityInWishList); //done

router
  .route("/deleteFromCart/:id")
  .post(usercontroller.protect, usercontroller.DeleteFromCart); //done

router
  .route("/getwishList")
  .get(usercontroller.protect, usercontroller.getwishList); //done

router.route("/getCart").get(usercontroller.protect, usercontroller.getCart);

// router
//   .route("/getAllOrders")
//   .get(usercontroller.protect, usercontroller.getAllOrders); //createOrder

router
  .route("/admin/edit/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    usercontroller.updateUserDetailsForUser
  ); //done

router
  .route("/admin/delete/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    usercontroller.deleteUserForUser
  ); //done

router
  .route("/admin/reActive/:id")
  .patch(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    usercontroller.reActiveUserForUser
  ); //done
router
  .route("/admin/getAllUser")
  .get(
    usercontroller.protect,
    usercontroller.isAdminforInteriorUse,
    usercontroller.getAllUsers
  ); //done

module.exports = router;
