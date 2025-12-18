const express = require("express");
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
} = require("../controllers/orderController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

// User
router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getUserOrders);
router.get("/:id", verifyToken, getOrderById);

// Admin
router.put(
    "/:id/status",
    verifyToken,
    authorizeRole("admin"),
    updateOrderStatus
);

module.exports = router;