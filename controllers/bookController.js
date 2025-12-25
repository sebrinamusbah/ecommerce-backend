const { Book, Category } = require("../models");
const formatResponse = require("../utils/formatResponse");
const { Op } = require("sequelize");

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async(req, res) => {
    try {
        const {
            page = 1,
                limit = 10,
                search,
                category,
                minPrice,
                maxPrice,
                sortBy = "createdAt",
                order = "DESC",
        } = req.query;

        const where = {};

        if (search) {
            where[Op.or] = [
                { title: {
                        [Op.iLike]: `%${search}%` } },
                { author: {
                        [Op.iLike]: `%${search}%` } },
                { description: {
                        [Op.iLike]: `%${search}%` } },
            ];
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = minPrice;
            if (maxPrice) where.price[Op.lte] = maxPrice;
        }

        const offset = (page - 1) * limit;

        const { count, rows: books } = await Book.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [
                [sortBy, order]
            ],
            include: [{
                model: Category,
                through: { attributes: [] },
                where: category ? { id: category } : undefined,
                required: !!category,
            }, ],
        });

        res.json(
            formatResponse(
                true, {
                    books,
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page),
                    totalBooks: count,
                },
                "Books retrieved successfully"
            )
        );
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async(req, res) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [{
                model: Category,
                through: { attributes: [] },
            }, ],
        });

        if (!book) {
            return res
                .status(404)
                .json(formatResponse(false, null, "Book not found"));
        }

        res.json(formatResponse(true, book, "Book retrieved successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Create book
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
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Update book
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
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Delete book
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
        console.error(error);
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