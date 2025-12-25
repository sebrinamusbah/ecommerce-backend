const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
    getUserProfile,
    updateUserProfile,
    getUserOrders,
} = require("../controllers/userController");

router.use(protect);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.get("/orders", getUserOrders);

module.exports = router;