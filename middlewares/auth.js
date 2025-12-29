// middleware/auth.js
const jwt = require("jsonwebtoken");
const db = require("../models");

exports.authenticate = async(req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided. Access denied.",
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your-fallback-secret-key-change-this"
        );

        // Check if user still exists in database
        const user = await db.User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User no longer exists",
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                error: "Account is deactivated",
            });
        }

        // Add user to request object
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        };

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
            });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                error: "Token expired. Please login again.",
            });
        }

        console.error("Authentication error:", error);
        res.status(500).json({
            success: false,
            error: "Authentication failed",
        });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            error: "Admin access required",
        });
    }
    next();
};

exports.isUser = (req, res, next) => {
    if (req.user.role !== "user" && req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            error: "User access required",
        });
    }
    next();
};