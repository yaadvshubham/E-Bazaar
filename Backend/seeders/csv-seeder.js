const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const sequelize = require('../config/database');
const Product = require('../models/Product');

// Official Brand Mapping Categories based on brand directory & user requests
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

const BRAND_ALIASES = {
  "levi's": { brand: "LEVI'S", category: "clothing" },
  "levis": { brand: "LEVI'S", category: "clothing" },
  "zara": { brand: "ZARA", category: "clothing" },
  "h&m": { brand: "H&M", category: "clothing" },
  "hm": { brand: "H&M", category: "clothing" },
  "tommy hilfiger": { brand: "TOMMY HILFIGER", category: "clothing" },
  "tommy": { brand: "TOMMY HILFIGER", category: "clothing" },
  "u.s. polo assn.": { brand: "U.S. POLO ASSN.", category: "clothing" },
  "us polo": { brand: "U.S. POLO ASSN.", category: "clothing" },
  "polo": { brand: "U.S. POLO ASSN.", category: "clothing" },
  "allen solly": { brand: "Allen Solly", category: "clothing" },
  "calvin klein": { brand: "Calvin Klein", category: "clothing" },
  "ck": { brand: "Calvin Klein", category: "clothing" },
  
  "nike": { brand: "NIKE", category: "shoes" },
  "adidas": { brand: "adidas", category: "shoes" },
  "puma": { brand: "PUMA", category: "shoes" },
  "reebok": { brand: "Reebok", category: "shoes" },
  "comet": { brand: "comet", category: "shoes" },
  "new balance": { brand: "New Balance", category: "shoes" },
  "nb": { brand: "New Balance", category: "shoes" },
  "campus": { brand: "campus", category: "shoes" },
  
  "l'oréal paris": { brand: "L'ORÉAL PARIS", category: "beauty" },
  "l'origal paris": { brand: "L'ORÉAL PARIS", category: "beauty" },
  "l'oreal paris": { brand: "L'ORÉAL PARIS", category: "beauty" },
  "loreal": { brand: "L'ORÉAL PARIS", category: "beauty" },
  "maybelline": { brand: "MAYBELLINE", category: "beauty" },
  "nykaa": { brand: "NYKAA", category: "beauty" },
  "mamaearth": { brand: "mamaearth", category: "beauty" },
  "cetaphil": { brand: "Cetaphil", category: "beauty" },
  
  "amul": { brand: "Amul", category: "groceries" },
  "mother dairy": { brand: "Mother Dairy", category: "groceries" },
  "nestlé": { brand: "Nestlé", category: "groceries" },
  "nestle": { brand: "Nestlé", category: "groceries" },
  "britannia": { brand: "Britannia", category: "groceries" },
  "tata": { brand: "Tata", category: "groceries" },
  "itc limited": { brand: "ITC Limited", category: "groceries" },
  "itc": { brand: "ITC Limited", category: "groceries" },
  "hindustan unilever limited": { brand: "Hindustan Unilever Limited", category: "groceries" },
  "hul": { brand: "Hindustan Unilever Limited", category: "groceries" },
  
  "philips": { brand: "Philips", category: "gadgets" },
  "lg": { brand: "LG", category: "gadgets" },
  "boat": { brand: "boat", category: "gadgets" },
  "jbl": { brand: "JBL", category: "gadgets" },
  "logitech": { brand: "Logitech", category: "gadgets" },
  "noise": { brand: "NOISE", category: "gadgets" },
  "boult audio": { brand: "BOULT AUDIO", category: "gadgets" },
  "boult": { brand: "BOULT AUDIO", category: "gadgets" },
  
  "decathlon": { brand: "DECATHLON", category: "sports" },
  "yonex": { brand: "YONEX", category: "sports" },
  "cosco": { brand: "COSCO", category: "sports" },
  "nivia": { brand: "NIVIA", category: "sports" },
  "speedo": { brand: "speedo", category: "sports" },
  "spalding": { brand: "SPALDING", category: "sports" },
  
  "prestige": { brand: "Prestige", category: "home-kitchen" },
  "hawkins": { brand: "Hawkins", category: "home-kitchen" },
  "pigeon": { brand: "Pigeon", category: "home-kitchen" },
  "milton": { brand: "MILTON", category: "home-kitchen" },
  "borosil": { brand: "BOROSIL", category: "home-kitchen" },
  "bajaj": { brand: "BAJAJ", category: "home-kitchen" },
  
  "apple": { brand: "Apple", category: "electronics" },
  "nothing": { brand: "Nothing", category: "electronics" },
  "samsung": { brand: "Samsung", category: "electronics" },
  "sony": { brand: "Sony", category: "electronics" },
  "oneplus": { brand: "OnePlus", category: "electronics" },
  "xiaomi": { brand: "Xiaomi", category: "electronics" },
  "vivo": { brand: "Vivo", category: "electronics" }
};

// Category mapping helper keywords (with 8 distinct categories)
const CATEGORY_KEYWORDS = {
  groceries: ['honey', 'cashew', 'nut', 'food', 'groceries', 'snack', 'drink', 'tea', 'coffee', 'fruit', 'vegetable', 'spice', 'organic', 'milk', 'butter', 'chocolate', 'oil', 'biscuit', 'cookie', 'atta', 'salt', 'dal', 'paneer', 'ghee'],
  electronics: ['phone', 'laptop', 'television', 'tv', 'camera', 'printer', 'screen', 'computer', 'cable', 'electronics', 'tech', 'digital', 'charger', 'tablet'],
  gadgets: ['earbuds', 'headphone', 'speaker', 'smartwatch', 'keyboard', 'mouse', 'webcam', 'headset', 'audio', 'soundbar', 'trimmer', 'shaver', 'tooth-brush', 'led bulb'],
  clothing: ['shirt', 't-shirt', 'pants', 'tunic', 'dress', 'clothing', 'apparel', 'vest', 'jacket', 'coat', 'jeans', 'wallet', 'purse', 'bag', 'bra', 'panty', 'undergarment', 'biker', 'boxer', 'suit', 'saree', 'trousers', 'blazer'],
  shoes: ['shoe', 'sneaker', 'boot', 'sandal', 'slipper', 'footwear', 'heel', 'flat', 'clog'],
  beauty: ['serum', 'wash', 'face', 'skin', 'beauty', 'makeup', 'cream', 'lotion', 'lipstick', 'eye', 'hair', 'shampoo', 'perfume', 'fragrance', 'cosmetic', 'lipstick', 'soap'],
  'home-kitchen': ['organizer', 'mug', 'cup', 'cushion', 'chair', 'desk', 'home', 'kitchen', 'furniture', 'decor', 'curtain', 'bed', 'sheet', 'pillow', 'cook', 'oven', 'pan', 'glass', 'cabinet', 'dohar', 'quilt', 'comforter', 'duvet', 'planter', 'vase', 'kettle', 'bottle', 'flask', 'cooker', 'plate', 'bowl', 'towel'],
  sports: ['yoga', 'dumbbell', 'backpack', 'sports', 'fitness', 'exercise', 'mat', 'gym', 'hiking', 'camping', 'outdoor', 'run', 'athletic', 'ball', 'badminton', 'racket', 'shuttlecock', 'swimsuit', 'goggles']
};

const CATEGORIES_LIST = Object.keys(CATEGORY_KEYWORDS);

// Unsplash category-specific high-resolution image placeholders (with specific high-end CK apparel support)
// Unsplash category-specific high-resolution image placeholders
const FALLBACK_IMAGES = {
  electronics: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496181130204-755241544e3f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527690710607-e57cd53b3789?w=600&auto=format&fit=crop&q=80'
  ],
  gadgets: [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&auto=format&fit=crop&q=80'
  ],
  clothing: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80'
  ],
  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99dd8ec7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80'
  ],
  'home-kitchen': [
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
  ],
  beauty: [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&auto=format&fit=crop&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80'
  ],
  groceries: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80'
  ]
};

function getFallbackImage(category) {
  const images = FALLBACK_IMAGES[category] || FALLBACK_IMAGES['clothing'];
  return images[Math.floor(Math.random() * images.length)];
}

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

// Whole-word category and brand matching logic using regex to prevent partial word overrides
function matchesKeyword(text, keyword) {
  const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  // Match word boundaries, allow standard plurals and tenses (e.g. phones, cooked, shirts)
  const regex = new RegExp(`\\b${escaped}(s|es|ed|ing|y)?\\b`, 'i');
  return regex.test(text);
}

function matchesBrandAlias(text, aliasKey) {
  const escaped = aliasKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  if (aliasKey.length <= 3) {
    // Strict boundary for short keys like ck, hm, lg, nb, etc.
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(text);
  }
  // Standard boundary for longer ones
  const regex = new RegExp(`\\b${escaped}(s|es|ed|ing)?\\b`, 'i');
  return regex.test(text);
}

function determineCategory(row, fileName) {
  // 1. Check categories/breadcrumbs column first (most specific)
  const categoryField = String(getValueByKeys(row, ['categories', 'category_url', 'category_tree', 'breadcrumbs', 'breadcrumb', 'root_category', 'category'])).toLowerCase();
  if (categoryField) {
    for (const cat of CATEGORIES_LIST) {
      for (const keyword of CATEGORY_KEYWORDS[cat]) {
        if (matchesKeyword(categoryField, keyword)) {
          return cat;
        }
      }
    }
  }

  // 2. Next check the title column
  const titleField = String(getValueByKeys(row, ['title', 'product_name', 'productname', 'product_title', 'name', 'Product Name'])).toLowerCase();
  if (titleField) {
    for (const cat of CATEGORIES_LIST) {
      for (const keyword of CATEGORY_KEYWORDS[cat]) {
        if (matchesKeyword(titleField, keyword)) {
          return cat;
        }
      }
    }
  }

  // 3. Finally check description
  const descField = String(getValueByKeys(row, ['description', 'product_description', 'productdescription', 'Product Description', 'features', 'desc'])).toLowerCase();
  if (descField) {
    for (const cat of CATEGORIES_LIST) {
      for (const keyword of CATEGORY_KEYWORDS[cat]) {
        if (matchesKeyword(descField, keyword)) {
          return cat;
        }
      }
    }
  }

  // File fallback defaults
  if (fileName.includes('mens') || fileName.includes('shein') || fileName.includes('clothing')) return 'clothing';
  if (fileName.includes('shoe')) return 'shoes';
  if (fileName.includes('electronic') || fileName.includes('walmart')) return 'electronics';

  return 'clothing';
}


// Strict Brand and Category Matching to avoid domain crossovers
function resolveBrandAndCategory(row, fileName) {
  let explicitBrand = String(getValueByKeys(row, ['brand', 'manufacturer'])).trim().toLowerCase();

  // 1. If explicit brand matches an official brand alias, force the correct category and brand name
  if (explicitBrand && BRAND_ALIASES[explicitBrand]) {
    const matched = BRAND_ALIASES[explicitBrand];
    return {
      brand: matched.brand,
      category: matched.category
    };
  }

  // 2. Otherwise determine category based on text keywords/file name
  const category = determineCategory(row, fileName);

  // 3. Search title and description text blob for official brands belonging ONLY to this category
  const title = getValueByKeys(row, ['title', 'product_name', 'name']);
  const desc = getValueByKeys(row, ['description', 'features']);
  const cleanTitleDesc = [title, desc].join(' ').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  for (const aliasKey of Object.keys(BRAND_ALIASES)) {
    if (matchesBrandAlias(cleanTitleDesc, aliasKey)) {
      const matched = BRAND_ALIASES[aliasKey];
      if (matched.category === category) {
        return {
          brand: matched.brand,
          category: category
        };
      }
    }
  }

  // 4. If no brand matches, pick a random brand strictly from this category's list
  const allowedBrands = OFFICIAL_BRANDS[category] || OFFICIAL_BRANDS['clothing'];
  const fallbackBrand = allowedBrands[Math.floor(Math.random() * allowedBrands.length)];
  return {
    brand: fallbackBrand,
    category: category
  };
}

function extractImageUrl(row, category, brand) {
  let imgStr = getValueByKeys(row, ['main_image', 'image_url', 'imageurl', 'image', 'image_urls', 'searchImage', 'searchimage', 'Image link']);
  
  if (!imgStr) return getFallbackImage(category);

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
    return getFallbackImage(category);
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

        // Strict mapping resolution
        const { brand, category } = resolveBrandAndCategory(row, fileName);

        let description = getValueByKeys(row, ['description', 'product_description', 'productdescription', 'Product Description', 'features', 'desc']);
        description = String(description).trim().replace(/^["']|["']$/g, '');
        if (!description || description.toLowerCase() === 'null') {
          description = `${title} by ${brand}. Premium designer collection built for ultimate comfort, durability, and style.`;
        }

        if (brand === 'Calvin Klein') {
          description = `Authentic Calvin Klein luxury designer innerwear / apparel. Features iconic logo waistband, ultra-soft stretch cotton fabric, breathable fit. Inspired by global fashion icons.`;
        }

        // Support native price_inr if present in CSV, otherwise convert standard price
        let price = parsePriceValue(getValueByKeys(row, ['price_inr']));
        if (price > 0) {
          price = Math.round(price);
        } else {
          price = Math.round(parsePriceValue(getValueByKeys(row, ['final_price', 'price', 'finalprice', 'Price', 'value'])) * 83.0);
        }

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