// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const validator = require("validator");

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided, authorization denied",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // 2. Basic token validation
    if (!token || token.length < 10) {
      return res.status(401).json({
        success: false,
        error: "Invalid token format",
      });
    }

    // 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
        clockTolerance: 30, // 30 seconds tolerance for clock skew
      });
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "Token expired. Please login again.",
        });
      }
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          error: "Invalid token. Please login again.",
        });
      }
      throw jwtError;
    }

    // 4. Validate decoded token structure
    if (!decoded.id || !decoded.email || !decoded.role) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload",
      });
    }

    // 5. Find user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    // 6. Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: "Account is deactivated. Please contact support.",
      });
    }

    // 7. Check if token was issued before password change (if you store passwordChangedAt)
    if (user.passwordChangedAt) {
      const tokenIssuedAt = decoded.iat || 0;
      const passwordChangedAt = Math.floor(
        user.passwordChangedAt.getTime() / 1000,
      );

      if (tokenIssuedAt < passwordChangedAt) {
        return res.status(401).json({
          success: false,
          error: "Password was changed. Please login again.",
        });
      }
    }

    // 8. Sanitize user data
    const sanitizedUser = {
      ...user.toJSON(),
      name: validator.escape(user.name),
      address: user.address ? validator.escape(user.address) : null,
      phone: user.phone ? validator.escape(user.phone) : null,
    };

    // 9. Attach to request
    req.user = sanitizedUser;
    req.token = token;

    // 10. Security logging
    console.log(
      `[AUTH] User ${user.email} accessed ${req.method} ${req.originalUrl}`,
    );

    next();
  } catch (error) {
    console.error("[ERROR] Auth middleware error:", error);

    // Don't expose internal errors
    res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied. Admin privileges required.",
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
