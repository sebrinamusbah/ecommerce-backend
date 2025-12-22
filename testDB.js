const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function checkTables() {
  const res = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';
  `);
  console.log(
    "Tables in database:",
    res.rows.map((r) => r.table_name)
  );
  await pool.end();
}

checkTables();
