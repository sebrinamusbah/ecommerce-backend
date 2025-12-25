const { User } = require("../models");
const generateToken = require("../utils/generateToken");
const formatResponse = require("../utils/formatResponse");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res
                .status(400)
                .json(formatResponse(false, null, "User already exists"));
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json(
            formatResponse(
                true, {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token,
                },
                "Registration successful"
            )
        );
    } catch (error) {
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res
                .status(401)
                .json(formatResponse(false, null, "Invalid credentials"));
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
                .status(401)
                .json(formatResponse(false, null, "Invalid credentials"));
        }

        // Generate token
        const token = generateToken(user.id);

        res.json(
            formatResponse(
                true, {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token,
                },
                "Login successful"
            )
        );
    } catch (error) {
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async(req, res) => {
    try {
        res.json(formatResponse(true, req.user, "User data retrieved"));
    } catch (error) {
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

module.exports = {
    register,
    login,
    getMe,
};