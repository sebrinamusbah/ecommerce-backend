const db = require("../db");

// Get user cart items
const getCartItems = async(req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            `SELECT ci.id, p.id AS product_id, p.name, p.price, p.image_url, ci.quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id=$1`, [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Add / update cart item
const addToCart = async(req, res) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity } = req.body;

        const exists = await db.query(
            "SELECT * FROM cart_items WHERE user_id=$1 AND product_id=$2", [userId, product_id]
        );

        if (exists.rows.length > 0) {
            // Update quantity
            await db.query("UPDATE cart_items SET quantity=$1 WHERE id=$2", [
                quantity,
                exists.rows[0].id,
            ]);
        } else {
            // Insert new item
            await db.query(
                "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1,$2,$3)", [userId, product_id, quantity]
            );
        }

        res.json({ message: "Cart updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Remove item
const removeFromCart = async(req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId } = req.params;

        await db.query("DELETE FROM cart_items WHERE id=$1 AND user_id=$2", [
            cartItemId,
            userId,
        ]);
        res.json({ message: "Item removed from cart" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getCartItems, addToCart, removeFromCart };