// config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    // 🔧 ADD THIS: Prepends search_path on connection
    prependSearchPath: true,
  },
  // Force schema usage
  schema: "project2",
  searchPath: "project2",
  define: {
    timestamps: true,
    // Ensure all models use project2 schema
    schema: "project2",
  },
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // 🔧 ADD THIS HOOK: Set search_path on each connection
  hooks: {
    afterConnect: async (connection) => {
      try {
        await connection.query(`SET search_path TO project2, public;`);
      } catch (error) {
        console.warn("Could not set search_path:", error.message);
      }
    },
  },
});

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to Render PostgreSQL");
    console.log("🔗 Using DATABASE_URL from environment");
    console.log("🏗️  Schema set to: project2");

    // Also set search_path after authentication
    return sequelize.query(`SET search_path TO project2, public;`);
  })
  .then(() => {
    console.log("🔧 Search path set to: project2, public");
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
  });

module.exports = { sequelize };
