const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription');
const User = require('../models/User');
const authorizeAdmin = require('../middleware/authorize');
const { sendMail } = require('../utils/mailer');

const chunkArray = (items, size) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

/**
 * GET /api/admin/subscriptions/subscribers
 * Fetch all active subscribers with user details
 */
router.get('/subscribers', authorizeAdmin, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ status: 'active' })
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    const subscribers = subscriptions
      .map((subscription) => {
        const user = subscription.userId;

        if (!user) {
          return null;
        }

        return {
          _id: subscription._id,
          subscriptionId: subscription.subscriptionId,
          subscriptionDate: subscription.subscriptionDate,
          status: subscription.status,
          user: {
            _id: user._id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User',
            email: user.email || '',
            phone: user.phone || '',
          },
        };
      })
      .filter(Boolean);

    return res.json({
      success: true,
      message: 'Subscribers fetched successfully',
      data: subscribers,
      count: subscribers.length,
    });
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers',
    });
  }
});

/**
 * POST /api/admin/subscriptions/broadcast
 * Send a message to all active subscribers using Gmail SMTP
 */
router.post('/broadcast', authorizeAdmin, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required',
      });
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({
        success: false,
        message: 'SMTP is not configured',
      });
    }

    const subscriptions = await Subscription.find({ status: 'active' })
      .populate('userId', 'email firstName lastName');

    const emails = Array.from(new Set(
      subscriptions
        .map((subscription) => subscription.userId?.email)
        .filter(Boolean)
    ));

    if (emails.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active subscribers found',
      });
    }

    const batches = chunkArray(emails, 15);
    const summary = {
      recipients: emails.length,
      batches: batches.length,
      sent: 0,
      failed: 0,
      failedEmails: [],
    };

    for (const batch of batches) {
      const results = await Promise.allSettled(
        batch.map((email) => sendMail({
          to: email,
          subject,
          text: message,
          html: message.replace(/\n/g, '<br />'),
        }))
      );

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          summary.sent += 1;
        } else {
          summary.failed += 1;
          summary.failedEmails.push(batch[index]);
        }
      });

      if (batch.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return res.json({
      success: true,
      message: 'Broadcast email sent successfully',
      summary,
    });
  } catch (error) {
    console.error('Subscriber broadcast error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send broadcast email',
    });
  }
});

module.exports = router;