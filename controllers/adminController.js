const adminService = require("../services/adminService");

// ==================== BOOK MANAGEMENT ====================

/**
 * Add new book (Admin only)
 * @route POST /api/admin/books
 * @access Private/Admin
 */
exports.addBook = async (req, res) => {
  try {
    const book = await adminService.addBook(req.body);
    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update book (Admin only)
 * @route PUT /api/admin/books/:id
 * @access Private/Admin
 */
exports.updateBook = async (req, res) => {
  try {
    const updateData = req.body;

    // Handle file upload if present
    if (req.file) {
      updateData.coverImage = `/uploads/${req.file.filename}`;
    }

    const book = await adminService.updateBook(req.params.id, updateData);
    res.json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Delete book (Admin only)
 * @route DELETE /api/admin/books/:id
 * @access Private/Admin
 */
exports.deleteBook = async (req, res) => {
  try {
    const result = await adminService.deleteBook(req.params.id);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update book stock (Admin only)
 * @route PATCH /api/admin/books/:id/stock
 * @access Private/Admin
 */
exports.updateStock = async (req, res) => {
  try {
    const { quantity, action } = req.body;
    const result = await adminService.updateStock(
      req.params.id,
      quantity,
      action
    );
    res.json({
      success: true,
      message: `Stock updated to ${result.stock}`,
      data: result,
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({
      success: false,
      error: error.message,
    });
  }
};

// ==================== CATEGORY MANAGEMENT ====================

/**
 * Add new category (Admin only)
 * @route POST /api/admin/categories
 * @access Private/Admin
 */
exports.addCategory = async (req, res) => {
  try {
    const category = await adminService.addCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update category (Admin only)
 * @route PUT /api/admin/categories/:id
 * @access Private/Admin
 */
exports.updateCategory = async (req, res) => {
  try {
    const category = await adminService.updateCategory(req.params.id, req.body);
    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Delete category (Admin only)
 * @route DELETE /api/admin/categories/:id
 * @access Private/Admin
 */
exports.deleteCategory = async (req, res) => {
  try {
    const result = await adminService.deleteCategory(req.params.id);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({
      success: false,
      error: error.message,
    });
  }
};

// ==================== ORDER MANAGEMENT ====================

/**
 * Get all orders (Admin only)
 * @route GET /api/admin/orders
 * @access Private/Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await adminService.getAllOrders(page, limit);
    res.json({
      success: true,
      count: result.count,
      pagination: result.pagination,
      data: result.orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
};

/**
 * Update order status (Admin only)
 * @route PUT /api/admin/orders/:id/status
 * @access Private/Admin
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await adminService.updateOrderStatus(req.params.id, status);
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({
      success: false,
      error: error.message,
    });
  }
};

// ==================== USER MANAGEMENT ====================

/**
 * Get all users (Admin only)
 * @route GET /api/admin/users
 * @access Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await adminService.getAllUsers(page, limit);
    res.json({
      success: true,
      count: result.count,
      pagination: result.pagination,
      data: result.users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
};

/**
 * Update user (Admin only)
 * @route PUT /api/admin/users/:id
 * @access Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 400;
    res.status(status).json({
      success: false,
      error: error.message,
    });
  }
};

// ==================== DASHBOARD STATS ====================

/**
 * Get admin dashboard statistics
 * @route GET /api/admin/dashboard
 * @access Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard statistics",
    });
  }
};
