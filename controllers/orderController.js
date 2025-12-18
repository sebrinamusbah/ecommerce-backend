const db = require("../db");

// Create order from cart
const createOrder = async(req, res) => {
    try {
        const userId = req.user.id;

        const cart = await db.query(
            `SELECT ci.product_id, p.price, ci.quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id=$1`, [userId]
        );

        if (cart.rows.length === 0)
            return res.status(400).json({ message: "Cart is empty" });

        const total = cart.rows.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        // Insert order
        const order = await db.query(
            "INSERT INTO orders (user_id, total) VALUES ($1,$2) RETURNING *", [userId, total]
        );

        const orderId = order.rows[0].id;

        // Insert order items
        const promises = cart.rows.map((item) =>
            db.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)", [orderId, item.product_id, item.quantity, item.price]
            )
        );
        await Promise.all(promises);

        // Clear cart
        await db.query("DELETE FROM cart_items WHERE user_id=$1", [userId]);

        res.status(201).json({ message: "Order created", order_id: orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user orders
const getUserOrders = async(req, res) => {
    try {
        const userId = req.user.id;
        const orders = await db.query(
            "SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC", [userId]
        );
        res.json(orders.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createOrder, getUserOrders };