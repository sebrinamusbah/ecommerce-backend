const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { corsOptions } = require("./config/serverConfig");
const errorHandler = require("./middlewares/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const categoryRoutes = require("./routes/categoryRoutes"); // Add this
const cartRoutes = require("./routes/cartRoutes"); // Add this
const orderRoutes = require("./routes/orderRoutes"); // Add this
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Add this
const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "Bookstore API",
    });
});

// Welcome route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Bookstore API",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            books: "/api/books",
            categories: "/api/categories",
            cart: "/api/cart",
            orders: "/api/orders",
            users: "/api/users",
            admin: "/api/admin",
        },
    });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Error handler
app.use(errorHandler);

module.exports = app;