// Payment Routes (Protected)
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

/**
 * POST /api/payments/process-payment
 * Process payment (Stripe/PayHere/COD)
 */
router.post('/process-payment', async (req, res) => {
  try {
    const { orderId, paymentMethod, transactionReference, amount } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!orderId || !paymentMethod || !transactionReference || !amount) {
      return res.status(400).json({
        success: false,
        error: 'All payment details are required'
      });
    }

    // Validate orderId is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }

    // Find order
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        error: 'Payment already processed for this order'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      orderId,
      paymentMethod,
      transactionReference,
      amount: parseFloat(amount).toFixed(2),
      status: 'Completed',
      paidAt: new Date(),
      metadata: {
        description: `Payment for order ${orderId}`,
        timestamp: new Date().toISOString()
      }
    });

    // Update order payment status
    order.paymentStatus = 'Paid';
    order.status = 'Confirmed';
    await order.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: payment
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payment'
    });
  }
});

/**
 * POST /api/payments/stripe-webhook
 * Stripe webhook handler (Public route - verify webhook signature)
 */
router.post('/stripe-webhook', async (req, res) => {
  try {
    const { orderId, status, transactionId } = req.body;

    // Validate webhook data (in production, verify Stripe signature)
    if (!orderId || !status || !transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid webhook data'
      });
    }

    // Validate orderId is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Update order based on Stripe webhook status
    if (status === 'succeeded') {
      order.paymentStatus = 'Paid';
      order.status = 'Confirmed';
    } else if (status === 'failed') {
      order.paymentStatus = 'Failed';
    }

    await order.save();

    // Create or update payment record
    let payment = await Payment.findOne({ transactionReference: transactionId });

    if (!payment) {
      payment = await Payment.create({
        orderId,
        paymentMethod: 'Stripe',
        transactionReference: transactionId,
        status: status === 'succeeded' ? 'Completed' : 'Failed',
        amount: order.totalAmount,
        paidAt: status === 'succeeded' ? new Date() : null,
        metadata: { webhookSource: 'Stripe' }
      });
    } else {
      payment.status = status === 'succeeded' ? 'Completed' : 'Failed';
      if (status === 'succeeded') payment.paidAt = new Date();
      await payment.save();
    }

    res.json({
      success: true,
      message: 'Webhook processed'
    });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

/**
 * POST /api/payments/payhere-notify
 * PayHere payment notification (Public route - verify hash)
 */
router.post('/payhere-notify', async (req, res) => {
  try {
    const { order_id, status, merchant_id, payment_ref } = req.body;

    // Validate webhook data
    if (!order_id || !status || !payment_ref) {
      return res.status(400).json({
        success: false,
        error: 'Invalid PayHere notification'
      });
    }

    // Validate order_id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(order_id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }

    // Find order
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Update order based on PayHere status
    // PayHere status: 2 = approved, 0 = pending, -1/-2 = failed/cancelled
    if (status === '2') {
      order.paymentStatus = 'Paid';
      order.status = 'Confirmed';
    } else if (status === '0') {
      order.paymentStatus = 'Pending';
    } else {
      order.paymentStatus = 'Failed';
    }

    await order.save();

    // Create or update payment record
    let payment = await Payment.findOne({ transactionReference: payment_ref });

    if (!payment) {
      payment = await Payment.create({
        orderId: order_id,
        paymentMethod: 'PayHere',
        transactionReference: payment_ref,
        status: status === '2' ? 'Completed' : status === '0' ? 'Pending' : 'Failed',
        amount: order.totalAmount,
        paidAt: status === '2' ? new Date() : null,
        metadata: { merchantId: merchant_id, webhookSource: 'PayHere' }
      });
    } else {
      payment.status = status === '2' ? 'Completed' : status === '0' ? 'Pending' : 'Failed';
      if (status === '2') payment.paidAt = new Date();
      await payment.save();
    }

    // Return success to PayHere
    res.json({ success: true });
  } catch (error) {
    console.error('PayHere notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process notification'
    });
  }
});

/**
 * GET /api/payments/:orderId
 * Get payment status
 */
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Validate orderId is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }

    // Find order to verify user owns it
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Get payment
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: {
        paymentId: payment._id,
        status: payment.status,
        method: payment.paymentMethod,
        amount: payment.amount,
        paidAt: payment.paidAt,
        transactionReference: payment.transactionReference
      }
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment status'
    });
  }
});

module.exports = router;
