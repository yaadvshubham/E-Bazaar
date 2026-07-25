require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

// Run Cache Buster on Server Startup
try {
  const cacheBustHtmlFiles = require('./utils/cacheBuster');
  cacheBustHtmlFiles();
} catch (e) {
  console.error('[CacheBuster] Failed to run on server boot:', e.message);
}

// Cache-control middleware to prevent HTML shell caching on browsers/mobile
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path === '/' || !path.extname(req.path)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

app.use(express.static(frontendDir));
app.use(express.static(__dirname));

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

// Root route - serve index.html or auth.html
app.get('/', (req, res) => {
  const indexPath = path.join(frontendDir, 'index.html');
  const authPath = path.join(frontendDir, 'auth.html');
  const localIndexPath = path.join(__dirname, 'index.html');
  const localAuthPath = path.join(__dirname, 'auth.html');

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  } else if (fs.existsSync(authPath)) {
    return res.sendFile(authPath);
  } else if (fs.existsSync(localIndexPath)) {
    return res.sendFile(localIndexPath);
  } else if (fs.existsSync(localAuthPath)) {
    return res.sendFile(localAuthPath);
  } else {
    return res.status(200).send('<h1>E-Bazaar API is running</h1>');
  }
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

// Non-API HTML fallback route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  const requestedFile = path.join(frontendDir, req.path);
  const requestedHtml = requestedFile.endsWith('.html') ? requestedFile : `${requestedFile}.html`;

  if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    return res.sendFile(requestedFile);
  }
  if (fs.existsSync(requestedHtml) && fs.statSync(requestedHtml).isFile()) {
    return res.sendFile(requestedHtml);
  }

  const indexPath = path.join(frontendDir, 'index.html');
  const authPath = path.join(frontendDir, 'auth.html');

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  } else if (fs.existsSync(authPath)) {
    return res.sendFile(authPath);
  }
  next();
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
    process.exit(1); // Exit server cleanly on final boot check
  });
