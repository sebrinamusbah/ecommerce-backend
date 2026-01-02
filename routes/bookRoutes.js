// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// Public routes
router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);
router.get("/featured", bookController.getFeaturedBooks);
router.get("/filter", bookController.filterBooks);
router.get("/category/:categoryId", bookController.getBooksByCategory);
router.get("/:id", bookController.getBookById);

module.exports = router;
