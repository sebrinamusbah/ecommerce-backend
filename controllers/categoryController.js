const { Category, Book } = require("../models");
const formatResponse = require("../utils/formatResponse");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async(req, res) => {
    try {
        const categories = await Category.findAll({
            include: [{
                model: Book,
                through: { attributes: [] },
                attributes: ["id", "title", "author", "price", "coverImage"],
            }, ],
        });

        res.json(
            formatResponse(true, categories, "Categories retrieved successfully")
        );
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async(req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [{
                model: Book,
                through: { attributes: [] },
                attributes: ["id", "title", "author", "price", "coverImage", "stock"],
            }, ],
        });

        if (!category) {
            return res
                .status(404)
                .json(formatResponse(false, null, "Category not found"));
        }

        res.json(formatResponse(true, category, "Category retrieved successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async(req, res) => {
    try {
        const { name, description } = req.body;

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const category = await Category.create({
            name,
            description,
            slug,
        });

        res
            .status(201)
            .json(formatResponse(true, category, "Category created successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async(req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res
                .status(404)
                .json(formatResponse(false, null, "Category not found"));
        }

        const { name, description } = req.body;

        // Update slug if name changed
        let updateData = { description };
        if (name && name !== category.name) {
            updateData.name = name;
            updateData.slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        await category.update(updateData);

        res.json(formatResponse(true, category, "Category updated successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async(req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res
                .status(404)
                .json(formatResponse(false, null, "Category not found"));
        }

        await category.destroy();

        res.json(formatResponse(true, null, "Category deleted successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(false, null, "Server error"));
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};