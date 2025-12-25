module.exports = {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || "development",
    corsOptions: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    },
};