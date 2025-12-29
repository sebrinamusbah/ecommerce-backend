const { Book, Category } = require("../models");
const formatResponse = require("../utils/formatResponse");
const { Op } = require("sequelize");
const bookService = require("../services/bookService");

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async(req, res) => {
    try {
        const result = await bookService.getAllBooks(req.query);
        res.json(formatResponse(true, result, "Books retrieved successfully"));
    } catch (error) {
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async(req, res) => {
    try {
        const book = await bookService.getBookById(req.params.id);

        if (!book) {
            return res
                .status(404)
                .json(formatResponse(false, null, "Book not found"));
        }

        res.json(formatResponse(true, book, "Book retrieved successfully"));
    } catch (error) {
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// ... rest of the controller
// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async(req, res) => {
    try {
        const book = await Book.create(req.body);

        if (req.body.categories) {
            await book.setCategories(req.body.categories);
        }

        res
            .status(201)
            .json(formatResponse(true, book, "Book created successfully"));
    } catch (error) {
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async(req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);

        if (!book) {
            return res
                .status(404)
                .json(formatResponse(false, null, "Book not found"));
        }

        await book.update(req.body);

        if (req.body.categories) {
            await book.setCategories(req.body.categories);
        }

        res.json(formatResponse(true, book, "Book updated successfully"));
    } catch (error) {
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async(req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);

        if (!book) {
            return res
                .status(404)
                .json(formatResponse(false, null, "Book not found"));
        }

        await book.destroy();

        res.json(formatResponse(true, null, "Book deleted successfully"));
    } catch (error) {
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};