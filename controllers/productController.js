const db = require("../db");

// List all active products
const getProducts = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products WHERE is_active = 1");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get product by ID
const getProductById = async(req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM products WHERE id = ? AND is_active = 1", [req.params.id]
        );
        if (!rows.length)
            return res.status(404).json({ message: "Product not found" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin create product
const createProduct = async(req, res) => {
    const { name, description, price, stock, image_url } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)", [name, description, price, stock, image_url]
        );
        res
            .status(201)
            .json({
                id: result.insertId,
                name,
                description,
                price,
                stock,
                image_url,
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin update product
const updateProduct = async(req, res) => {
    const { name, description, price, stock, image_url } = req.body;
    try {
        await db.query(
            "UPDATE products SET name=?, description=?, price=?, stock=?, image_url=? WHERE id=?", [name, description, price, stock, image_url, req.params.id]
        );
        res.json({ message: "Product updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin soft-delete
const deleteProduct = async(req, res) => {
    try {
        await db.query("UPDATE products SET is_active = 0 WHERE id=?", [
            req.params.id,
        ]);
        res.json({ message: "Product deleted (soft)" });
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