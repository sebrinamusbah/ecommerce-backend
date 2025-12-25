const { CartItem, Book } = require("../models");
const formatResponse = require("../utils/formatResponse");

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async(req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Book,
                attributes: ["id", "title", "author", "price", "coverImage", "stock"],
            }, ],
        });

        const cart = cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            book: item.Book,
        }));

        res.json(formatResponse(true, cart, "Cart retrieved successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async(req, res) => {
    try {
        const { bookId, quantity = 1 } = req.body;

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res
                .status(404)
                .json(formatResponse(false, null, "Book not found"));
        }

        if (book.stock < quantity) {
            return res
                .status(400)
                .json(formatResponse(false, null, "Insufficient stock"));
        }

        const [cartItem, created] = await CartItem.findOrCreate({
            where: { userId: req.user.id, bookId },
            defaults: { quantity },
        });

        if (!created) {
            cartItem.quantity += quantity;
            await cartItem.save();
        }

        res.status(201).json(formatResponse(true, cartItem, "Item added to cart"));
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async(req, res) => {
    try {
        const { quantity } = req.body;

        const cartItem = await CartItem.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
            include: [Book],
        });

        if (!cartItem) {
            return res
                .status(404)
                .json(formatResponse(false, null, "Cart item not found"));
        }

        if (cartItem.Book.stock < quantity) {
            return res
                .status(400)
                .json(formatResponse(false, null, "Insufficient stock"));
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.json(formatResponse(true, cartItem, "Cart item updated"));
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async(req, res) => {
    try {
        const cartItem = await CartItem.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (!cartItem) {
            return res
                .status(404)
                .json(formatResponse(false, null, "Cart item not found"));
        }

        await cartItem.destroy();
        res.json(formatResponse(true, null, "Item removed from cart"));
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async(req, res) => {
    try {
        await CartItem.destroy({
            where: { userId: req.user.id },
        });

        res.json(formatResponse(true, null, "Cart cleared"));
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};