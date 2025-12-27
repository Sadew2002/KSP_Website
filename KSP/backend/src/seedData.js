const sequelize = require('./config/sequelize');
const { User, Product } = require('./models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.findOrCreate({
      where: { email: 'admin@ksp.com' },
      defaults: {
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
      }
    });
    console.log('✓ Admin user created:', admin[1] ? 'New' : 'Already exists');

    // Create Sample Customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await User.findOrCreate({
      where: { email: 'customer@example.com' },
      defaults: {
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
      }
    });
    console.log('✓ Customer user created:', customer[1] ? 'New' : 'Already exists');

    // Create Sample Products
    const products = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'Latest Apple flagship with A17 Pro chip, titanium design, and advanced camera system.',
        brand: 'Apple',
        price: 499999.00,
        storage: '256GB',
        condition: 'New',
        color: 'Natural Titanium',
        ram: '8GB',
        quantity: 15,
        imageUrl: '/images/iphone15promax.jpg',
        sku: 'APL-IP15PM-256-NT'
      },
      {
        name: 'iPhone 15 Pro',
        description: 'Powerful A17 Pro chip with titanium design and Pro camera system.',
        brand: 'Apple',
        price: 449999.00,
        storage: '128GB',
        condition: 'New',
        color: 'Blue Titanium',
        ram: '8GB',
        quantity: 20,
        imageUrl: '/images/iphone15pro.jpg',
        sku: 'APL-IP15P-128-BT'
      },
      {
        name: 'iPhone 14',
        description: 'A15 Bionic chip with excellent camera and all-day battery life.',
        brand: 'Apple',
        price: 329999.00,
        storage: '128GB',
        condition: 'New',
        color: 'Midnight',
        ram: '6GB',
        quantity: 25,
        imageUrl: '/images/iphone14.jpg',
        sku: 'APL-IP14-128-MN'
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Ultimate Galaxy experience with S Pen, AI features, and 200MP camera.',
        brand: 'Samsung',
        price: 479999.00,
        storage: '256GB',
        condition: 'New',
        color: 'Titanium Black',
        ram: '12GB',
        quantity: 18,
        imageUrl: '/images/galaxys24ultra.jpg',
        sku: 'SAM-S24U-256-TB'
      },
      {
        name: 'Samsung Galaxy S24+',
        description: 'Premium Galaxy with AI features, bright display, and versatile cameras.',
        brand: 'Samsung',
        price: 389999.00,
        storage: '256GB',
        condition: 'New',
        color: 'Cobalt Violet',
        ram: '12GB',
        quantity: 22,
        imageUrl: '/images/galaxys24plus.jpg',
        sku: 'SAM-S24P-256-CV'
      },
      {
        name: 'Samsung Galaxy A54 5G',
        description: 'Awesome 5G phone with stunning display and long-lasting battery.',
        brand: 'Samsung',
        price: 159999.00,
        storage: '128GB',
        condition: 'New',
        color: 'Awesome Graphite',
        ram: '8GB',
        quantity: 30,
        imageUrl: '/images/galaxya54.jpg',
        sku: 'SAM-A54-128-AG'
      },
      {
        name: 'Google Pixel 8 Pro',
        description: 'Best of Google AI with Tensor G3 chip and incredible camera.',
        brand: 'Google',
        price: 399999.00,
        storage: '128GB',
        condition: 'New',
        color: 'Obsidian',
        ram: '12GB',
        quantity: 12,
        imageUrl: '/images/pixel8pro.jpg',
        sku: 'GGL-PX8P-128-OB'
      },
      {
        name: 'Google Pixel 8',
        description: 'Google AI in a compact design with excellent photography.',
        brand: 'Google',
        price: 279999.00,
        storage: '128GB',
        condition: 'New',
        color: 'Hazel',
        ram: '8GB',
        quantity: 15,
        imageUrl: '/images/pixel8.jpg',
        sku: 'GGL-PX8-128-HZ'
      },
      {
        name: 'OnePlus 12',
        description: 'Flagship killer with Snapdragon 8 Gen 3 and Hasselblad cameras.',
        brand: 'OnePlus',
        price: 329999.00,
        storage: '256GB',
        condition: 'New',
        color: 'Silky Black',
        ram: '12GB',
        quantity: 20,
        imageUrl: '/images/oneplus12.jpg',
        sku: 'OP-12-256-SB'
      },
      {
        name: 'Xiaomi 14 Pro',
        description: 'Premium flagship with Leica optics and powerful Snapdragon processor.',
        brand: 'Xiaomi',
        price: 299999.00,
        storage: '256GB',
        condition: 'New',
        color: 'Black',
        ram: '12GB',
        quantity: 16,
        imageUrl: '/images/xiaomi14pro.jpg',
        sku: 'XMI-14P-256-BK'
      },
      {
        name: 'iPhone 13 (Used)',
        description: 'Well-maintained used iPhone 13 in excellent condition. Minor scratches only.',
        brand: 'Apple',
        price: 189999.00,
        storage: '128GB',
        condition: 'Used',
        color: 'Pink',
        ram: '4GB',
        quantity: 5,
        imageUrl: '/images/iphone13used.jpg',
        sku: 'APL-IP13-128-PK-U'
      },
      {
        name: 'Samsung Galaxy S23 (Used)',
        description: 'Pre-owned Galaxy S23 in great condition with original accessories.',
        brand: 'Samsung',
        price: 219999.00,
        storage: '256GB',
        condition: 'Used',
        color: 'Cream',
        ram: '8GB',
        quantity: 8,
        imageUrl: '/images/galaxys23used.jpg',
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
