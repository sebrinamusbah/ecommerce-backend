const express = require("express");
const router = express.Router();
const {
    createOrder,
    getUserOrders,
} = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/", createOrder);
router.get("/", getUserOrders);

module.exports = router;