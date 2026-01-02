// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import security middleware
const {
    securityHeaders,
    customSecurity,
    generalLimiter
} = require('./middleware/securityMiddleware');

// Import database connection
const { sequelize } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Initialize Express app
const app = express();

// ========================
// SECURITY MIDDLEWARE
// ========================

// 1. Security headers (Helmet)
app.use(securityHeaders);

// 2. Custom security headers
app.use(customSecurity);

// 3. Rate limiting for all routes
app.use(generalLimiter);

// ========================
// BASIC MIDDLEWARE
// ========================

// 4. CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ?
        process.env.CORS_ORIGIN ?.split(',') || ['https://yourdomain.com'] : ['http://localhost:3000', 'http://localhost:5173'], // React/Vite dev servers
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 5. Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// 6. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 7. Static files (if you have public folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
// DATABASE CONNECTION
// ========================

// Test database connection
const testDatabaseConnection = async() => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Sync models (use with caution in production)
        if (process.env.NODE_ENV === 'development') {
            // await sequelize.sync({ alter: true });
            console.log('📊 Database models are ready.');
        }
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        console.error('🔧 Check your DATABASE_URL in .env file');
        process.exit(1);
    }
};

// ========================
// ROUTES
// ========================

// 8. Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Bookstore API is running 🚀',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

// 9. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

// 10. Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Readify Bookstore API 📚',
        documentation: 'Visit /api/health for API status',
        endpoints: {
            auth: '/api/auth',
            books: '/api/books',
            admin: '/api/admin',
            cart: '/api/cart',
            orders: '/api/orders',
            payments: '/api/payments'
        }
    });
});

// ========================
// ERROR HANDLING
// ========================

// 11. 404 Not Found handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// 12. Global error handler
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack);

    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' ?
        'Something went wrong. Please try again later.' :
        err.message;

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ========================
// SERVER STARTUP
// ========================

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Start server after database connection
const startServer = async() => {
    try {
        // Test database connection
        await testDatabaseConnection();

        // Start server
        app.listen(PORT, HOST, () => {
            console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                 READIFY BOOKSTORE API                                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 🔗 Server:  http://${HOST}:${PORT}                                           ║
║ 🌱 Environment: ${process.env.NODE_ENV || 'development'}                     ║
║ 🗄️  Database: ${sequelize.config.database}                                  ║
║ 📁 Schema: project2                                                          ║
║ ✅ Status: Ready                                                             ║
╚══════════════════════════════════════════════════════════════════════════════╝
            `);

            console.log('\n📦 Available Endpoints:');
            console.log('   🔐 Auth:    POST /api/auth/register');
            console.log('   🔐 Auth:    POST /api/auth/login');
            console.log('   🏥 Health:  GET  /api/health');
            console.log('   📚 Books:   GET  /api/books');
            console.log('   🛒 Cart:    GET  /api/cart');
            console.log('   📦 Orders:  GET  /api/orders');
            console.log('   💳 Payments:GET  /api/payments');
            console.log('\n🛡️  Security Features:');
            console.log('   ✅ Rate Limiting');
            console.log('   ✅ CORS Protection');
            console.log('   ✅ Security Headers');
            console.log('   ✅ Input Validation');
            console.log('\n💡 Tip: Use /api/health to check API status');
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', async() => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    await sequelize.close();
    console.log('✅ Database connection closed.');
    process.exit(0);
});

process.on('SIGINT', async() => {
    console.log('🛑 SIGINT received. Shutting down gracefully...');
    await sequelize.close();
    console.log('✅ Database connection closed.');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the server
startServer();

module.exports = app; // For testing