const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TFkHWivdCZCZeK',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'm2cTmfkpWRIXmSfVOWtGOjTs'
});

const JWT_SECRET  = process.env.JWT_SECRET  || 'ebazaar_super_secret_jwt_key_2025';
const JWT_EXPIRES = process.env.JWT_EXPIRES  || '7d';
const SALT_ROUNDS = 12;

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    profilePic: user.profilePic || null,
    walletBalance: typeof user.walletBalance === 'number' ? user.walletBalance : 150.00,
    withdrawableBalance: typeof user.withdrawableBalance === 'number' ? user.withdrawableBalance : 0.00
  };
}

/* ── POST /api/auth/register ─────────────────────────────────────────────── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check for duplicate email
    const existing = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password: hashedPassword,
      phone:    phone || null,
      walletBalance: 150.00
    });

    const token = signToken(user);

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: safeUser(user),
    });
  } catch (err) {
    console.error('[Auth] Register error:', err.message);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

/* ── POST /api/auth/login ────────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: safeUser(user),
    });
  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

/* ── GET /api/auth/me — verify token & return profile ───────────────────── */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: safeUser(user) });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

/* ── PUT /api/auth/profile — Update user profile details ─────────────────── */
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const { name, phone, profilePic } = req.body;
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (profilePic !== undefined) user.profilePic = profilePic;

    await user.save();

    return res.json({
      message: 'Profile updated successfully',
      user: safeUser(user)
    });
  } catch (err) {
    console.error('[Auth] Profile update error:', err.message);
    return res.status(500).json({ error: 'Failed to update profile: ' + err.message });
  }
});

/* ── POST /api/auth/wallet/add — Add money to user wallet ───────────────── */
router.post('/wallet/add', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Please enter a valid amount.' });
    }

    user.walletBalance = (user.walletBalance || 0) + amount;
    await user.save();

    return res.json({
      message: `Successfully added ₹${amount.toLocaleString('en-IN')} to your wallet!`,
      walletBalance: user.walletBalance,
      user: safeUser(user)
    });
  } catch (err) {
    console.error('[Auth] Wallet add error:', err.message);
    return res.status(500).json({ error: 'Failed to add funds to wallet: ' + err.message });
  }
});
/* ── POST /api/auth/wallet/order — Create Razorpay Order for Top-up ──────── */
router.post('/wallet/order', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Please enter a valid amount.' });
    }

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `wallet_topup_${Date.now()}`
    });

    return res.status(201).json({
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TFkHWivdCZCZeK'
    });
  } catch (err) {
    console.error('[Auth] Wallet order error:', err);
    return res.status(500).json({ error: 'Failed to create Razorpay order for wallet.' });
  }
});

/* ── POST /api/auth/wallet/verify — Verify Top-up Payment ────────────────── */
router.post('/wallet/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({ error: 'Missing required Razorpay parameters.' });
    }

    let isSignatureValid = false;
    if (razorpay_signature) {
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'm2cTmfkpWRIXmSfVOWtGOjTs');
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generated_signature = hmac.digest('hex');
      isSignatureValid = (generated_signature === razorpay_signature);
    } else {
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      return res.status(400).json({ error: 'Razorpay signature verification failed.' });
    }

    const addedAmount = parseFloat(amount);
    if (isNaN(addedAmount) || addedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount verified.' });
    }

    user.walletBalance = (user.walletBalance || 0) + addedAmount;
    user.withdrawableBalance = (user.withdrawableBalance || 0) + addedAmount;
    await user.save();

    return res.json({
      message: `Successfully added ₹${addedAmount.toLocaleString('en-IN')} to your wallet!`,
      walletBalance: user.walletBalance,
      withdrawableBalance: user.withdrawableBalance,
      user: safeUser(user)
    });
  } catch (err) {
    console.error('[Auth] Wallet verify error:', err);
    return res.status(500).json({ error: 'Failed to verify payment.' });
  }
});

/* ── POST /api/auth/wallet/withdraw — Withdraw Funds ─────────────────────── */
router.post('/wallet/withdraw', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Please enter a valid amount.' });
    }

    if (amount > (user.withdrawableBalance || 0)) {
      return res.status(400).json({ error: 'Insufficient withdrawable balance. Promotional coins cannot be withdrawn.' });
    }

    user.walletBalance = (user.walletBalance || 0) - amount;
    user.withdrawableBalance = (user.withdrawableBalance || 0) - amount;
    await user.save();

    return res.json({
      message: `Successfully requested withdrawal of ₹${amount.toLocaleString('en-IN')}. Funds will be transferred to your bank soon.`,
      walletBalance: user.walletBalance,
      withdrawableBalance: user.withdrawableBalance,
      user: safeUser(user)
    });
  } catch (err) {
    console.error('[Auth] Wallet withdraw error:', err);
    return res.status(500).json({ error: 'Failed to process withdrawal.' });
  }
});

module.exports = router;
