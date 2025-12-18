const db = require("./db");

async function testDB() {
    try {
        const res = await db.query("SELECT 1 + 1 AS result");
        console.log("DB connected, test query result:", res.rows[0].result);
    } catch (err) {
        console.error("DB connection failed:", err);
    } finally {
        db.end(); // Close connection
    }
}

testDB();