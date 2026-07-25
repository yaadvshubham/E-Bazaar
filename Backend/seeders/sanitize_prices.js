require('dotenv').config();
const sequelize = require('../config/database');
const Product = require('../models/Product');

const MAX_CATEGORY_LIMITS = {
  groceries: 2499,
  beauty: 4999,
  clothing: 9999,
  shoes: 24999,
  sports: 19999,
  'home-kitchen': 34999,
  gadgets: 39999,
  electronics: 179999
};

const DEFAULT_CATEGORY_LIMITS = {
  groceries: { min: 99, max: 1499 },
  beauty: { min: 199, max: 2999 },
  clothing: { min: 399, max: 4999 },
  shoes: { min: 699, max: 11999 },
  sports: { min: 499, max: 8999 },
  'home-kitchen': { min: 599, max: 14999 },
  gadgets: { min: 799, max: 24999 },
  electronics: { min: 9999, max: 99999 }
};

function getSpecificProductPrice(title, brand) {
  const t = (title || '').toLowerCase();
  
  if (t.includes('iphone 15 pro max') || t.includes('iphone 16 pro')) return 139900;
  if (t.includes('iphone 15 pro') || t.includes('iphone 14 pro')) return 119900;
  if (t.includes('iphone 15') || t.includes('iphone 14') || t.includes('iphone 13')) return 64900;
  if (t.includes('macbook air m1') || t.includes('macbook air m2')) return 74900;
  if (t.includes('macbook pro')) return 149900;
  if (t.includes('oled 4k 83') || t.includes('oled 83') || t.includes('tivi 83')) return 179900;
  if (t.includes('spectre x360') || t.includes('envy x360') || t.includes('victus')) return 64900;
  if (t.includes('ps5') || t.includes('playstation 5') || t.includes('xbox series x')) return 49990;

  return null;
}

async function sanitizeAllPrices() {
  try {
    await sequelize.authenticate();
    console.log('[Sanitizer] Connected to database. Fetching all products...');

    const products = await Product.findAll();
    console.log(`[Sanitizer] Found ${products.length} products. Calculating clean price updates...`);

    const updates = [];

    for (const product of products) {
      let currentPrice = product.price;
      const category = (product.category || 'clothing').toLowerCase();
      const title = product.title || '';
      const brand = product.brand || '';
      const maxAllowed = MAX_CATEGORY_LIMITS[category] || 25000;

      let newPrice = currentPrice;
      let isModified = false;

      const specificPrice = getSpecificProductPrice(title, brand);
      if (specificPrice !== null && (currentPrice > 200000 || currentPrice !== specificPrice)) {
        newPrice = specificPrice;
        isModified = true;
      } else if (currentPrice > maxAllowed) {
        const unmultiplied = Math.round(currentPrice / 83.0);
        if (unmultiplied <= maxAllowed && unmultiplied >= 49) {
          newPrice = unmultiplied;
          isModified = true;
        } else {
          let scaled = Math.round(currentPrice / 10000);
          if (scaled > maxAllowed) scaled = Math.round(currentPrice / 100000);

          if (scaled >= 99 && scaled <= maxAllowed) {
            newPrice = scaled;
            isModified = true;
          } else {
            const bounds = DEFAULT_CATEGORY_LIMITS[category] || DEFAULT_CATEGORY_LIMITS['clothing'];
            newPrice = Math.floor(bounds.min + Math.random() * (bounds.max - bounds.min));
            isModified = true;
          }
        }
      } else if (currentPrice < 29) {
        const bounds = DEFAULT_CATEGORY_LIMITS[category] || DEFAULT_CATEGORY_LIMITS['clothing'];
        newPrice = Math.floor(bounds.min + Math.random() * (bounds.max - bounds.min));
        isModified = true;
      }

      if (isModified || !product.originalPrice || product.originalPrice <= newPrice) {
        const markup = 1.18 + Math.random() * 0.22;
        const newOrigPrice = Math.round(newPrice * markup);
        const discountPct = Math.round(((newOrigPrice - newPrice) / newOrigPrice) * 100);
        const newDiscount = `${discountPct}% OFF`;

        updates.push({
          id: product.id,
          price: newPrice,
          originalPrice: newOrigPrice,
          discount: newDiscount
        });
      }
    }

    console.log(`[Sanitizer] Bulk updating ${updates.length} products...`);

    const chunkSize = 200;
    for (let i = 0; i < updates.length; i += chunkSize) {
      const chunk = updates.slice(i, i + chunkSize);
      await Promise.all(chunk.map(u => 
        Product.update(
          { price: u.price, originalPrice: u.originalPrice, discount: u.discount },
          { where: { id: u.id } }
        )
      ));
      console.log(`[Sanitizer] Updated ${Math.min(i + chunkSize, updates.length)} / ${updates.length}...`);
    }

    console.log(`[Sanitizer] Done! All product prices are clean and realistic.`);
    process.exit(0);
  } catch (err) {
    console.error('[Sanitizer] Error:', err.message);
    process.exit(1);
  }
}

sanitizeAllPrices();
