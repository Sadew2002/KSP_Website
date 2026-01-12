const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: mongoose.Decimal128,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'payhere', 'stripe'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    paymentReference: {
      type: String,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Convert Decimal128 to Number for JSON serialization
paymentSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = parseFloat(ret.amount.toString());
    }
    return ret;
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
