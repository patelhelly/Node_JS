const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { requiredSign } = require("../middlewares/authMiddleware.js");
const cartContoller = require("../controllers/cartController.js");
const router = express.Router();

//to add product to cart
router.post(
  "/add-product",
  requiredSign,
  wrapAsync(cartContoller.addProductToCart)
);

//get cart data acc to specific user
router.post("/cart-product", wrapAsync(cartContoller.cartDetail));

//sum cart product price
router.post("/cart-amount", wrapAsync(cartContoller.cartAmount));

//count cart item
router.post("/cart-count", wrapAsync(cartContoller.cartItem));

router.delete("/delete-product", wrapAsync(cartContoller.removeCartItem));

module.exports = router;
