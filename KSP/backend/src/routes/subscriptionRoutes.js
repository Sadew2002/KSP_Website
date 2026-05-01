// Subscription Routes (Protected)
const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription');

const generateSubscriptionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `SUB-${timestamp}-${random}`;
};

/**
 * POST /api/subscriptions/subscribe
 * Create or reactivate a subscription for the logged-in user
 */
router.post('/subscribe', async (req, res) => {
  try {
    const userId = req.user.id;

    let subscription = await Subscription.findOne({ userId });

    if (subscription && subscription.status === 'active') {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed',
        data: subscription,
      });
    }

    if (subscription) {
      subscription.status = 'active';
      subscription.subscriptionDate = new Date();
      await subscription.save();

      return res.status(200).json({
        success: true,
        message: 'Subscription reactivated successfully',
        data: subscription,
      });
    }

    subscription = await Subscription.create({
      subscriptionId: generateSubscriptionId(),
      userId,
      subscriptionDate: new Date(),
      status: 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      data: subscription,
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
    });
  }
});

module.exports = router;