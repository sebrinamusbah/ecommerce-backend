const { connectDB, disconnectDB } = require("../config/db");
const { sequelize } = require("../models");

beforeAll(async () => {
  try {
    await connectDB();

    // Sync all models in test schema
    await sequelize.sync({ force: true });

    console.log("Test database ready");
  } catch (error) {
    console.error("Test database setup failed:", error.message);
    // Don't throw - let tests handle missing database
  }
});

afterAll(async () => {
  try {
    // Optional: Drop test schema after tests
    if (process.env.NODE_ENV === "test") {
      await sequelize.dropSchema("test", { ifExists: true });
      console.log("Test schema cleaned up");
    }

    await disconnectDB();
  } catch (error) {
    console.error("Cleanup failed:", error.message);
  }
});

// Clean data between tests (optional)
beforeEach(async () => {
  if (process.env.NODE_ENV === "test" && sequelize) {
    const models = sequelize.models;
    for (const modelName in models) {
      try {
        await models[modelName].destroy({ where: {}, force: true });
      } catch (error) {
        // Ignore errors if table doesn't exist yet
      }
    }
  }
});
