const { User, Book, Category } = require("../models");
const { sequelize } = require("../config/db");

const seedDatabase = async() => {
    try {
        console.log("🌱 Seeding database...");

        // Create categories
        const categories = await Category.bulkCreate([
            { name: "Fiction", slug: "fiction" },
            { name: "Non-Fiction", slug: "non-fiction" },
            { name: "Science Fiction", slug: "science-fiction" },
            { name: "Fantasy", slug: "fantasy" },
            { name: "Biography", slug: "biography" },
        ]);

        // Create admin user
        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@bookstore.com",
            password: "password123",
            role: "admin",
        });

        // Create regular user
        const regularUser = await User.create({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            role: "user",
        });

        // Create sample books
        const books = await Book.bulkCreate([{
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                isbn: "9780743273565",
                description: "A classic novel of the Jazz Age",
                price: 12.99,
                stock: 50,
                pages: 180,
                language: "English",
                isFeatured: true,
                rating: 4.5,
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                isbn: "9780061120084",
                description: "A novel about racial injustice",
                price: 14.99,
                stock: 30,
                pages: 281,
                language: "English",
                isFeatured: true,
                rating: 4.8,
            },
            {
                title: "1984",
                author: "George Orwell",
                isbn: "9780451524935",
                description: "Dystopian social science fiction",
                price: 10.99,
                stock: 40,
                pages: 328,
                language: "English",
                rating: 4.7,
            },
            {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                isbn: "9780141439518",
                description: "Romantic novel of manners",
                price: 9.99,
                stock: 35,
                pages: 432,
                language: "English",
                rating: 4.6,
            },
        ]);

        // Associate books with categories
        await books[0].setCategories([categories[0].id]);
        await books[1].setCategories([categories[0].id]);
        await books[2].setCategories([categories[2].id]);
        await books[3].setCategories([categories[0].id]);

        console.log("✅ Database seeded successfully!");
        console.log(`📚 Created ${books.length} books`);
        console.log(`📂 Created ${categories.length} categories`);
        console.log(`👥 Created 2 users (admin & regular)`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;