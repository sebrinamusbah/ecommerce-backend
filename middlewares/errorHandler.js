// middleware/errorHandler.js
const { ValidationError, DatabaseError } = require("sequelize");

exports.errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // Default error response
    let statusCode = 500;
    let message = "Internal server error";
    let errors = null;

    // Sequelize validation errors
    if (err instanceof ValidationError) {
        statusCode = 400;
        message = "Validation error";
        errors = err.errors.map((error) => ({
            field: error.path,
            message: error.message,
        }));
    }

    // Sequelize database errors
    else if (err instanceof DatabaseError) {
        statusCode = 400;
        message = "Database error";
    }

    // JWT errors
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }

    // Custom error with status code
    else if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Express validator errors
    else if (err.array && typeof err.array === "function") {
        statusCode = 400;
        message = "Validation error";
        errors = err.array().map((error) => ({
            field: error.path,
            message: error.msg,
        }));
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};