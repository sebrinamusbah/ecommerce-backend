// Move repeated helper functions from controllers here
exports.formatCurrency = (amount) => `ETB ${amount.toFixed(2)}`;
exports.generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '-');
exports.paginate = (page = 1, limit = 10) => ({
    offset: (page - 1) * limit,
    limit: parseInt(limit)
});
exports.calculateDiscount = (price, discountPercent) => {
    return price - (price * discountPercent / 100);
};
exports.validatePhone = (phone) => /^(09|07)\d{8}$/.test(phone);
