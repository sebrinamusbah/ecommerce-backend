// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const reviewController = require("../controllers/reviewController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

// Validation middleware
const createReviewValidation = [
  body("bookId")
    .notEmpty()
    .withMessage("Book ID is required")
    .isUUID()
    .withMessage("Invalid book ID format"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Comment cannot exceed 2000 characters"),

  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  validateRequest,
];

const updateReviewValidation = [
  param("id").isUUID().withMessage("Invalid review ID format"),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Comment cannot exceed 2000 characters"),

  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  validateRequest,
];

const reportReviewValidation = [
  param("id").isUUID().withMessage("Invalid review ID format"),

  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Reason is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Reason must be 10-500 characters"),

  validateRequest,
];

const adminDeleteValidation = [
  param("id").isUUID().withMessage("Invalid review ID format"),

  body("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Reason cannot exceed 500 characters"),

  validateRequest,
];

// ==================== PUBLIC ROUTES ====================

// @route   GET /api/books/:bookId/reviews
// @desc    Get reviews for a book
// @access  Public
router.get("/books/:bookId/reviews", reviewController.getBookReviews);

// @route   GET /api/reviews/recent
// @desc    Get recent reviews
// @access  Public
router.get("/recent", reviewController.getRecentReviews);

// @route   GET /api/reviews/top-rated
// @desc    Get top rated books
// @access  Public
router.get("/top-rated", reviewController.getTopRatedBooks);

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
router.get("/:id", reviewController.getReviewById);

// ==================== USER ROUTES ====================

// All user routes require authentication
router.use(authMiddleware);

// @route   GET /api/users/me/reviews
// @desc    Get user's reviews
// @access  Private
router.get("/users/me/reviews", reviewController.getUserReviews);

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post("/", createReviewValidation, reviewController.createReview);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put("/:id", updateReviewValidation, reviewController.updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete("/:id", reviewController.deleteReview);

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post("/:id/helpful", reviewController.markAsHelpful);

// @route   POST /api/reviews/:id/report
// @desc    Report a review
// @access  Private
router.post(
  "/:id/report",
  reportReviewValidation,
  reviewController.reportReview,
);

// ==================== ADMIN ROUTES ====================

// @route   GET /api/reviews/admin/all
// @desc    Get all reviews
// @access  Private/Admin
router.get("/admin/all", adminMiddleware, reviewController.getAllReviews);

// @route   DELETE /api/reviews/admin/:id
// @desc    Delete review (Admin)
// @access  Private/Admin
router.delete(
  "/admin/:id",
  adminMiddleware,
  adminDeleteValidation,
  reviewController.deleteReviewAdmin,
);

// @route   PUT /api/reviews/admin/:id/clear-reports
// @desc    Clear reported flags
// @access  Private/Admin
router.put(
  "/admin/:id/clear-reports",
  adminMiddleware,
  reviewController.clearReports,
);

module.exports = router;
