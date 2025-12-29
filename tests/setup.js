const { sequelize } = require("../config/db");

// Clear database before tests
beforeAll(async() => {
    // Sync test database (force: true drops all tables)
    await sequelize.sync({ force: true });
    console.log("Test database synced");
});

// Close database connection after tests
afterAll(async() => {
    await sequelize.close();
    console.log("Database connection closed");
});