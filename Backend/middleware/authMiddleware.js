const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ebazaar_super_secret_jwt_key_2025';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required. Please sign in.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found. Session invalid.' });
    }

    // Attach user instance to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('[Auth Middleware] Verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
};

module.exports = authMiddleware;
