// scripts/seed-data-fixed.js
require("dotenv").config();
const db = require("../models");

async function seedData() {
    try {
        console.log("🌱 Seeding database with correct schema...");

        // First, make sure tables exist
        await db.sequelize.sync({ alter: true });
        console.log("✅ Database schema updated");

        // Clear existing data
        await db.User.destroy({ where: {}, truncate: true });
        await db.Category.destroy({ where: {}, truncate: true });
        await db.Book.destroy({ where: {}, truncate: true });
        console.log("✅ Cleared existing data");

        // Create categories
        console.log("Creating categories...");
        const categories = await db.Category.bulkCreate([{
                name: "Fiction",
                slug: "fiction",
                description: "Fiction books",
            },
            {
                name: "Non-Fiction",
                slug: "non-fiction",
                description: "Non-fiction books",
            },
            {
                name: "Science Fiction",
                slug: "sci-fi",
                description: "Sci-fi books",
            },
            {
                name: "Fantasy",
                slug: "fantasy",
                description: "Fantasy books",
            },
            {
                name: "Biography",
                slug: "biography",
                description: "Biographies",
            },
        ]);
        console.log(`✅ Created ${categories.length} categories`);

        // Create books
        console.log("Creating books...");
        const books = await db.Book.bulkCreate([{
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                description: "A classic novel of the Jazz Age",
                price: 12.99,
                stock: 50,
                categoryId: categories[0].id,
                isbn: "978-0743273565",
                coverImage: "great-gatsby.jpg",
                pages: 180,
                language: "English",
                rating: 4.2,
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                description: "A novel about racial injustice",
                price: 14.99,
                stock: 30,
                categoryId: categories[0].id,
                isbn: "978-0061120084",
                coverImage: "mockingbird.jpg",
                pages: 324,
                language: "English",
                rating: 4.3,
            },
            {
                title: "1984",
                author: "George Orwell",
                description: "Dystopian social science fiction",
                price: 10.99,
                stock: 40,
                categoryId: categories[2].id,
                isbn: "978-0451524935",
                coverImage: "1984.jpg",
                pages: 328,
                language: "English",
                rating: 4.5,
            },
            {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                description: "Fantasy novel and children's book",
                price: 16.99,
                stock: 25,
                categoryId: categories[3].id,
                isbn: "978-0547928227",
                coverImage: "hobbit.jpg",
                pages: 310,
                language: "English",
                rating: 4.8,
                isFeatured: true,
            },
            {
                title: "Steve Jobs",
                author: "Walter Isaacson",
                description: "Biography of Apple co-founder",
                price: 18.99,
                stock: 20,
                categoryId: categories[4].id,
                isbn: "978-1451648539",
                coverImage: "steve-jobs.jpg",
                pages: 656,
                language: "English",
                rating: 4.6,
            },
        ]);
        console.log(`✅ Created ${books.length} books`);

        // Create users
        console.log("Creating users...");
        const users = await db.User.bulkCreate([{
                name: "Admin User",
                email: "admin@example.com",
                password: "admin123", // Will be hashed by hook
                role: "admin",
                address: "123 Admin Street, Admin City",
                phone: "+1234567890",
            },
            {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                role: "user",
                address: "456 Main Street, Anytown",
                phone: "+1987654321",
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                password: "password123",
                role: "user",
                address: "789 Oak Avenue, Somewhere",
                phone: "+1122334455",
            },
        ]);
        console.log(`✅ Created ${users.length} users`);

        // Create sample orders
        console.log("Creating sample orders...");
        const orders = await db.Order.bulkCreate([{
                userId: users[1].id,
                totalAmount: 38.97,
                status: "delivered",
                shippingAddress: "456 Main Street, Anytown",
                paymentMethod: "credit_card",
                paymentStatus: "paid",
            },
            {
                userId: users[2].id,
                totalAmount: 27.98,
                status: "processing",
                shippingAddress: "789 Oak Avenue, Somewhere",
                paymentMethod: "paypal",
                paymentStatus: "paid",
            },
        ]);
        console.log(`✅ Created ${orders.length} orders`);

        // Create order items
        console.log("Creating order items...");
        await db.OrderItem.bulkCreate([{
                orderId: orders[0].id,
                bookId: books[0].id,
                quantity: 2,
                price: books[0].price,
            },
            {
                orderId: orders[0].id,
                bookId: books[2].id,
                quantity: 1,
                price: books[2].price,
            },
            {
                orderId: orders[1].id,
                bookId: books[1].id,
                quantity: 1,
                price: books[1].price,
            },
            {
                orderId: orders[1].id,
                bookId: books[3].id,
                quantity: 1,
                price: books[3].price,
            },
        ]);
        console.log("✅ Created order items");

        // Create cart items
        console.log("Creating cart items...");
        await db.CartItem.bulkCreate([{
                userId: users[1].id,
                bookId: books[4].id,
                quantity: 1,
            },
            {
                userId: users[2].id,
                bookId: books[0].id,
                quantity: 2,
            },
        ]);
        console.log("✅ Created cart items");

        console.log("\n🎉 Database seeded successfully!");
        console.log("📊 Summary:");
        console.log(`   📚 ${books.length} books`);
        console.log(`   📂 ${categories.length} categories`);
        console.log(`   👥 ${users.length} users`);
        console.log(`   📦 ${orders.length} orders`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error.message);
        console.error("Full error:", error);
        process.exit(1);
    }
}

seedData();