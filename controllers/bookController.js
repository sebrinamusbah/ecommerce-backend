const db = require("../models");
const Book = db.Book;
const Category = db.Category;

// Get ALL books without pagination limit (for homepage)
exports.getAllBooksWithoutLimit = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    // Build where clause
    const where = {};

    if (search) {
      where[db.Sequelize.Op.or] = [
        {
          title: {
            [db.Sequelize.Op.iLike]: `%${search}%`,
          },
        },
        {
          author: {
            [db.Sequelize.Op.iLike]: `%${search}%`,
          },
        },
        {
          description: {
            [db.Sequelize.Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[db.Sequelize.Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[db.Sequelize.Op.lte] = parseFloat(maxPrice);
    }

    // Get ALL books WITHOUT pagination limit
    const books = await Book.findAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
      include: [
        {
          model: Category,
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    res.json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get all books error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get books with pagination (for category pages, search)
exports.getAllBooks = async (req, res) => {
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

    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where[db.Sequelize.Op.or] = [
        {
          title: {
            [db.Sequelize.Op.iLike]: `%${search}%`,
          },
        },
        {
          author: {
            [db.Sequelize.Op.iLike]: `%${search}%`,
          },
        },
        {
          description: {
            [db.Sequelize.Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[db.Sequelize.Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[db.Sequelize.Op.lte] = parseFloat(maxPrice);
    }

    // Get books with total count
    const { count, rows: books } = await Book.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order.toUpperCase()]],
      include: [
        {
          model: Category,
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    res.json({
      success: true,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      books,
    });
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    res.json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get books count (for debugging)
exports.getBooksCount = async (req, res) => {
  try {
    const totalCount = await Book.count();
    const featuredCount = await Book.count({ where: { isFeatured: true } });

    res.json({
      success: true,
      totalBooks: totalCount,
      featuredBooks: featuredCount,
      message: `Database has ${totalCount} total books, ${featuredCount} featured`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create new book (admin only)
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update book (admin only)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    await book.update(req.body);

    res.json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete book (admin only)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    await book.destroy();

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
