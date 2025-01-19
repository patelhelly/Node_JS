const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { isAdmin, requiredSign } = require("../middlewares/authMiddleware.js");
const productController = require("../controllers/productController.js");
const formidable = require("express-formidable");

const router = express.Router();

//routes
router.post(
  "/create-product",
  requiredSign,
  isAdmin,
  //   formidable(),
  wrapAsync(productController.createProductController)
);

//routes
router.put(
  "/update-product/:id",
  requiredSign,
  isAdmin,
  //   formidable(),
  wrapAsync(productController.updateProductController)
);

//get products
router.get("/get-product", wrapAsync(productController.getProductController));

//single product
router.get(
  "/get-product/:slug",
  wrapAsync(productController.getSingleProductController)
);

// //get photo
// router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete(
  "/delete-product/:id",
  wrapAsync(productController.deleteProductController)
);

//filter product
router.post(
  "/product-filters",
  wrapAsync(productController.productFiltersController)
);

//product count
router.get(
  "/product-count",
  wrapAsync(productController.productCountController)
);

//product per page
router.get(
  "/product-list/:page",
  wrapAsync(productController.productListController)
);

//payment route
router.get("/braintree/token", productController.braintrerTokenController);

router.post(
  "/braintree/payment",
  requiredSign,
  productController.braintrerPaymentController
);

module.exports = router;
