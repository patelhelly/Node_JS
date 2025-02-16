require("dotenv").config();

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/user.js");

//adding new user
router.post("/register", wrapAsync(userController.register));

router.post("/sign-in", wrapAsync(userController.userSignin));

router.get("/logout", wrapAsync(userController.userLogout));

//updating user detail & deleting user
router.patch("/user-edit", wrapAsync(userController.updateUser));
router.delete("/user-delete", wrapAsync(userController.deleteUser));

module.exports = router;
