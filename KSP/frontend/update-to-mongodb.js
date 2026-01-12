const fs = require('fs');
const path = require('path');

// Files to update
const files = [
  'src/pages/Products.js',
  'src/pages/Home.js',
  'src/pages/Admin/Dashboard.js',
  'src/context/store.js'
];

const replacements = [
  // Replace product.id with product._id
  { from: /product\.id(?![a-zA-Z_])/g, to: 'product._id' },
  // Replace cartItem.id with cartItem._id
  { from: /cartItem\.id(?![a-zA-Z_])/g, to: 'cartItem._id' },
  // Replace item.id with item._id
  { from: /item\.id(?![a-zA-Z_])/g, to: 'item._id' },
  // Replace order.id with order._id (but not orderId)
  { from: /order\.id(?![a-zA-Z_])/g, to: 'order._id' },
];

console.log('🔄 Updating frontend files for MongoDB compatibility...\n');

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${file}`);
  } else {
    console.log(`➖ No changes: ${file}`);
  }
});

console.log('\n✨ MongoDB update complete!');
