const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Public
router.post("/register", register);
router.post("/login", login);

// Get current user
router.get("/me", verifyToken, async(req, res) => {
    res.json({ user: req.user });
});

module.exports = router;