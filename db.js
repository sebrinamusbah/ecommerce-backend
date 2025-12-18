const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

module.exports = pool;
pool.query("SELECT current_database()", (err, res) => {
    if (err) console.error(err);
    else console.log("Connected DB:", res.rows[0].current_database);
});