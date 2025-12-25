const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");
const { User } = require("../models");

const protect = async(req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, jwtSecret);

            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ["password"] },
            });

            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Not authorized as admin" });
    }
};

module.exports = { protect, admin };