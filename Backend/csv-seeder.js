const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const sequelize = require('./config/database');
const Product = require('./models/Product');

// Official Brand Mapping Categories based on brand directory & user requests
const OFFICIAL_BRANDS = {
  groceries: ['Amul', 'Mother Dairy', 'Nestlé', 'Britannia', 'Tata', 'ITC Limited', 'Hindustan Unilever Limited'],
  electronics: ['Apple', 'Nothing', 'Samsung', 'Sony', 'OnePlus', 'Xiaomi', 'Vivo'],
  gadgets: ['Philips', 'LG', 'boat', 'JBL', 'Logitech', 'NOISE', 'BOULT AUDIO'],
  clothing: ["LEVI'S", 'ZARA', 'H&M', 'TOMMY HILFIGER', 'U.S. POLO ASSN.', 'Allen Solly', 'Calvin Klein'],
  shoes: ['NIKE', 'campus', 'adidas', 'PUMA', 'Reebok', 'comet', 'New Balance'],
  beauty: ["L'ORÉAL PARIS", 'MAYBELLINE', 'NYKAA', 'mamaearth', 'Cetaphil'],
  'home-kitchen': ['Prestige', 'Hawkins', 'Pigeon', 'MILTON', 'BOROSIL', 'BAJAJ'],
  sports: ['DECATHLON', 'YONEX', 'COSCO', 'NIVIA', 'speedo', 'SPALDING']
};

// Category mapping helper keywords
const CATEGORY_KEYWORDS = {
  electronics: ['phone', 'laptop', 'television', 'watch', 'camera', 'earbuds', 'headphone', 'printer', 'screen', 'keyboard', 'computer', 'cable', 'electronics', 'tech', 'digital', 'charger'],
  clothing: ['shoe', 'shirt', 't-shirt', 'pants', 'tunic', 'dress', 'clothing', 'apparel', 'vest', 'jacket', 'coat', 'jeans', 'wallet', 'purse', 'bag', 'wear', 'bra', 'panty', 'undergarment', 'biker', 'boxer'],
  'home-kitchen': ['organizer', 'mug', 'cup', 'cushion', 'chair', 'desk', 'home', 'kitchen', 'furniture', 'decor', 'curtain', 'bed', 'sheet', 'pillow', 'cook', 'oven', 'pan', 'glass', 'cabinet', 'dohar', 'quilt', 'comforter', 'duvet'],
  beauty: ['serum', 'wash', 'face', 'skin', 'beauty', 'makeup', 'cream', 'lotion', 'lipstick', 'eye', 'hair', 'shampoo', 'perfume', 'fragrance'],
  sports: ['yoga', 'dumbbell', 'backpack', 'sports', 'fitness', 'exercise', 'mat', 'gym', 'hiking', 'camping', 'outdoor', 'run', 'athletic', 'ball'],
  groceries: ['honey', 'cashew', 'nut', 'food', 'groceries', 'snack', 'drink', 'tea', 'coffee', 'fruit', 'vegetable', 'spice', 'organic', 'milk', 'butter', 'chocolate']
};

const CATEGORIES_LIST = Object.keys(CATEGORY_KEYWORDS);

// Unsplash category-specific high-resolution image placeholders (with specific high-end CK apparel support)
const FALLBACK_IMAGES = {
  electronics: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  clothing: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
  'home-kitchen': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
  beauty: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
  sports: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop&q=80',
  groceries: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80'
};

// Dynamic helper to resolve values from rows with alternative column headers
function getValueByKeys(row, keys) {
  for (const k of keys) {
    if (k in row) return row[k];
    const match = Object.keys(row).find(rk => rk.toLowerCase().trim() === k.toLowerCase().trim());
    if (match) return row[match];
  }
  return '';
}

function parsePriceValue(priceStr) {
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^\d.-]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

function parseRatingValue(ratingStr) {
  if (!ratingStr) return (4.2 + Math.random() * 0.7);
  const val = parseFloat(ratingStr);
  return isNaN(val) || val <= 0 ? (4.2 + Math.random() * 0.7) : val;
}

function parseReviewsValue(reviewsStr) {
  if (!reviewsStr) return Math.floor(50 + Math.random() * 400);
  const val = parseInt(reviewsStr, 10);
  return isNaN(val) || val <= 0 ? Math.floor(50 + Math.random() * 400) : val;
}

function detectSeparator(filePath) {
  try {
    const chunk = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }).slice(0, 1000);
    if (chunk.includes('|')) return '|';
  } catch (e) {
    console.error(`[CSV Seeder] Error detecting separator for ${filePath}:`, e.message);
  }
  return ',';
}

function determineCategory(row, fileName) {
  const textToCheck = [
    getValueByKeys(row, ['title', 'product_name', 'productname', 'product_title', 'name', 'Product Name']),
    getValueByKeys(row, ['description', 'product_description', 'productdescription', 'Product Description', 'features', 'desc']),
    getValueByKeys(row, ['categories', 'category_url', 'category_tree', 'breadcrumbs', 'breadcrumb', 'root_category', 'category'])
  ].join(' ').toLowerCase();

  for (const cat of CATEGORIES_LIST) {
    for (const keyword of CATEGORY_KEYWORDS[cat]) {
      if (textToCheck.includes(keyword)) {
        return cat;
      }
    }
  }

  return 'clothing';
}

// Ensure proper brand match from official brand list
function resolveBrand(row, category, fileName) {
  let brand = String(getValueByKeys(row, ['brand', 'manufacturer'])).trim();
  const textBlob = [
    getValueByKeys(row, ['title', 'product_name', 'name']),
    getValueByKeys(row, ['description', 'features'])
  ].join(' ').toLowerCase();

  // Check if any official brand is explicitly mentioned in text
  for (const catKey of Object.keys(OFFICIAL_BRANDS)) {
    for (const officialBrand of OFFICIAL_BRANDS[catKey]) {
      if (textBlob.includes(officialBrand.toLowerCase()) || brand.toLowerCase() === officialBrand.toLowerCase()) {
        return officialBrand;
      }
    }
  }

  // Fallback defaults per category if no explicit brand found
  const catBrands = OFFICIAL_BRANDS[category] || OFFICIAL_BRANDS['clothing'];
  return catBrands[Math.floor(Math.random() * catBrands.length)];
}

function extractImageUrl(row, category, brand) {
  let imgStr = getValueByKeys(row, ['main_image', 'image_url', 'imageurl', 'image', 'image_urls', 'searchImage', 'searchimage', 'Image link']);
  
  // Custom curated high-end images for Calvin Klein undergarments / apparel styling
  if (brand === 'Calvin Klein') {
    return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80';
  }

  if (!imgStr) return FALLBACK_IMAGES[category] || FALLBACK_IMAGES['clothing'];

  if (String(imgStr).startsWith('[') || String(imgStr).startsWith('{')) {
    try {
      const parsed = JSON.parse(imgStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imgStr = parsed[0];
      } else if (typeof parsed === 'object' && parsed !== null) {
        imgStr = Object.values(parsed)[0];
      }
    } catch (e) {
      const matches = String(imgStr).match(/https?:\/\/[^\s"',\]\}]+/g);
      if (matches && matches.length > 0) {
        imgStr = matches[0];
      }
    }
  }

  imgStr = String(imgStr).trim().replace(/^["']|["']$/g, '');
  if (!imgStr || !imgStr.startsWith('http') || imgStr.length > 490) {
    return FALLBACK_IMAGES[category] || FALLBACK_IMAGES['clothing'];
  }

  return imgStr;
}

function processCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(filePath).toLowerCase();
    const separator = detectSeparator(filePath);
    const rowsBatch = [];
    let successfullySeeded = 0;

    console.log(`[CSV Seeder] Opening stream for ${fileName}...`);

    fs.createReadStream(filePath)
      .pipe(csvParser({ separator }))
      .on('data', (row) => {
        const title = getValueByKeys(row, ['title', 'product_name', 'productname', 'product_title', 'name', 'Product Name']).trim();
        if (!title || title.toLowerCase() === 'title' || title.toLowerCase() === 'product_name') return;

        const category = determineCategory(row, fileName);
        let brand = resolveBrand(row, category, fileName);

        let description = getValueByKeys(row, ['description', 'product_description', 'productdescription', 'Product Description', 'features', 'desc']);
        description = String(description).trim().replace(/^["']|["']$/g, '');
        if (!description || description.toLowerCase() === 'null') {
          description = `${title} by ${brand}. Premium designer collection built for ultimate comfort, durability, and style.`;
        }

        // Special override description & items for Calvin Klein luxury undergarments
        if (brand === 'Calvin Klein') {
          description = `Authentic Calvin Klein luxury designer innerwear / apparel. Features iconic logo waistband, ultra-soft stretch cotton fabric, breathable fit. Inspired by global fashion icons.`;
        }

        let price = Math.round(parsePriceValue(getValueByKeys(row, ['final_price', 'price', 'finalprice', 'Price', 'value'])) * 83.0);
        if (price <= 0) price = brand === 'Calvin Klein' ? Math.floor(1499 + Math.random() * 2500) : Math.floor(499 + Math.random() * 4000);

        let originalPrice = Math.round(price * (1.2 + Math.random() * 0.3));
        const discountPct = Math.round(((originalPrice - price) / originalPrice) * 100);
        const discount = discountPct > 0 ? `${discountPct}% OFF` : '15% OFF';

        const imageUrl = extractImageUrl(row, category, brand);
        const rating = parseFloat(parseRatingValue(getValueByKeys(row, ['rating', 'rating_stars'])).toFixed(1));
        const reviews = parseReviewsValue(getValueByKeys(row, ['reviews', 'reviews_count', 'review_count']));

        rowsBatch.push({
          category: category.slice(0, 250),
          brand: brand.slice(0, 250),
          title: title.slice(0, 250),
          price,
          originalPrice,
          discount: discount.slice(0, 250),
          rating,
          reviews,
          sales: `${Math.floor(100 + Math.random() * 900)}+ sold`,
          badge: rating > 4.6 ? 'Best Seller' : 'Trending',
          imageUrl: imageUrl.slice(0, 490),
          description,
          gstRate: 18.0
        });
      })
      .on('end', async () => {
        try {
          const batchSize = 100;
          for (let i = 0; i < rowsBatch.length; i += batchSize) {
            const chunk = rowsBatch.slice(i, i + batchSize);
            await Product.bulkCreate(chunk);
            successfullySeeded += chunk.length;
          }
          console.log(`[CSV Seeder] Successfully populated ${successfullySeeded} products from ${fileName}.`);
          resolve(successfullySeeded);
        } catch (dbErr) {
          console.error(`[CSV Seeder] Database insertion failed for ${fileName}:`, dbErr.message);
          reject(dbErr);
        }
      })
      .on('error', (err) => reject(err));
  });
}

// Explicit manual injector for guaranteed Calvin Klein & multi-brand high-end catalog items
async function injectGuaranteedBrands() {
  const guaranteedProducts = [
    {
      category: 'clothing',
      brand: 'Calvin Klein',
      title: 'Calvin Klein Modern Cotton Logo Bralette & Bikini Set',
      price: 2499,
      originalPrice: 3999,
      discount: '37% OFF',
      rating: 4.9,
      reviews: 420,
      sales: '1.2k+ sold',
      badge: 'Best Seller',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      description: 'Iconic Calvin Klein athletic underwear set. Ultra-soft cotton modal stretch blend with signature logo elastic band. Ultimate daily comfort and sleek aesthetic.',
      gstRate: 18.0
    },
    {
      category: 'clothing',
      brand: 'Calvin Klein',
      title: 'Calvin Klein Men 3-Pack Cotton Stretch Boxer Briefs',
      price: 1999,
      originalPrice: 2999,
      discount: '33% OFF',
      rating: 4.8,
      reviews: 610,
      sales: '2.5k+ sold',
      badge: 'Top Rated',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      description: 'Premium Calvin Klein men underwear engineered with breathable stretch cotton and contoured pouch for maximum support and all-day ease.',
      gstRate: 18.0
    },
    {
      category: 'clothing',
      brand: 'Calvin Klein',
      title: 'Calvin Klein Women Seamless Triangle Bra & Panty Lounge Set',
      price: 2799,
      originalPrice: 4299,
      discount: '35% OFF',
      rating: 4.9,
      reviews: 380,
      sales: '950+ sold',
      badge: 'Trending',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      description: 'Luxurious seamless comfort set by Calvin Klein. Designed for everyday effortless style with lightweight support and premium finish.',
      gstRate: 18.0
    },
    {
      category: 'electronics',
      brand: 'Apple',
      title: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
      price: 139900,
      originalPrice: 159900,
      discount: '12% OFF',
      rating: 4.9,
      reviews: 1450,
      sales: '3.4k+ sold',
      badge: 'Best Seller',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      description: 'Forged in titanium with the breakthrough A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.',
      gstRate: 18.0
    },
    {
      category: 'groceries',
      brand: 'Amul',
      title: 'Amul Pure 100% Butter Rich & Creamy (500g Pack)',
      price: 275,
      originalPrice: 290,
      discount: '5% OFF',
      rating: 4.8,
      reviews: 2300,
      sales: '15k+ sold',
      badge: 'Top Rated',
      imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
      description: 'The Taste of India! Made from pure fresh milk fat, Amul Butter is delicious and creamy.',
      gstRate: 5.0
    },
    {
      category: 'shoes',
      brand: 'NIKE',
      title: 'Nike Air Max Running & Sports Athletic Shoes for Men',
      price: 7995,
      originalPrice: 11995,
      discount: '33% OFF',
      rating: 4.7,
      reviews: 890,
      sales: '4.1k+ sold',
      badge: 'Best Seller',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      description: 'Max Air cushioning provides the support you need for miles of comfort. Lightweight mesh upper keeps your feet cool.',
      gstRate: 18.0
    }
  ];

  await Product.bulkCreate(guaranteedProducts);
  console.log('[CSV Seeder] Injected guaranteed brand items (including Calvin Klein undergarments & Apple/Nike) successfully!');
}

async function seedAllCSVs() {
  try {
    console.log('[CSV Seeder] Connecting to Supabase PostgreSQL...');
    await sequelize.authenticate();
    await Product.sync({ alter: true });
    
    console.log('[CSV Seeder] Cleaning existing products table...');
    await Product.destroy({ truncate: true, cascade: true });
    
    // First inject guaranteed brand collection (CK, Apple, Amul, Nike, etc.)
    await injectGuaranteedBrands();

    const backendDir = __dirname;
    const files = fs.readdirSync(backendDir);
    const csvFiles = files.filter(f => f.endsWith('.csv'));

    let grandTotalProducts = 6; // starting with our 6 guaranteed flagship items

    for (const csvFile of csvFiles) {
      const fullPath = path.join(backendDir, csvFile);
      try {
        const count = await processCSVFile(fullPath);
        grandTotalProducts += count;
      } catch (fileErr) {
        console.error(`[CSV Seeder] Skipping file ${csvFile} due to error.`);
      }
    }

    console.log('\n===============================================================');
    console.log(`[CSV Seeder] DATABASE SEEDING COMPLETED SUCCESSFULLY!`);
    console.log(`[CSV Seeder] Total products mapped across brand directories: ${grandTotalProducts}`);
    console.log('===============================================================\n');
    process.exit(0);

  } catch (err) {
    console.error('[CSV Seeder] Fatal error during execution:', err.message);
    process.exit(1);
  }
}

seedAllCSVs();