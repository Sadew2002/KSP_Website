require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/mongodb');
const { User, Product } = require('./models');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Database connected...');

    // Create or Update Admin User
    let admin = await User.findOne({ email: 'admin@ksp.com' });
    
    if (admin) {
      // Update existing admin
      admin.password = 'admin123';
      await admin.save();
      console.log('✓ Admin user: Already exists - Password reset to admin123');
    } else {
      // Create new admin
      admin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@ksp.com',
        password: 'admin123',
        phone: '0771234567',
        address: '123 Main Street',
        city: 'Kandy',
        province: 'Central',
        postalCode: '20000',
        role: 'admin',
        isActive: true
      });
      console.log('✓ Admin user: Created with password admin123');
    }

    // Create or Update Sample Customer
    let customer = await User.findOne({ email: 'customer@example.com' });
    
    if (customer) {
      // Update existing customer
      customer.password = 'customer123';
      await customer.save();
      console.log('✓ Customer user: Already exists - Password reset to customer123');
    } else {
      // Create new customer
      customer = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'customer@example.com',
        password: 'customer123',
        phone: '0777654321',
        address: '456 Temple Road',
        city: 'Colombo',
        province: 'Western',
        postalCode: '10000',
        role: 'customer',
        isActive: true
      });
      console.log('✓ Customer user: Created with password customer123');
    }

    // Create Sample Products
    const products = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'Latest Apple flagship with A17 Pro chip, titanium design, and advanced camera system.',
        brand: 'Apple',
        price: 499999.00,
        storage: '256GB',
        condition: 'Brand New',
        color: 'Natural Titanium',
        ram: '8GB',
        quantity: 15,
        imageUrl: '/uploads/products/product-1767002488188-1144297335.jpeg',
        sku: 'APL-IP15PM-256-NT',
        isNewArrival: true,
        isPremiumDeal: false,
        productType: 'Phones'
      },
      {
        name: 'iPhone 15 Pro',
        description: 'Powerful A17 Pro chip with titanium design and Pro camera system.',
        brand: 'Apple',
        price: 449999.00,
        storage: '128GB',
        condition: 'Brand New',
        color: 'Blue Titanium',
        ram: '8GB',
        quantity: 20,
        imageUrl: '/uploads/products/product-1767002488188-1144297336.jpeg',
        sku: 'APL-IP15P-128-BT',
        isNewArrival: true,
        isPremiumDeal: false,
        productType: 'Phones'
      },
      {
        name: 'iPhone 14',
        description: 'A15 Bionic chip with excellent camera and all-day battery life.',
        brand: 'Apple',
        price: 329999.00,
        storage: '128GB',
        condition: 'Brand New',
        color: 'Midnight',
        ram: '6GB',
        quantity: 25,
        imageUrl: '/uploads/products/product-1767002488188-1144297337.jpeg',
        sku: 'APL-IP14-128-MN',
        isNewArrival: false,
        isPremiumDeal: true,
        productType: 'Phones'
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Ultimate Galaxy experience with S Pen, AI features, and 200MP camera.',
        brand: 'Samsung',
        price: 479999.00,
        storage: '256GB',
        condition: 'Brand New',
        color: 'Titanium Black',
        ram: '12GB',
        quantity: 18,
        imageUrl: '/uploads/products/product-1767002488188-1144297338.jpeg',
        sku: 'SAM-S24U-256-TB',
        isNewArrival: true,
        isPremiumDeal: true,
        productType: 'Phones'
      },
      {
        name: 'Samsung Galaxy S24+',
        description: 'Premium Galaxy with AI features, bright display, and versatile cameras.',
        brand: 'Samsung',
        price: 389999.00,
        storage: '256GB',
        condition: 'Brand New',
        color: 'Cobalt Violet',
        ram: '12GB',
        quantity: 22,
        imageUrl: '/uploads/products/product-1767002488188-1144297339.jpeg',
        sku: 'SAM-S24P-256-CV',
        isNewArrival: true,
        isPremiumDeal: false,
        productType: 'Phones'
      },
      {
        name: 'Samsung Galaxy A54 5G',
        description: 'Awesome 5G phone with stunning display and long-lasting battery.',
        brand: 'Samsung',
        price: 159999.00,
        storage: '128GB',
        condition: 'Brand New',
        color: 'Awesome Graphite',
        ram: '8GB',
        quantity: 30,
        imageUrl: '/uploads/products/product-1767002488188-1144297340.jpeg',
        sku: 'SAM-A54-128-AG',
        isNewArrival: false,
        isPremiumDeal: true,
        productType: 'Phones'
      },
      {
        name: 'Google Pixel 8 Pro',
        description: 'Best of Google AI with Tensor G3 chip and incredible camera.',
        brand: 'Google',
        price: 399999.00,
        storage: '128GB',
        condition: 'Brand New',
        color: 'Obsidian',
        ram: '12GB',
        quantity: 12,
        imageUrl: '/uploads/products/product-1767002488188-1144297341.jpeg',
        sku: 'GGL-PX8P-128-OB',
        isNewArrival: true,
        isPremiumDeal: false,
        productType: 'Phones'
      },
      {
        name: 'Google Pixel 8',
        description: 'Google AI in a compact design with excellent photography.',
        brand: 'Google',
        price: 279999.00,
        storage: '128GB',
        condition: 'Brand New',
        color: 'Hazel',
        ram: '8GB',
        quantity: 15,
        imageUrl: '/uploads/products/product-1767002488188-1144297342.jpeg',
        sku: 'GGL-PX8-128-HZ',
        isNewArrival: false,
        isPremiumDeal: false,
        productType: 'Phones'
      },
      {
        name: 'OnePlus 12',
        description: 'Flagship killer with Snapdragon 8 Gen 3 and Hasselblad cameras.',
        brand: 'OnePlus',
        price: 329999.00,
        storage: '256GB',
        condition: 'Brand New',
        color: 'Silky Black',
        ram: '12GB',
        quantity: 20,
        imageUrl: '/uploads/products/product-1767002488188-1144297343.jpeg',
        sku: 'OP-12-256-SB',
        isNewArrival: true,
        isPremiumDeal: true,
        productType: 'Phones'
      },
      {
        name: 'Xiaomi 14 Pro',
        description: 'Premium flagship with Leica optics and powerful Snapdragon processor.',
        brand: 'Xiaomi',
        price: 299999.00,
        storage: '256GB',
        condition: 'Brand New',
        color: 'Black',
        ram: '12GB',
        quantity: 16,
        imageUrl: '/uploads/products/product-1767002488188-1144297344.jpeg',
        sku: 'XMI-14P-256-BK',
        isNewArrival: false,
        isPremiumDeal: true,
        productType: 'Phones'
      },
      {
        name: 'iPhone 13 (Pre-Owned)',
        description: 'Well-maintained pre-owned iPhone 13 in excellent condition. Minor scratches only.',
        brand: 'Apple',
        price: 189999.00,
        storage: '128GB',
        condition: 'Pre-Owned',
        color: 'Pink',
        ram: '4GB',
        quantity: 5,
        imageUrl: '/uploads/products/product-1767002488188-1144297345.jpeg',
        sku: 'APL-IP13-128-PK-U',
        isNewArrival: false,
        isPremiumDeal: false,
        productType: 'Phones'
      },
      {
        name: 'Samsung Galaxy S23 (Pre-Owned)',
        description: 'Pre-owned Galaxy S23 in great condition with original accessories.',
        brand: 'Samsung',
        price: 219999.00,
        storage: '256GB',
        condition: 'Pre-Owned',
        color: 'Cream',
        ram: '8GB',
        quantity: 8,
        imageUrl: '/uploads/products/product-1767002488188-1144297346.jpeg',
        sku: 'SAM-S23-256-CR-U',
        isNewArrival: false,
        isPremiumDeal: false,
        productType: 'Phones'
      }
    ];

    for (const productData of products) {
      const existing = await Product.findOne({ sku: productData.sku });
      if (existing) {
        console.log(`✓ Product "${productData.name}": Already exists`);
      } else {
        await Product.create(productData);
        console.log(`✓ Product "${productData.name}": Created`);
      }
    }

    console.log('\n✅ Seed data completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@ksp.com / admin123');
    console.log('   Customer: customer@example.com / customer123');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
