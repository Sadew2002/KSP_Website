const sequelize = require('./config/sequelize');
const { User, Product } = require('./models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');

    // Create or Update Admin User with correct password
    const adminPassword = await bcrypt.hash('admin123', 10);
    let admin = await User.findOne({ where: { email: 'admin@ksp.com' } });
    
    if (admin) {
      // Update existing admin
      await User.update(
        { password: adminPassword },
        { where: { email: 'admin@ksp.com' } }
      );
      console.log('✓ Admin user: Already exists - Password reset to admin123');
    } else {
      // Create new admin
      admin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@ksp.com',
        password: adminPassword,
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

    // Create or Update Sample Customer with correct password
    const customerPassword = await bcrypt.hash('customer123', 10);
    let customer = await User.findOne({ where: { email: 'customer@example.com' } });
    
    if (customer) {
      // Update existing customer
      await User.update(
        { password: customerPassword },
        { where: { email: 'customer@example.com' } }
      );
      console.log('✓ Customer user: Already exists - Password reset to customer123');
    } else {
      // Create new customer
      customer = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'customer@example.com',
        password: customerPassword,
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
        imageUrl: '/uploads/products/iphone-15-pro-max.jpeg',
        sku: 'APL-IP15PM-256-NT'
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
        imageUrl: '/uploads/products/iphone-15-pro.jpeg',
        sku: 'APL-IP15P-128-BT'
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
        imageUrl: '/uploads/products/iphone-14.jpg',
        sku: 'APL-IP14-128-MN'
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
        imageUrl: '/uploads/products/samsung-galaxy-s24-ultra.jpeg',
        sku: 'SAM-S24U-256-TB'
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
        imageUrl: '/uploads/products/samsung-galaxy-s24.jpg',
        sku: 'SAM-S24P-256-CV'
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
        imageUrl: '/uploads/products/samsung-galaxy-a54-5g.jpg',
        sku: 'SAM-A54-128-AG'
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
        imageUrl: '/uploads/products/google-pixel-8-pro.jpg',
        sku: 'GGL-PX8P-128-OB'
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
        imageUrl: '/uploads/products/google-pixel-8.jpg',
        sku: 'GGL-PX8-128-HZ'
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
        imageUrl: '/uploads/products/oneplus-12.jpg',
        sku: 'OP-12-256-SB'
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
        imageUrl: '/uploads/products/xiaomi-14-pro.jpg',
        sku: 'XMI-14P-256-BK'
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
        imageUrl: '/uploads/products/iphone-13-pre-owned.jpg',
        sku: 'APL-IP13-128-PK-U'
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
        imageUrl: '/uploads/products/samsung-galaxy-s23-pre-owned.jpg',
        sku: 'SAM-S23-256-CR-U'
      }
    ];

    for (const productData of products) {
      const [product, created] = await Product.findOrCreate({
        where: { sku: productData.sku },
        defaults: productData
      });
      console.log(`✓ Product "${productData.name}":`, created ? 'Created' : 'Already exists');
    }

    console.log('\n✅ Seed data completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@ksp.com / admin123');
    console.log('   Customer: customer@example.com / customer123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
