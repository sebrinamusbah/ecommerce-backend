const db = require("../models");

async function createTestSchema() {
    try {
        console.log("Setting up test schema...");

        // 1. Check if we're in test environment
        if (process.env.NODE_ENV !== "test") {
            console.warn(
                "⚠️  WARNING: Not in test environment. Forcing NODE_ENV=test"
            );
            process.env.NODE_ENV = "test";
        }

        // 2. Drop and recreate the test schema
        console.log("Cleaning up test schema...");
        try {
            // First, terminate any active connections in the test schema
            await db.sequelize
                .query(
                    `
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = current_database()
          AND pg_stat_activity.schemaname = 'test'
          AND pid <> pg_backend_pid();
      `
                )
                .catch(() => {
                    console.log("No active connections to terminate");
                });

            // Drop the schema and all its contents
            await db.sequelize.query("DROP SCHEMA IF EXISTS test CASCADE");
            console.log("✓ Dropped test schema");
        } catch (dropError) {
            // If schema doesn't exist or can't be dropped, continue
            console.log("No existing test schema to drop");
        }

        // 3. Create the test schema
        await db.sequelize.query("CREATE SCHEMA test");
        console.log("✓ Created test schema");

        // 4. Set schema for all models
        console.log("Setting schema for models...");
        Object.keys(db).forEach((modelName) => {
            if (db[modelName] && typeof db[modelName].schema === "function") {
                try {
                    db[modelName].schema("test");
                    console.log(`  ✓ Set schema for ${modelName}`);
                } catch (error) {
                    console.log(
                        `  ⚠️  Could not set schema for ${modelName}: ${error.message}`
                    );
                }
            }
        });

        // 5. Sync all models (this creates tables in the test schema)
        console.log("Syncing database tables...");
        await db.sequelize.sync({ force: true });
        console.log("✓ Database tables synced");

        // 6. Create test data
        console.log("Creating test data...");

        // Example test data creation (adjust based on your models)
        try {
            // Create test user
            if (db.User) {
                const testUser = await db.User.create({
                    name: "Test User",
                    email: "test@example.com",
                    password: "password123",
                    role: "user",
                });
                console.log(`✓ Created test user: ${testUser.email}`);
            }

            // Add more test data as needed
            // if (db.Product) { ... }
            // if (db.Order) { ... }
        } catch (dataError) {
            console.warn("⚠️  Could not create test data:", dataError.message);
        }

        console.log("\n✅ Test schema setup completed successfully!");
        console.log('📝 Test schema: "test"');
        console.log("🔗 Database:", process.env.DB_NAME || process.env.POSTGRES_DB);

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Setup failed:", error.message);
        console.error("Stack:", error.stack);
        process.exit(1);
    }
}

// Handle promise rejection
process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection:", error);
    process.exit(1);
});

createTestSchema();