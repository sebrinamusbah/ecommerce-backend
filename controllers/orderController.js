const db = require("../db");

// Create order from cart
const createOrder = async(req, res) => {
    try {
        const [cartItems] = await db.query(
            "SELECT c.product_id, c.quantity, p.price FROM cart_items c JOIN products p ON c.product_id=p.id WHERE c.user_id=?", [req.user.id]
        );
        if (!cartItems.length)
            return res.status(400).json({ message: "Cart is empty" });

        // Calculate total
        const total = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // Insert order
        const [orderResult] = await db.query(
            "INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')", [req.user.id, total]
        );
        const orderId = orderResult.insertId;

        // Insert order items
        for (let item of cartItems) {
            await db.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)", [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // Clear cart
        await db.query("DELETE FROM cart_items WHERE user_id=?", [req.user.id]);

        res.status(201).json({ message: "Order created", orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user orders
const getUserOrders = async(req, res) => {
    try {
        const [orders] = await db.query("SELECT * FROM orders WHERE user_id=?", [
            req.user.id,
        ]);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get order by ID
const getOrderById = async(req, res) => {
    try {
        const [orders] = await db.query(
            "SELECT * FROM orders WHERE id=? AND user_id=?", [req.params.id, req.user.id]
        );
        if (!orders.length)
            return res.status(404).json({ message: "Order not found" });
        const [items] = await db.query(
            "SELECT * FROM order_items WHERE order_id=?", [req.params.id]
        );
        res.json({ order: orders[0], items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin update order status
const updateOrderStatus = async(req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE orders SET status=? WHERE id=?", [
            status,
            req.params.id,
        ]);
        res.json({ message: "Order status updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
};