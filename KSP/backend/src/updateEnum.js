// Script to update the condition ENUM in PostgreSQL
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log
  }
);

async function updateEnum() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Check current enum values
    console.log('Checking current ENUM values...');
    const result = await sequelize.query(`
      SELECT unnest(enum_range(NULL::"enum_Products_condition")) AS condition_value;
    `);
    console.log('Current ENUM values:', result[0]);

    // Skip data update if values don't exist
    console.log('Checking for old values...');
    const oldValues = await sequelize.query(`SELECT COUNT(*) FROM "Products" WHERE condition IN ('New', 'Used')`);
    if (oldValues[0][0].count > 0) {
      console.log('Updating existing products...');
      await sequelize.query(`UPDATE "Products" SET condition = 'Brand New' WHERE condition = 'New'`);
      await sequelize.query(`UPDATE "Products" SET condition = 'Pre-Owned' WHERE condition = 'Used'`);
    } else {
      console.log('No old values found, skipping data update');
    }
    
    // Create a new ENUM type with the new values
    console.log('Creating new ENUM type...');
    await sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Products_condition_new" AS ENUM ('Brand New', 'Pre-Owned');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Drop the default constraint first
    console.log('Dropping default constraint...');
    await sequelize.query(`ALTER TABLE "Products" ALTER COLUMN condition DROP DEFAULT`);

    // Alter the column to use the new ENUM type
    console.log('Altering column...');
    await sequelize.query(`
      ALTER TABLE "Products" 
      ALTER COLUMN condition TYPE "enum_Products_condition_new" 
      USING condition::text::"enum_Products_condition_new"
    `);

    // Set the new default
    console.log('Setting new default...');
    await sequelize.query(`ALTER TABLE "Products" ALTER COLUMN condition SET DEFAULT 'Brand New'`);

    // Drop the old ENUM type
    console.log('Dropping old ENUM type...');
    await sequelize.query(`DROP TYPE IF EXISTS "enum_Products_condition"`);

    // Rename the new ENUM type to the original name
    console.log('Renaming ENUM type...');
    await sequelize.query(`ALTER TYPE "enum_Products_condition_new" RENAME TO "enum_Products_condition"`);

    console.log('✓ ENUM updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating ENUM:', error);
    process.exit(1);
  }
}

updateEnum();
