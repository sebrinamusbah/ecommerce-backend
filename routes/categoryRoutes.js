// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const categoryController = require("../controllers/categoryController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

// Validation middleware
const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be 2-100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  validateRequest,
];

const updateCategoryValidation = [
  param("id").isUUID().withMessage("Invalid category ID format"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be 2-100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  validateRequest,
];

const bulkCreateValidation = [
  body("categories")
    .isArray({ min: 1 })
    .withMessage("Categories array is required"),

  body("categories.*.name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be 2-100 characters"),

  body("categories.*.description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  validateRequest,
];

const searchValidation = [
  query("q")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2 })
    .withMessage("Search query must be at least 2 characters"),

  validateRequest,
];

// ==================== PUBLIC ROUTES ====================

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get("/", categoryController.getAllCategories);

// @route   GET /api/categories/summary
// @desc    Get categories with book counts
// @access  Public
router.get("/summary", categoryController.getCategoriesSummary);

// @route   GET /api/categories/search
// @desc    Search categories
// @access  Public
router.get("/search", searchValidation, categoryController.searchCategories);

// @route   GET /api/categories/slug/:slug
// @desc    Get category by slug
// @access  Public
router.get("/slug/:slug", categoryController.getCategoryBySlug);

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get("/:id", categoryController.getCategoryById);

// ==================== ADMIN ROUTES ====================

// @route   POST /api/categories
// @desc    Create new category
// @access  Private/Admin
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCategoryValidation,
  categoryController.createCategory,
);

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private/Admin
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCategoryValidation,
  categoryController.updateCategory,
);

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private/Admin
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory,
);

// @route   POST /api/categories/bulk
// @desc    Bulk create categories
// @access  Private/Admin
router.post(
  "/bulk",
  authMiddleware,
  adminMiddleware,
  bulkCreateValidation,
  categoryController.bulkCreateCategories,
);

module.exports = router;
