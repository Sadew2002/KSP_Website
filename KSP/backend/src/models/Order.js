const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    totalAmount: {
      type: mongoose.Decimal128,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'payhere', 'stripe', 'bank_slip'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'pending_verification', 'paid', 'failed', 'refunded'],
      default: 'unpaid',
    },
    bankSlipUrl: {
      type: String,
      default: null,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    shippingCity: {
      type: String,
      required: true,
    },
    shippingProvince: {
      type: String,
      required: true,
    },
    shippingPostalCode: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: null,
    },
    trackingNumber: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Convert Decimal128 to Number for JSON serialization
orderSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.totalAmount) {
      ret.totalAmount = parseFloat(ret.totalAmount.toString());
    }
    return ret;
  },
});

module.exports = mongoose.model('Order', orderSchema);
