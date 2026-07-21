const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// ── Razorpay Initialization ───────────────────────────────────────────────────
// Keys MUST come from environment variables. Never use hardcoded fallbacks.
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('[Orders Route] FATAL: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set in .env');
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── GET /api/orders — Fetch orders for the logged-in user ────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const orders = await Order.findAll({
      where: {
        userId: req.user.id,
        // Exclude 'Pending' orders — these are incomplete Razorpay payment sessions
        // (user opened modal but didn't complete payment). Never show these to users.
        status: { [Op.ne]: 'Pending' },
      },
      order: [['createdAt', 'DESC']],
    });

    const formattedOrders = orders.map(order => {
      const plainOrder = order.get({ plain: true });
      try {
        plainOrder.items = JSON.parse(plainOrder.items);
      } catch (err) {
        plainOrder.items = [];
      }
      return plainOrder;
    });

    return res.json(formattedOrders);
  } catch (err) {
    console.error('[Orders Route] Fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});


// ── POST /api/orders — Create a new order (Standard / non-Razorpay fallback) ──
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, deliveryAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }
    if (totalAmount === undefined || totalAmount === null) {
      return res.status(400).json({ error: 'Total amount is required.' });
    }

    const order = await Order.create({
      userId: req.user.id,
      items: JSON.stringify(items),
      totalAmount: parseFloat(totalAmount),
      paymentMethod: paymentMethod || 'UPI',
      status: 'Confirmed',
      deliveryAddress: typeof deliveryAddress === 'object'
        ? JSON.stringify(deliveryAddress)
        : (deliveryAddress || ''),
    });

    const plainOrder = order.get({ plain: true });
    plainOrder.items = items;

    return res.status(201).json({
      message: 'Order placed successfully',
      order: plainOrder,
    });
  } catch (err) {
    console.error('[Orders Route] Create error:', err.message);
    return res.status(500).json({ error: 'Failed to place the order.' });
  }
});

// ── POST /api/orders/create — Step 1: Create a Razorpay order ─────────────────
// Called by the frontend before opening the Razorpay checkout modal.
// Returns: razorpay order_id, amount, key_id (from env), and our db_order_id.
// The order is stored in the DB with status 'Pending'.
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;

    if (!totalAmount || isNaN(parseFloat(totalAmount)) || parseFloat(totalAmount) <= 0) {
      return res.status(400).json({ error: 'A valid total amount is required.' });
    }

    const amount = parseFloat(totalAmount);

    if (amount > 500000) {
      return res.status(400).json({
        error: 'Order amount exceeds the Razorpay test mode limit (₹5,00,000). Please remove some items from your cart.',
      });
    }

    const amountInPaise = Math.round(amount * 100);

    // Step 1: Create the order on Razorpay servers
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    // Step 2: Persist the order in our DB with status 'Pending'
    const order = await Order.create({
      userId: req.user.id,
      items: JSON.stringify(Array.isArray(items) ? items : []),
      totalAmount: amount,
      paymentMethod: 'Razorpay',
      status: 'Pending',
      deliveryAddress: typeof deliveryAddress === 'object'
        ? JSON.stringify(deliveryAddress)
        : (deliveryAddress || ''),
      razorpayOrderId: rzpOrder.id,
    });

    // Return only the public key — secret never leaves the server
    return res.status(201).json({
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      db_order_id: order.id,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('[Orders Route] Razorpay Order Creation error:', err);
    const errorMsg = (err.error && err.error.description) ? err.error.description : (err.message || 'Unknown error');
    return res.status(500).json({ error: 'Failed to create Razorpay order: ' + errorMsg });
  }
});

// ── POST /api/orders/verify — Step 3: Verify Razorpay HMAC signature ──────────
// Called by the frontend AFTER the Razorpay checkout modal fires handler(response).
// Only updates the order status to 'Paid' if the HMAC-SHA256 signature is valid.
// Cart should be cleared by the frontend ONLY on a 200 response from this endpoint.
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // All three fields are mandatory — no bypass allowed
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        error: 'Missing required Razorpay parameters: razorpay_payment_id, razorpay_order_id, razorpay_signature are all required.',
      });
    }

    // Compute the expected HMAC-SHA256 signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest('hex');

    // Constant-time comparison to prevent timing attacks
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpay_signature, 'hex')
    );

    if (!isSignatureValid) {
      console.warn(`[Orders Route] Signature mismatch for order ${razorpay_order_id}`);
      return res.status(400).json({ error: 'Payment verification failed: signature mismatch.' });
    }

    // Find the pending order in our DB that matches this Razorpay order
    const order = await Order.findOne({
      where: {
        razorpayOrderId: razorpay_order_id,
        userId: req.user.id,       // Ensure the order belongs to the authenticated user
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found for the given Razorpay Order ID.' });
    }

    // Step 3: Finalize — update status to 'Paid' only after verified
    order.status = 'Paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    // Deduct wallet balance if walletUsed is passed
    const { walletUsed } = req.body;
    if (walletUsed && !isNaN(walletUsed) && parseFloat(walletUsed) > 0) {
      const User = require('../models/User');
      const user = await User.findByPk(req.user.id);
      if (user && user.walletBalance >= parseFloat(walletUsed)) {
        user.walletBalance -= parseFloat(walletUsed);
        await user.save();
      }
    }

    await order.save();

    return res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
      order: order.get({ plain: true }),
    });
  } catch (err) {
    console.error('[Orders Route] Razorpay verification error:', err);
    return res.status(500).json({ error: 'Failed to verify payment: ' + err.message });
  }
});

// ── POST /api/orders/:id/return — Initiate Return/Replacement ─────────────────
router.post('/:id/return', authMiddleware, async (req, res) => {
  try {
    const { reason, comments, action, items, pickupAddress } = req.body;
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.status = (action === 'replace') ? 'Replacement Requested' : 'Refunded';
    order.returnDetails = JSON.stringify({
      reason: reason || 'Not specified',
      comments: comments || '',
      action: action || 'refund',
      items: items || [],
      pickupAddress: pickupAddress || '',
      requestDate: new Date().toISOString(),
    });

    await order.save();

    return res.json({
      message: `Return request submitted successfully. Resolution: ${action}`,
      order,
    });
  } catch (err) {
    console.error('[Orders Route] Return error:', err.message);
    return res.status(500).json({ error: 'Failed to process return request: ' + err.message });
  }
});

module.exports = router;
