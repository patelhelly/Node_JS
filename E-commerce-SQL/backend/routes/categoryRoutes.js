const express = require("express");
const asyncHandler = require("express-async-handler");
const wrapAsync = require("../utils/wrapAsync.js");
const { isAdmin, requiredSign } = require("../middlewares/authMiddleware.js");
const categoryController = require("../controllers/categoryController.js");

const router = express.Router();

//routes
// create category
router.post(
  "/create-category",
  requiredSign,
  isAdmin,
  wrapAsync(categoryController.createCategoryController)
);

//update category
router.put(
  "/update-category/:id",
  requiredSign,
  isAdmin,
  wrapAsync(categoryController.updateCategoryController)
);

//getALl category
router.get(
  "/get-category",
  asyncHandler((req, res, next) => {
    console.log("Route /get-category hit"); // Add this line
    categoryController.getCategoryController(req, res, next);
  })
);

//single category
router.get(
  "/single-category/:slug",
  wrapAsync(categoryController.singleCategoryController)
);

//delete category
router.delete(
  "/delete-category/:id",
  requiredSign,
  isAdmin,
  wrapAsync(categoryController.deleteCategoryController)
);

module.exports = router;
