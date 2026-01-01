require('dotenv').config();
const { sequelize } = require('./models');

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    console.log('\n🔄 Creating database tables...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✓ All tables created successfully!');

    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
