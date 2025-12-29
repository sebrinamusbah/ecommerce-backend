const express = require("express");
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
} = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/auth");

// User routes
router.use(protect);

router.route("/").post(createOrder).get(getMyOrders);

router.route("/:id").get(getOrderById);

// Admin routes
router.route("/admin/all").get(protect, admin, getAllOrders);

router.route("/admin/:id/status").put(protect, admin, updateOrderStatus);

module.exports = router;