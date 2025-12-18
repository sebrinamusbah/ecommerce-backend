const db = require("../db");

// Get user cart
const getCartItems = async(req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT c.id as cart_id, p.* , c.quantity 
             FROM cart_items c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`, [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Add / update item in cart
const addToCart = async(req, res) => {
    const { product_id, quantity } = req.body;
    try {
        // Check if exists
        const [existing] = await db.query(
            "SELECT * FROM cart_items WHERE user_id=? AND product_id=?", [req.user.id, product_id]
        );
        if (existing.length) {
            await db.query("UPDATE cart_items SET quantity=? WHERE id=?", [
                quantity,
                existing[0].id,
            ]);
        } else {
            await db.query(
                "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)", [req.user.id, product_id, quantity]
            );
        }
        res.json({ message: "Cart updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Remove from cart
const removeFromCart = async(req, res) => {
    try {
        await db.query("DELETE FROM cart_items WHERE id=? AND user_id=?", [
            req.params.cartItemId,
            req.user.id,
        ]);
        res.json({ message: "Item removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getCartItems, addToCart, removeFromCart };