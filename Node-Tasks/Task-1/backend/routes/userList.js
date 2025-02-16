const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/userList.js");

//displaying user details & adding new user
router.get("/list", wrapAsync(userController.showUserList));

module.exports = router;
