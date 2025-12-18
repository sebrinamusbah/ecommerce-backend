const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", verifyToken, authorizeRole("admin"), createProduct);
router.put("/:id", verifyToken, authorizeRole("admin"), updateProduct);
router.delete("/:id", verifyToken, authorizeRole("admin"), deleteProduct);

module.exports = router;