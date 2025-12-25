require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");
const { port } = require("./config/serverConfig");

// Database connection
connectDB().then(() => {
    // Start server
    app.listen(port, () => {
        console.log(`
🚀 Server is running!
📁 Environment: ${process.env.NODE_ENV}
🌐 Port: ${port}
🔗 URL: http://localhost:${port}
📊 Database: ${process.env.DB_NAME}
    
📚 Bookstore API Endpoints:
   GET  /              - API Documentation
   GET  /api/health    - Health Check
   POST /api/auth/register - Register User
   POST /api/auth/login    - Login User
   GET  /api/books     - Get All Books
    `);
    });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});