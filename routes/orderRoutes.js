// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const orderController = require("../controllers/orderController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

// Validation middleware
const createOrderValidation = [
  body("shippingAddress")
    .trim()
    .notEmpty()
    .withMessage("Shipping address is required")
    .isLength({ min: 10 })
    .withMessage("Shipping address must be at least 10 characters"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),

  validateRequest,
];

const updateShippingValidation = [
  param("id").isUUID().withMessage("Invalid order ID format"),

  body("shippingAddress")
    .trim()
    .notEmpty()
    .withMessage("Shipping address is required")
    .isLength({ min: 10 })
    .withMessage("Shipping address must be at least 10 characters"),

  validateRequest,
];

const updateStatusValidation = [
  param("id").isUUID().withMessage("Invalid order ID format"),

  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid status value"),

  validateRequest,
];

// ==================== USER ROUTES ====================

// All user routes require authentication
router.use(authMiddleware);

// @route   POST /api/orders
// @desc    Create new order from cart
// @access  Private
router.post("/", createOrderValidation, orderController.createOrder);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get("/", orderController.getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get("/:id", orderController.getOrderById);

// @route   GET /api/orders/number/:orderNumber
// @desc    Get order by order number
// @access  Private
router.get("/number/:orderNumber", orderController.getOrderByNumber);

// @route   GET /api/orders/:id/track
// @desc    Track order status
// @access  Private
router.get("/:id/track", orderController.trackOrder);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put("/:id/cancel", orderController.cancelOrder);

// @route   PUT /api/orders/:id/shipping
// @desc    Update shipping address
// @access  Private
router.put(
  "/:id/shipping",
  updateShippingValidation,
  orderController.updateShippingAddress,
);

// ==================== ADMIN ROUTES ====================

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get("/admin/all", adminMiddleware, orderController.getAllOrders);

// @route   GET /api/orders/admin/statistics
// @desc    Get order statistics (Admin)
// @access  Private/Admin
router.get(
  "/admin/statistics",
  adminMiddleware,
  orderController.getOrderStatistics,
);

// @route   PUT /api/orders/admin/:id/status
// @desc    Update order status (Admin)
// @access  Private/Admin
router.put(
  "/admin/:id/status",
  adminMiddleware,
  updateStatusValidation,
  orderController.updateOrderStatus,
);

module.exports = router;
