const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDashboardStats,
} = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/authMiddleware");

// All admin routes require admin privileges
router.use(protect);
router.use(admin);

// User management
router.route("/users").get(getAllUsers);

router.route("/users/:id").get(getUserById).put(updateUser).delete(deleteUser);

// Dashboard
router.get("/dashboard", getDashboardStats);

module.exports = router;