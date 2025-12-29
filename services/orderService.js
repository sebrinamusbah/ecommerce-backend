const { Order, OrderItem, Book, User, CartItem } = require("../models");
const { Op } = require("sequelize");

class OrderService {
    // Create order from cart
    async createOrder(userId, orderData) {
        const { shippingAddress, paymentMethod, notes } = orderData;

        // Get cart items
        const cartItems = await CartItem.findAll({
            where: { userId },
            include: [Book],
        });

        if (cartItems.length === 0) {
            throw new Error("Cart is empty");
        }

        // Calculate total and validate stock
        let totalAmount = 0;
        const orderItemsData = [];

        for (const cartItem of cartItems) {
            if (cartItem.Book.stock < cartItem.quantity) {
                throw new Error(`Insufficient stock for: ${cartItem.Book.title}`);
            }

            const itemTotal = cartItem.Book.price * cartItem.quantity;
            totalAmount += itemTotal;

            orderItemsData.push({
                bookId: cartItem.bookId,
                quantity: cartItem.quantity,
                price: cartItem.Book.price,
                itemTotal: itemTotal,
            });
        }

        // Create order
        const order = await Order.create({
            userId,
            totalAmount,
            shippingAddress,
            paymentMethod,
            notes: notes || "",
            status: "pending",
            paymentStatus: "pending",
        });

        // Create order items and update stock
        for (const item of orderItemsData) {
            await OrderItem.create({
                orderId: order.id,
                bookId: item.bookId,
                quantity: item.quantity,
                price: item.price,
            });

            // Update book stock
            const book = await Book.findByPk(item.bookId);
            book.stock -= item.quantity;
            await book.save();
        }

        // Clear cart
        await CartItem.destroy({
            where: { userId },
        });

        return order;
    }

    // Get order by ID
    async getOrderById(orderId, userId = null) {
        const where = { id: orderId };
        if (userId) {
            where.userId = userId;
        }

        return await Order.findOne({
            where,
            include: [{
                    model: User,
                    attributes: ["id", "name", "email"],
                },
                {
                    model: OrderItem,
                    include: [Book],
                },
            ],
        });
    }

    // Get user's orders
    async getUserOrders(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await Order.findAndCountAll({
            where: { userId },
            include: [{
                model: OrderItem,
                include: [Book],
            }, ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [
                ["createdAt", "DESC"]
            ],
        });

        return {
            orders: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalOrders: count,
        };
    }

    // Get all orders (admin)
    async getAllOrders(filters = {}) {
        const {
            page = 1,
                limit = 20,
                status = null,
                startDate = null,
                endDate = null,
        } = filters;

        const where = {};

        if (status) where.status = status;

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = new Date(startDate);
            if (endDate) where.createdAt[Op.lte] = new Date(endDate);
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Order.findAndCountAll({
            where,
            include: [{
                    model: User,
                    attributes: ["id", "name", "email"],
                },
                {
                    model: OrderItem,
                    include: [Book],
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [
                ["createdAt", "DESC"]
            ],
        });

        return {
            orders: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalOrders: count,
        };
    }

    // Update order status
    async updateOrderStatus(orderId, status) {
        const order = await Order.findByPk(orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        order.status = status;
        await order.save();

        return order;
    }

    // Update payment status
    async updatePaymentStatus(orderId, paymentStatus) {
        const order = await Order.findByPk(orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        order.paymentStatus = paymentStatus;

        // If payment is successful, update order status to processing
        if (paymentStatus === "paid" && order.status === "pending") {
            order.status = "processing";
        }

        await order.save();

        return order;
    }

    // Get order statistics
    async getOrderStats(timePeriod = "month") {
        const now = new Date();
        let startDate;

        switch (timePeriod) {
            case "day":
                startDate = new Date(now.setDate(now.getDate() - 1));
                break;
            case "week":
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case "month":
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case "year":
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(now.setMonth(now.getMonth() - 1));
        }

        // Total orders
        const totalOrders = await Order.count({
            where: {
                createdAt: {
                    [Op.gte]: startDate },
            },
        });

        // Total revenue
        const revenueResult = await Order.findOne({
            attributes: [
                [
                    require("sequelize").fn(
                        "SUM",
                        require("sequelize").col("totalAmount")
                    ),
                    "totalRevenue",
                ],
            ],
            where: {
                paymentStatus: "paid",
                createdAt: {
                    [Op.gte]: startDate },
            },
        });

        const totalRevenue = revenueResult ? .dataValues ? .totalRevenue || 0;

        // Orders by status
        const ordersByStatus = await Order.findAll({
            attributes: [
                "status", [
                    require("sequelize").fn("COUNT", require("sequelize").col("id")),
                    "count",
                ],
            ],
            where: {
                createdAt: {
                    [Op.gte]: startDate },
            },
            group: ["status"],
        });

        return {
            totalOrders,
            totalRevenue: parseFloat(totalRevenue),
            ordersByStatus: ordersByStatus.map((item) => ({
                status: item.status,
                count: parseInt(item.dataValues.count),
            })),
        };
    }

    // Cancel order
    async cancelOrder(orderId, userId) {
        const order = await this.getOrderById(orderId, userId);

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status === "cancelled") {
            throw new Error("Order is already cancelled");
        }

        if (!["pending", "processing"].includes(order.status)) {
            throw new Error("Cannot cancel order in current status");
        }

        // Restore stock
        for (const item of order.OrderItems) {
            const book = await Book.findByPk(item.bookId);
            book.stock += item.quantity;
            await book.save();
        }

        order.status = "cancelled";
        await order.save();

        return order;
    }
}

module.exports = new OrderService();