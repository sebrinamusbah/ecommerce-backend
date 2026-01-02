// migrations/status.js
const { sequelize } = require("../config/db");

async function checkStatus() {
  try {
    await sequelize.authenticate();

    // Check project2 schema
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'project2'
      ORDER BY table_name;
    `);

    console.log(`✅ Database connected`);
    console.log(`📊 Tables in 'project2' schema: ${tables.length}`);
    tables.forEach((t) => console.log(`   • ${t.table_name}`));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

if (require.main === module) {
  checkStatus();
}

module.exports = { checkStatus };
