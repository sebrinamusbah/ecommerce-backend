const fs = require('fs');
const path = require('path');

console.log('Ì¥ß Fixing database connection...\n');

// 1. Check .env
console.log('1. Checking .env file...');
try {
  require('dotenv').config();
  if (process.env.DATABASE_URL) {
    console.log('   ‚úÖ DATABASE_URL found');
    console.log('   Ì≥ã URL:', process.env.DATABASE_URL.substring(0, 50) + '...');
  } else {
    console.log('   ‚ùå DATABASE_URL not found in .env');
  }
} catch (e) {
  console.log('   ‚ö†Ô∏è  Error reading .env:', e.message);
}

// 2. Check packages
console.log('\n2. Checking required packages...');
try {
  require('pg');
  console.log('   ‚úÖ pg package found');
} catch (e) {
  console.log('   ‚ùå pg package missing. Run: npm install pg pg-hstore');
}

try {
  require('sequelize');
  console.log('   ‚úÖ sequelize package found');
} catch (e) {
  console.log('   ‚ùå sequelize package missing');
}

// 3. Test connection
console.log('\n3. Testing database connection...');
if (process.env.DATABASE_URL) {
  const { Sequelize } = require('sequelize');
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  });
  
  sequelize.authenticate()
    .then(() => {
      console.log('   ‚úÖ Database connection successful!');
      
      // 4. Try to load models
      console.log('\n4. Loading models...');
      try {
        const db = require('./models');
        console.log('   ‚úÖ Models loaded successfully');
        console.log('   Ì≥ã Available models:', 
          Object.keys(db).filter(k => !['sequelize', 'Sequelize'].includes(k)).join(', ')
        );
        
        // 5. Sync models
        console.log('\n5. Syncing database...');
        db.sequelize.sync({ alter: true })
          .then(() => {
            console.log('   ‚úÖ Database synced successfully!');
            console.log('\nÌæâ Everything is ready! Run: npm run dev');
            process.exit(0);
          })
          .catch(syncErr => {
            console.log('   ‚ùå Error syncing:', syncErr.message);
            process.exit(1);
          });
          
      } catch (modelError) {
        console.log('   ‚ùå Error loading models:', modelError.message);
        process.exit(1);
      }
    })
    .catch(err => {
      console.log('   ‚ùå Database connection failed:', err.message);
      console.log('\nÌ≤° Solutions:');
      console.log('   1. Make sure PostgreSQL is running on Render');
      console.log('   2. Check your DATABASE_URL in .env file');
      console.log('   3. Install packages: npm install pg pg-hstore');
      process.exit(1);
    });
} else {
  console.log('   ‚ö†Ô∏è  Skipping connection test (no DATABASE_URL)');
  process.exit(1);
}
