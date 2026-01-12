const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
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
      min: 1,
    },
    pricePerUnit: {
      type: mongoose.Decimal128,
      required: true,
    },
    subtotal: {
      type: mongoose.Decimal128,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Convert Decimal128 to Number for JSON serialization
orderItemSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.pricePerUnit) {
      ret.pricePerUnit = parseFloat(ret.pricePerUnit.toString());
    }
    if (ret.subtotal) {
      ret.subtotal = parseFloat(ret.subtotal.toString());
    }
    return ret;
  },
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
