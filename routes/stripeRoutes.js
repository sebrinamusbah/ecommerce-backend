const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/stripeController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Protected
router.post("/checkout", verifyToken, createCheckoutSession);

module.exports = router;