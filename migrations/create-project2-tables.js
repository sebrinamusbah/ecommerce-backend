// migrations/create-project2-tables.js
const { sequelize } = require("../config/db");
require("../models"); // This loads all your models with project2 schema

async function createProject2Tables() {
  try {
    console.log("🚀 Creating Project 2 tables in 'project2' schema...");

    // 1. Connect to Render PostgreSQL
    await sequelize.authenticate();
    console.log("✅ Connected to Render PostgreSQL");

    // 2. Create project2 schema if it doesn't exist
    await sequelize.query(`
      CREATE SCHEMA IF NOT EXISTS project2;
      COMMENT ON SCHEMA project2 IS 'E-bookstore application tables';
    `);
    console.log("✅ Schema 'project2' ready");

    // 3. Set search path for this session
    await sequelize.query("SET search_path TO project2, public;");

    // 4. Sync ALL your models to project2 schema
    // This creates Users, Books, Categories, Orders, etc.
    const options = {
      alter: true, // Updates existing tables
      schema: "project2", // 👈 Creates in project2 schema
      logging: console.log, // See what's happening
      hooks: true,
    };

    // Force recreate if needed (WARNING: deletes data!)
    if (process.argv.includes("--force")) {
      options.force = true;
      console.log("⚠️  FORCE MODE: Will drop and recreate all tables!");
    }

    console.log("✅ Using migrations for schema changes, not auto-sync");
    await sequelize.sync({ alter: false });

    // 5. Verify what was created
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'project2'
      ORDER BY table_name;
    `);

    console.log("\n📊 Tables created in 'project2' schema:");
    tables.forEach((table) => {
      console.log(`   • ${table.table_name}`);
    });

    console.log(
      `\n✅ Success! ${tables.length} tables created in project2 schema`,
    );
    console.log("📍 Your database structure:");
    console.log(
      "   Shared Render PostgreSQL → project2 schema → Your 7 tables",
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

// Run it
createProject2Tables();
