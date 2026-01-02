// seeders/seedDatabase.js - UPDATED WITH BOOKS
const { sequelize } = require("../config/db");
const { User, Category, Book } = require("../models"); // ADD Book
const bcrypt = require("bcryptjs");

async function seedDatabase() {
  try {
    console.log("🌱 Initial database seeding...");
    console.log("📌 Seeding into 'project2' schema\n");

    // Set search path to project2 schema
    await sequelize.query("SET search_path TO project2, public;");

    // Check if already seeded - query WITH schema
    const [existingCategories] = await sequelize.query(
      'SELECT COUNT(*) as count FROM "Categories"',
    );

    let categories = [];
    if (parseInt(existingCategories[0].count) > 0) {
      console.log("⚠️  Categories already exist. Skipping category seeding.");
      console.log("   (Admin can add more via admin panel)");
      // Get existing categories for book seeding
      categories = await Category.findAll();
    } else {
      // 1. CREATE CATEGORIES
      console.log("1. Creating categories...");
      categories = await Category.bulkCreate([
        {
          name: "Fiction",
          slug: "fiction",
          description: "Novels, short stories, and literary works",
        },
        {
          name: "Technology",
          slug: "technology",
          description: "Programming, software development, and tech",
        },
        {
          name: "Science",
          slug: "science",
          description: "Scientific books and research",
        },
        {
          name: "Business & Finance",
          slug: "business-finance",
          description: "Entrepreneurship, management, finance, marketing",
        },
        {
          name: "Biography & Memoir",
          slug: "biography-memoir",
          description: "Autobiographies, memoirs, and life stories",
        },
        {
          name: "Self-Help & Personal Development",
          slug: "self-help",
          description: "Personal development, psychology, and productivity",
        },
      ]);
      console.log("✅ 6 categories created");
    }

    // NEW: SEED BOOKS WITH UPDATED DEFAULT COVER
    console.log("\n2. Seeding books (testing new default cover)...");
    const [existingBooks] = await sequelize.query(
      'SELECT COUNT(*) as count FROM "Books"',
    );

    if (parseInt(existingBooks[0].count) === 0) {
      await Book.bulkCreate([
        {
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          price: 14.99,
          stock: 25,
          description: "A classic novel of the Jazz Age",
          categoryId: categories.find((c) => c.name === "Fiction").id,
          // No coverImage → will use NEW default: https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=Book+Cover
        },
        {
          title: "Clean Code: A Handbook of Agile Software Craftsmanship",
          author: "Robert C. Martin",
          price: 39.99,
          stock: 15,
          isbn: "9780132350884",
          description:
            "Essential patterns for writing clean, maintainable code",
          pages: 464,
          language: "English",
          coverImage: "https://images.example.com/clean-code-cover.jpg", // Custom cover
          categoryId: categories.find((c) => c.name === "Technology").id,
        },
        {
          title:
            "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
          author: "James Clear",
          price: 18.99,
          stock: 35,
          isbn: "9780735211292",
          description: "Tiny changes, remarkable results",
          pages: 320,
          language: "English",
          // No coverImage → uses NEW default
          categoryId: categories.find(
            (c) => c.name === "Self-Help & Personal Development",
          ).id,
        },
        {
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          price: 22.99,
          stock: 20,
          isbn: "9780062316097",
          description: "From stone tools to silicon chips",
          pages: 464,
          language: "English",
          coverImage: "https://covers.openlibrary.org/b/id/12576715-L.jpg", // Real cover
          categoryId: categories.find((c) => c.name === "Science").id,
        },
        {
          title:
            "The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses",
          author: "Eric Ries",
          price: 19.99,
          stock: 18,
          isbn: "9780307887894",
          description: "Innovation and entrepreneurship methodology",
          pages: 336,
          language: "English",
          // No coverImage → uses NEW default
          categoryId: categories.find((c) => c.name === "Business & Finance")
            .id,
        },
      ]);
      console.log("✅ 5 books created (testing default vs custom covers)");
    } else {
      console.log("⚠️  Books already exist. Skipping book seeding.");
    }

    // 3. CREATE ADMIN USER (Sebrina) - Renumbered from original
    console.log("\n3. Creating admin user (Sebrina)...");
    let adminUser = await User.findOne({
      where: { email: "sebrinm9@gmail.com" },
    });

    if (!adminUser) {
      const adminPassword = await bcrypt.hash("Sebrina@123", 10);
      adminUser = await User.create({
        name: "Sebrina Musbah",
        email: "sebrinm9@gmail.com",
        password: adminPassword,
        role: "admin",
        address: "Addis Ababa, Ethiopia",
        phone: "0985673299",
        isActive: true,
      });
      console.log("✅ Admin user created");
      console.log("   Email: sebrinm9@gmail.com");
      console.log("   Password: Sebrina@123");
    } else {
      console.log("✅ Admin user already exists");
    }

    // 4. CREATE SAMPLE CUSTOMER - Renumbered
    console.log("\n4. Creating sample customer...");
    let sampleCustomer = await User.findOne({
      where: { email: "customer@example.com" },
    });

    if (!sampleCustomer) {
      const customerPassword = await bcrypt.hash("Customer@123", 10);
      sampleCustomer = await User.create({
        name: "Sample Customer",
        email: "customer@example.com",
        password: customerPassword,
        role: "user",
        address: "Addis Ababa, Ethiopia",
        phone: "0992474781",
        isActive: true,
      });
      console.log("✅ Sample customer created");
    } else {
      console.log("✅ Sample customer already exists");
    }

    console.log("\n🎉 SEEDING COMPLETE!");
    console.log("=".repeat(50));
    console.log("\n📋 Data in 'project2' schema:");

    // Show counts
    const [userCount] = await sequelize.query(
      'SELECT COUNT(*) as count FROM "Users"',
    );
    const [categoryCount] = await sequelize.query(
      'SELECT COUNT(*) as count FROM "Categories"',
    );
    const [bookCount] = await sequelize.query(
      'SELECT COUNT(*) as count FROM "Books"',
    );

    console.log(`   👥 Users: ${parseInt(userCount[0].count)}`);
    console.log(`   📚 Categories: ${parseInt(categoryCount[0].count)}`);
    console.log(`   📖 Books: ${parseInt(bookCount[0].count)}`);

    // Show book covers
    console.log("\n📖 Book Cover Examples:");
    const books = await Book.findAll({ limit: 3 });
    books.forEach((book, i) => {
      console.log(`   ${i + 1}. ${book.title}`);
      console.log(`      Cover: ${book.coverImage.substring(0, 60)}...`);
    });

    console.log("\n🚀 Login Credentials:");
    console.log("   Admin: sebrinm9@gmail.com / Sebrina@123");
    console.log("   Customer: customer@example.com / Customer@123");
  } catch (error) {
    console.error("\n❌ SEEDING FAILED:", error.message);
    console.error("Error details:", error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
