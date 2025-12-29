const express = require("express");
const router = express.Router();
const {
    getCartItems,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middlewares/authMiddleware");

// All cart routes require authentication
router.use(protect);

router.route("/").get(getCartItems).post(addToCart).delete(clearCart);

router.route("/:id").put(updateCartItem).delete(removeCartItem);

module.exports = router;