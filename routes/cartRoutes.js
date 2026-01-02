// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const cartController = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

// All cart routes require authentication
router.use(authMiddleware);

// Validation middleware
const addToCartValidation = [
  body("bookId")
    .notEmpty()
    .withMessage("Book ID is required")
    .isUUID()
    .withMessage("Invalid book ID format"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  validateRequest,
];

const updateCartValidation = [
  param("id").isUUID().withMessage("Invalid cart item ID format"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be 0 or greater"),

  validateRequest,
];

const removeCartValidation = [
  param("id").isUUID().withMessage("Invalid cart item ID format"),

  validateRequest,
];

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get("/", cartController.getCart);

// @route   GET /api/cart/count
// @desc    Get cart item count
// @access  Private
router.get("/count", cartController.getCartCount);

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post("/", addToCartValidation, cartController.addToCart);

// @route   PUT /api/cart/:id
// @desc    Update cart item quantity
// @access  Private
router.put("/:id", updateCartValidation, cartController.updateCartItem);

// @route   DELETE /api/cart/:id
// @desc    Remove item from cart
// @access  Private
router.delete("/:id", removeCartValidation, cartController.removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete("/", cartController.clearCart);

// @route   POST /api/cart/:id/move-to-wishlist
// @desc    Move item to wishlist
// @access  Private
router.post(
  "/:id/move-to-wishlist",
  removeCartValidation,
  cartController.moveToWishlist,
);

module.exports = router;
