require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import models to register them with Sequelize
require('./models/Product');
require('./models/User');
require('./models/Order');
require('./models/WalletTransaction');
require('./models/WishlistItem');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), message: 'E-Bazaar API is running' });
});

// Debug count route
app.get('/api/debug/count', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const count = await Product.count();
    res.json({ totalProducts: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dynamic portfolio stats route
app.get('/api/stats', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const User = require('./models/User');
    const Order = require('./models/Order');
    const WalletTransaction = require('./models/WalletTransaction');

    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const totalWalletTransactions = await WalletTransaction.count();

    const brandCounts = await Product.findAll({
      attributes: [
        'brand',
        [sequelize.fn('COUNT', sequelize.col('brand')), 'count']
      ],
      group: ['brand']
    });

    const brands = {};
    brandCounts.forEach(b => {
      const name = b.getDataValue('brand');
      if (name) {
        brands[name] = parseInt(b.getDataValue('count'), 10);
      }
    });

    res.json({
      success: true,
      totalProducts,
      totalUsers,
      totalOrders,
      totalWalletTransactions,
      totalModels: 7,
      brands,
      configuredModels: ['User', 'Product', 'Order', 'OrderItem', 'WishlistItem', 'WalletTransaction', 'BankAccount'],
      activeAPIs: ['Razorpay Payment Gateway', 'Supabase Client SDK', 'Amazon Real-Time Scraper API']
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ── DB Sync & Start ───────────────────────────────────────────────────────────
sequelize.authenticate()
  .then(() => {
    console.log('[DB] Supabase PostgreSQL connection established.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] E-Bazaar API running on http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('[DB] Unable to connect:', err);
    process.exit(1); // Exit server cleanly on boot failure check
  });
