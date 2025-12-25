// Simple migration script
const { sequelize } = require("../config/db");

const createTables = async() => {
    try {
        console.log("🔄 Creating database tables...");

        // Import models to register them
        require("../models/User");
        require("../models/Book");
        require("../models/Category");
        require("../models/Order");
        require("../models/OrderItem");
        require("../models/CartItem");

        // Sync all models
        await sequelize.sync({ force: true });

        console.log("✅ Database tables created successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating tables:", error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    createTables();
}

module.exports = createTables;