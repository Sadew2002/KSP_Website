const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: null,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    price: {
      type: mongoose.Decimal128,
      required: true,
      min: 0,
      index: true,
    },
    storage: {
      type: String,
      default: '128GB',
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Pre-Owned'],
      default: 'Brand New',
      index: true,
    },
    color: {
      type: String,
      default: null,
    },
    ram: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPremiumDeal: {
      type: Boolean,
      default: false,
      index: true,
    },
    productType: {
      type: String,
      enum: ['Phones', 'Tablets', 'Earbuds', 'Smartwatches', 'Accessories'],
      default: 'Phones',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
productSchema.index({ isActive: 1, brand: 1 });
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ isActive: 1, price: 1 });
productSchema.index({ isNewArrival: 1, isActive: 1 });
productSchema.index({ isPremiumDeal: 1, isActive: 1 });

// Text index for search functionality
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Convert Decimal128 to Number for JSON serialization
productSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.price) {
      ret.price = parseFloat(ret.price.toString());
    }
    return ret;
  },
});

module.exports = mongoose.model('Product', productSchema);
