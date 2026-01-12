const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    priceAtAdd: {
      type: mongoose.Decimal128,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique combination of userId and productId
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Convert Decimal128 to Number for JSON serialization
cartSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.priceAtAdd) {
      ret.priceAtAdd = parseFloat(ret.priceAtAdd.toString());
    }
    return ret;
  },
});

module.exports = mongoose.model('Cart', cartSchema);
