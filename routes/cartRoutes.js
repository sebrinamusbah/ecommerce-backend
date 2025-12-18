const express = require("express");
const router = express.Router();
const {
    addToCart,
    removeFromCart,
    getCartItems,
} = require("../controllers/cartController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Protected routes
router.get("/", verifyToken, getCartItems);
router.post("/add", verifyToken, addToCart);
router.delete("/remove/:cartItemId", verifyToken, removeFromCart);

module.exports = router;