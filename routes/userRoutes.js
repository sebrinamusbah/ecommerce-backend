const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
    getUserProfile,
    updateUserProfile,
} = require("../controllers/userController");

router.use(protect);

router.route("/profile").get(getUserProfile).put(updateUserProfile);

module.exports = router;