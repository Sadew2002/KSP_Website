// Payment Routes (Protected)
const express = require('express');
const router = express.Router();

/**
 * POST /api/payments/process-payment
 * Process payment (Stripe/PayHere/COD)
 */
router.post('/process-payment', (req, res) => {
  res.json({ message: 'Process payment' });
});

/**
 * POST /api/payments/stripe-webhook
 * Stripe webhook handler
 */
router.post('/stripe-webhook', (req, res) => {
  res.json({ message: 'Stripe webhook' });
});

/**
 * POST /api/payments/payhere-notify
 * PayHere payment notification
 */
router.post('/payhere-notify', (req, res) => {
  res.json({ message: 'PayHere notification' });
});

/**
 * GET /api/payments/:orderId
 * Get payment status
 */
router.get('/:orderId', (req, res) => {
  res.json({ message: 'Get payment status' });
});

module.exports = router;
