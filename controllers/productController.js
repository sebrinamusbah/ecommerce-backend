const db = require("../db");

// List all active products
const getProducts = async(req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const result = await db.query(
            "SELECT * FROM products WHERE is_active=true ORDER BY id DESC LIMIT $1 OFFSET $2", [limit, offset]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get product by ID
const getProductById = async(req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT * FROM products WHERE id=$1", [id]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Product not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Create product (Admin)
const createProduct = async(req, res) => {
    try {
        const { name, description, price, stock, image_url } = req.body;
        const result = await db.query(
            "INSERT INTO products (name, description, price, stock, image_url) VALUES ($1,$2,$3,$4,$5) RETURNING *", [name, description, price, stock, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update product (Admin)
const updateProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, image_url } = req.body;
        const result = await db.query(
            "UPDATE products SET name=$1, description=$2, price=$3, stock=$4, image_url=$5, updated_at=NOW() WHERE id=$6 RETURNING *", [name, description, price, stock, image_url, id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Product not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Soft delete product (Admin)
const deleteProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            "UPDATE products SET is_active=false, updated_at=NOW() WHERE id=$1 RETURNING *", [id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product soft-deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};