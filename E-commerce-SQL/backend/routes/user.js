require("dotenv").config();

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/user.js");
const { requiredSign, isAdmin } = require("../middlewares/authMiddleware.js");

//adding new user
router.post("/register", wrapAsync(userController.register));

router.post("/sign-in", wrapAsync(userController.userSignin));

router.get("/logout", wrapAsync(userController.userLogout));

//to test protected routing
router.get("/test", requiredSign, isAdmin, wrapAsync(userController.testRoute));

//protected route auth
router.get("/user-auth", requiredSign, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected route auth
router.get("/admin-auth", requiredSign, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//updating user detail & deleting user
router.patch("/user-edit", wrapAsync(userController.updateUser));
router.delete("/user-delete", wrapAsync(userController.deleteUser));
router.get("/user-list", wrapAsync(userController.showUserList));

//orders
router.get(
  "/orders",
  requiredSign,
  wrapAsync(userController.getUserOrderController)
);

module.exports = router;
