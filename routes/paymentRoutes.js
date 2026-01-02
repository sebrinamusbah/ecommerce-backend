// routes/paymentRoutes.js - UPDATED FOR YOUR MODEL
const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const paymentController = require("../controllers/paymentController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

// Validation middleware
const createIntentValidation = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isUUID()
    .withMessage("Invalid order ID format"),

  validateRequest,
];

const createCODValidation = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isUUID()
    .withMessage("Invalid order ID format"),

  validateRequest,
];

const createPayPalValidation = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isUUID()
    .withMessage("Invalid order ID format"),

  body("transactionId")
    .trim()
    .notEmpty()
    .withMessage("PayPal transaction ID is required"),

  validateRequest,
];

const refundValidation = [
  param("id").isUUID().withMessage("Invalid payment ID format"),

  body("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Reason cannot exceed 500 characters"),

  validateRequest,
];

const updateStatusValidation = [
  param("id").isUUID().withMessage("Invalid payment ID format"),

  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "completed", "failed", "refunded"])
    .withMessage("Invalid status value"),

  validateRequest,
];

// ==================== PUBLIC ROUTES ====================

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhook
// @access  Public (Stripe calls this)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhook,
);

// ==================== USER ROUTES ====================

// All user routes require authentication
router.use(authMiddleware);

// @route   POST /api/payments/create-intent
// @desc    Create Stripe payment intent (credit_card)
// @access  Private
router.post(
  "/create-intent",
  createIntentValidation,
  paymentController.createPaymentIntent,
);

// @route   POST /api/payments/cod
// @desc    Create cash on delivery payment
// @access  Private
router.post(
  "/cod",
  createCODValidation,
  paymentController.createCashOnDelivery,
);

// @route   POST /api/payments/paypal
// @desc    Create PayPal payment
// @access  Private
router.post(
  "/paypal",
  createPayPalValidation,
  paymentController.createPayPalPayment,
);

// @route   GET /api/payments/history
// @desc    Get user's payment history
// @access  Private
router.get("/history", paymentController.getPaymentHistory);

// @route   GET /api/payments/order/:orderId
// @desc    Get payments for an order
// @access  Private
router.get("/order/:orderId", paymentController.getPaymentsByOrder);

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get("/:id", paymentController.getPaymentById);

// ==================== ADMIN ROUTES ====================

// @route   GET /api/payments/admin/all
// @desc    Get all payments
// @access  Private/Admin
router.get("/admin/all", adminMiddleware, paymentController.getAllPayments);

// @route   GET /api/payments/admin/statistics
// @desc    Get payment statistics
// @access  Private/Admin
router.get(
  "/admin/statistics",
  adminMiddleware,
  paymentController.getPaymentStatistics,
);

// @route   PUT /api/payments/admin/:id/status
// @desc    Update payment status
// @access  Private/Admin
router.put(
  "/admin/:id/status",
  adminMiddleware,
  updateStatusValidation,
  paymentController.updatePaymentStatus,
);

// @route   POST /api/payments/:id/refund
// @desc    Refund payment
// @access  Private/Admin
router.post(
  "/:id/refund",
  adminMiddleware,
  refundValidation,
  paymentController.refundPayment,
);

module.exports = router;
