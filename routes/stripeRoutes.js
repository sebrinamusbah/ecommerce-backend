const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/stripeController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createCheckoutSession);

module.exports = router;