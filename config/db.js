// config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DATABASE_URL) {
    // For Render PostgreSQL (requires SSL)
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Required for Render PostgreSQL
            },
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
} else {
    // Development fallback to SQLite
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "./database.sqlite",
        logging: false,
    });
}

// Test connection
sequelize
    .authenticate()
    .then(() => {
        console.log("✅ Database connection established successfully.");
    })
    .catch((err) => {
        console.error("❌ Unable to connect to the database:", err.message);
    });

module.exports = { sequelize };