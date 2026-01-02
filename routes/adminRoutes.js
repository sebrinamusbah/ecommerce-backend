// routes/adminRoutes.js - SIMPLIFIED (no file upload)
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// Apply admin middleware to all routes
router.use(authMiddleware, adminMiddleware);
// ==================== BOOK MANAGEMENT ====================
// Simple POST - no file upload, just JSON
router.post("/books", adminController.addBook);
router.put("/books/:id", adminController.updateBook);
router.delete("/books/:id", adminController.deleteBook);
router.patch("/books/:id/stock", adminController.updateStock);

// ==================== CATEGORY MANAGEMENT ====================
router.post("/categories", adminController.addCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

// ==================== ORDER MANAGEMENT ====================
router.get("/orders", adminController.getAllOrders);
router.put("/orders/:id/status", adminController.updateOrderStatus);

// ==================== USER MANAGEMENT ====================
router.get("/users", adminController.getAllUsers);
router.put("/users/:id", adminController.updateUser);

// ==================== DASHBOARD ====================
router.get("/dashboard", adminController.getDashboardStats);

module.exports = router;
