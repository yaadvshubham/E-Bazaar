const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { Op } = require('sequelize');

// GET /api/products — list and filter products from database
router.get('/', async (req, res) => {
  try {
    const { category, cat, brand, q, isDeal, isNew } = req.query;
    const where = {};

    if (isDeal === 'true') {
      where.isDeal = true;
    }
    if (isNew === 'true') {
      where.isNew = true;
    }

    // Dynamic case-insensitive operator based on database dialect (PostgreSQL vs SQLite)
    const dialect = Product.sequelize.getDialect();
    const likeOp = dialect === 'postgres' ? Op.iLike : Op.like;

    // Type-safe category filter
    let targetCategory = category || cat;
    if (Array.isArray(targetCategory)) {
      targetCategory = targetCategory[0];
    }
    if (typeof targetCategory === 'string') {
      const cleaned = targetCategory.toLowerCase().trim();
      if (cleaned && cleaned !== 'all' && cleaned !== 'trending') {
        where.category = cleaned;
      }
    }

    // Type-safe brand filter
    let targetBrand = brand;
    if (Array.isArray(targetBrand)) {
      targetBrand = targetBrand[0];
    }
    if (typeof targetBrand === 'string') {
      const cleaned = targetBrand.trim();
      if (cleaned) {
        where.brand = cleaned;
      }
    }

    // Type-safe and dialect-aware search query
    let targetQ = q;
    if (Array.isArray(targetQ)) {
      targetQ = targetQ[0];
    }
    if (typeof targetQ === 'string') {
      const cleanQ = targetQ.trim();
      if (cleanQ) {
        where[Op.or] = [
          { title: { [likeOp]: `%${cleanQ}%` } },
          { description: { [likeOp]: `%${cleanQ}%` } },
          { brand: { [likeOp]: `%${cleanQ}%` } }
        ];
      }
    }

    const products = await Product.findAll({
      where,
      order: [['id', 'ASC']]
    });

    console.log(`[Products API] Returned ${products.length} products for filters: cat=${targetCategory || ''}, brand=${brand || ''}, q=${q || ''}`);

    res.json({
      total: products.length,
      products: products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id — single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products — create product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:id — update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:id — delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
