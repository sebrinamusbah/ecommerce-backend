const { Book, Category } = require("../models");
const { Op } = require("sequelize");

class BookService {
    async getAllBooks(filters = {}) {
        const {
            page = 1,
                limit = 10,
                search,
                category,
                minPrice,
                maxPrice,
                sortBy = "createdAt",
                order = "DESC",
        } = filters;

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

        return await Book.findAndCountAll({
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
    }

    async getBookById(id) {
        return await Book.findByPk(id, {
            include: [{
                model: Category,
                through: { attributes: [] },
            }, ],
        });
    }

    async createBook(bookData) {
        const book = await Book.create(bookData);

        if (bookData.categories) {
            await book.setCategories(bookData.categories);
        }

        return book;
    }

    async updateBook(id, bookData) {
        const book = await Book.findByPk(id);

        if (!book) {
            return null;
        }

        await book.update(bookData);

        if (bookData.categories) {
            await book.setCategories(bookData.categories);
        }

        return book;
    }

    async deleteBook(id) {
        const book = await Book.findByPk(id);

        if (!book) {
            return false;
        }

        await book.destroy();
        return true;
    }
}

module.exports = new BookService();