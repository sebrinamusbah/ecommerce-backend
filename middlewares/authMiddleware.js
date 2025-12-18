const jwt = require("jsonwebtoken");

// JWT verification
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer token

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded; // { id, role }
        next();
    });
};

// Role-based access
const authorizeRole = (roles = []) => {
    if (typeof roles === "string") roles = [roles];
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return res.status(403).json({ message: "Forbidden: Access denied" });
        next();
    };
};

module.exports = { verifyToken, authorizeRole };