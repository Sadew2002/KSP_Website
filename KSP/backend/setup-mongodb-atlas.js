require('dotenv').config();
const mongoose = require('mongoose');

async function setupMongoDBAtlas() {
  try {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║   MongoDB Atlas Database Setup for KSP E-Commerce   ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');

    // Get connection string from environment
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env file');
    }

    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ Connected to MongoDB Atlas successfully!');
    console.log(`✓ Database: ${mongoose.connection.db.databaseName}`);
    console.log(`✓ Host: ${mongoose.connection.host}\n`);

    // Import all models to ensure they're registered
    console.log('📦 Loading models...');
    require('./src/models');
    console.log('✓ All models loaded\n');

    // Get all collections
    const collections = mongoose.connection.collections;
    
    console.log('📊 Database Collections Status:');
    console.log('─'.repeat(50));
    
    for (const name in collections) {
      const collection = collections[name];
      const count = await collection.countDocuments();
      const indexes = await collection.getIndexes();
      const indexCount = Object.keys(indexes).length;
      
      console.log(`✓ ${name.padEnd(20)} | Documents: ${String(count).padStart(4)} | Indexes: ${indexCount}`);
    }
    
    console.log('─'.repeat(50));
    
    // Display index information
    console.log('\n🔍 Collection Indexes:');
    console.log('─'.repeat(50));
    
    for (const name in collections) {
      const collection = collections[name];
      const indexes = await collection.getIndexes();
      
      console.log(`\n${name}:`);
      for (const indexName in indexes) {
        const indexInfo = indexes[indexName];
        const keys = Object.keys(indexInfo.key).join(', ');
        console.log(`  - ${indexName}: [${keys}]${indexInfo.unique ? ' (unique)' : ''}`);
      }
    }
    
    console.log('\n' + '─'.repeat(50));
    console.log('\n✅ MongoDB Atlas database setup complete!\n');
    
    console.log('📝 Next Steps:');
    console.log('   1. Run: npm run seed     (to populate initial data)');
    console.log('   2. Run: npm start        (to start the server)');
    console.log('   3. Access: http://localhost:5000\n');
    
    console.log('📋 Database Information:');
    console.log(`   URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//<username>:<password>@')}`);
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   Collections: ${Object.keys(collections).length}\n`);

    await mongoose.connection.close();
    console.log('✓ Connection closed\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    
    if (error.message.includes('MONGODB_URI')) {
      console.log('\n💡 Setup Instructions:');
      console.log('   1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas');
      console.log('   2. Create a cluster');
      console.log('   3. Get your connection string');
      console.log('   4. Update .env file with: MONGODB_URI=mongodb+srv://...\n');
    } else if (error.name === 'MongoServerError' && error.code === 8000) {
      console.log('\n💡 Authentication Error:');
      console.log('   - Check your MongoDB Atlas username and password');
      console.log('   - Make sure special characters in password are URL-encoded');
      console.log('   - Example: @ becomes %40, # becomes %23\n');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('\n💡 Network Error:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the cluster URL in your connection string');
      console.log('   - Make sure your IP is whitelisted in MongoDB Atlas\n');
    }
    
    await mongoose.connection.close();
    process.exit(1);
  }
}

setupMongoDBAtlas();
