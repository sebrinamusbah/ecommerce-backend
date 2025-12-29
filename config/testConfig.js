require("dotenv").config();

module.exports = {
    port: process.env.TEST_PORT || 5001,
    db: {
        host: process.env.TEST_DB_HOST || "localhost",
        port: process.env.TEST_DB_PORT || 5432,
        name: process.env.TEST_DB_NAME || "bookstore_test",
        user: process.env.TEST_DB_USER || "postgres",
        password: process.env.TEST_DB_PASSWORD || "yourpassword",
    },
    jwtSecret: "test-jwt-secret",
    jwtExpire: "1h",
};