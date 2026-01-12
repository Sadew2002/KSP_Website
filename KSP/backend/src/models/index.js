const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');

// Mongoose models are exported directly
// Virtual fields and population are defined in the model files themselves
// Relationships are handled via ObjectId references and Mongoose populate()

module.exports = {
  User,
  Product,
  Cart,
  Order,
  OrderItem,
  Payment,
};
