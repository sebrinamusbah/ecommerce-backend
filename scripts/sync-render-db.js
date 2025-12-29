require('dotenv').config();

async function syncRenderDatabase() {
  try {
    console.log('Ì¥ó Connecting to Render PostgreSQL...');
    
    const { Sequelize } = require('sequelize');
    
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
    
    // Test connection
    await sequelize.authenticate();
    console.log('‚úÖ Connected to Render PostgreSQL');
    
    // Load models
    const db = require('../models');
    
    // Sync models (use alter for production, not force)
    await db.sequelize.sync({ alter: true });
    console.log('‚úÖ Database schema updated');
    
    console.log('Ì≥ã Models synced successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('‚ùå Error syncing database:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

syncRenderDatabase();
