const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { authenticate, isAdmin } = require("../middlewares/auth");
const { validateBook } = require("../middlewares/validation");

// ========================
// PUBLIC ROUTES
// ========================

// Get ALL books without pagination limit (for homepage)
router.get("/all", bookController.getAllBooksWithoutLimit);

// Get books count (for debugging)
router.get("/count", bookController.getBooksCount);

// Get books with pagination (default: page 1, limit 10)
router.get("/", bookController.getAllBooks);

// Get single book by ID
router.get("/:id", bookController.getBookById);

// ========================
// PROTECTED ROUTES (Admin only)
// ========================

// Create new book
router.post(
  "/",
  authenticate,
  isAdmin,
  validateBook,
  bookController.createBook
);

// Update book
router.put(
  "/:id",
  authenticate,
  isAdmin,
  validateBook,
  bookController.updateBook
);

// Delete book
router.delete("/:id", authenticate, isAdmin, bookController.deleteBook);

module.exports = router;
