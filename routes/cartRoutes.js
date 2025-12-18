const express = require("express");
const router = express.Router();
const {
    getCartItems,
    addToCart,
    removeFromCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

router.get("/", getCartItems);
router.post("/add", addToCart);
router.delete("/remove/:cartItemId", removeFromCart);

module.exports = router;