const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const sequelize = require('./config/database');
const Product = require('./models/Product');

// Category mapping helper keywords
const CATEGORY_KEYWORDS = {
  electronics: ['phone', 'laptop', 'television', 'watch', 'camera', 'earbuds', 'headphone', 'printer', 'screen', 'keyboard', 'computer', 'cable', 'electronics', 'tech', 'digital', 'charger'],
  clothing: ['shoe', 'shirt', 't-shirt', 'pants', 'tunic', 'dress', 'clothing', 'apparel', 'vest', 'jacket', 'coat', 'jeans', 'wallet', 'purse', 'bag', 'wear'],
  'home-kitchen': ['organizer', 'mug', 'cup', 'cushion', 'chair', 'desk', 'home', 'kitchen', 'furniture', 'decor', 'curtain', 'bed', 'sheet', 'pillow', 'cook', 'oven', 'pan', 'glass', 'cabinet', 'dohar', 'quilt', 'comforter', 'duvet'],
  beauty: ['serum', 'wash', 'face', 'skin', 'beauty', 'makeup', 'cream', 'lotion', 'lipstick', 'eye', 'hair', 'shampoo', 'perfume', 'fragrance'],
  sports: ['yoga', 'dumbbell', 'backpack', 'sports', 'fitness', 'exercise', 'mat', 'gym', 'hiking', 'camping', 'outdoor', 'run', 'athletic', 'ball'],
  groceries: ['honey', 'cashew', 'nut', 'food', 'groceries', 'snack', 'drink', 'tea', 'coffee', 'fruit', 'vegetable', 'spice', 'organic']
};

const CATEGORIES_LIST = Object.keys(CATEGORY_KEYWORDS);

// Unsplash category-specific high-resolution image placeholders
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
    // Case-insensitive search on trimmed keys
    const match = Object.keys(row).find(rk => rk.toLowerCase().trim() === k.toLowerCase().trim());
    if (match) return row[match];
  }
  return '';
}

// Function to clean and parse float numbers from price strings
function parsePriceValue(priceStr) {
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^\d.-]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

// Function to parse rating
function parseRatingValue(ratingStr) {
  if (!ratingStr) return (3.8 + Math.random() * 1.1);
  const val = parseFloat(ratingStr);
  return isNaN(val) || val <= 0 ? (3.8 + Math.random() * 1.1) : val;
}

// Function to parse reviews count
function parseReviewsValue(reviewsStr) {
  if (!reviewsStr) return Math.floor(10 + Math.random() * 200);
  const val = parseInt(reviewsStr, 10);
  return isNaN(val) || val <= 0 ? Math.floor(10 + Math.random() * 200) : val;
}

// Detect separator (delimiter) dynamically by reading first chunk of file
function detectSeparator(filePath) {
  try {
    const chunk = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }).slice(0, 1000);
    if (chunk.includes('|')) return '|';
  } catch (e) {
    console.error(`[CSV Seeder] Error detecting separator for ${filePath}:`, e.message);
  }
  return ',';
}

// Determine category based on title, description, or breadcrumbs
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

  // File name based matching fallback
  if (fileName.includes('amazon')) return 'electronics';
  if (fileName.includes('walmart')) return 'home-kitchen';
  if (fileName.includes('lazada')) return 'electronics';
  if (fileName.includes('shopee')) return 'clothing';
  if (fileName.includes('meesho') || fileName.includes('shein')) return 'clothing';

  // Fallback to rotating categories
  return CATEGORIES_LIST[Math.floor(Math.random() * CATEGORIES_LIST.length)];
}

// Clean and extract the image URL from row
function extractImageUrl(row, category) {
  let imgStr = getValueByKeys(row, ['main_image', 'image_url', 'imageurl', 'image', 'image_urls', 'searchImage', 'searchimage', 'Image link']);
  if (!imgStr) return FALLBACK_IMAGES[category];

  // If it's a JSON array format (common in Shopee, Walmart, Lazada, Shein)
  if (String(imgStr).startsWith('[') || String(imgStr).startsWith('{')) {
    try {
      const parsed = JSON.parse(imgStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imgStr = parsed[0];
      } else if (typeof parsed === 'object' && parsed !== null) {
        imgStr = Object.values(parsed)[0];
      }
    } catch (e) {
      // Not a valid JSON, try to extract using regex/string split
      const matches = String(imgStr).match(/https?:\/\/[^\s"',\]\}]+/g);
      if (matches && matches.length > 0) {
        imgStr = matches[0];
      }
    }
  }

  // Remove surrounding quotes or extra spaces
  imgStr = String(imgStr).trim().replace(/^["']|["']$/g, '');

  if (!imgStr || !imgStr.startsWith('http')) {
    return FALLBACK_IMAGES[category];
  }

  // Ensure image URL is within database limits (500 chars)
  if (imgStr.length > 490) {
    return FALLBACK_IMAGES[category];
  }

  return imgStr;
}

// Process a single CSV file inside a promise wrapper
function processCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(filePath).toLowerCase();
    const separator = detectSeparator(filePath);
    const rowsBatch = [];
    let successfullySeeded = 0;
    let totalProcessed = 0;

    console.log(`[CSV Seeder] Opening stream for ${fileName} with separator="${separator}"...`);

    fs.createReadStream(filePath)
      .pipe(csvParser({ separator }))
      .on('data', (row) => {
        totalProcessed++;
        
        // 1. Extract Title
        const title = getValueByKeys(row, ['title', 'product_name', 'productname', 'product_title', 'name', 'Product Name']).trim();
        if (!title || title.toLowerCase() === 'title' || title.toLowerCase() === 'product_name') {
          return; // Skip headers/empty rows
        }

        // 2. Extract Category
        const category = determineCategory(row, fileName);

        // 3. Extract Detailed Description
        let description = getValueByKeys(row, ['description', 'product_description', 'productdescription', 'Product Description', 'features', 'desc']);
        description = String(description).trim().replace(/^["']|["']$/g, '');
        if (!description || description.toLowerCase() === 'null') {
          description = `${title}. Premium addition to our ${category} catalog. Sourced with the highest quality standards.`;
        }

        // 4. Currency and Price formatting strictly to INR (₹)
        const currency = String(getValueByKeys(row, ['currency', 'country_code'])).toUpperCase();
        let rawFinalPrice = parsePriceValue(getValueByKeys(row, ['final_price', 'price', 'finalprice', 'Price', 'value']));
        let rawInitialPrice = parsePriceValue(getValueByKeys(row, ['initial_price', 'initialprice', 'original_price', 'originalprice', 'Price']));

        // Multipliers based on currency, file, or domain
        const urlStr = String(getValueByKeys(row, ['url', 'domain'])).toLowerCase();
        let multiplier = 1.0;
        if (currency === 'USD') {
          multiplier = 83.0;
        } else if (currency === 'INR' || urlStr.includes('.in') || urlStr.includes('meesho.com') || urlStr.includes('flipkart.com')) {
          multiplier = 1.0;
        } else if (currency === 'EUR') {
          multiplier = 90.0;
        } else if (currency === 'VND') {
          multiplier = 0.0034;
        } else if (currency === 'IDR') {
          multiplier = 0.0053;
        } else if (currency === 'MXN') {
          multiplier = 4.9;
        } else if (currency === 'MYR') {
          multiplier = 18.0;
        } else if (currency === 'PHP') {
          multiplier = 1.45;
        } else if (currency === 'THB') {
          multiplier = 2.3;
        } else if (currency === 'SGD') {
          multiplier = 62.0;
        } else if (currency === 'TWD') {
          multiplier = 2.6;
        } else if (currency === 'BRL') {
          multiplier = 15.0;
        } else if (currency === 'COP') {
          multiplier = 0.021;
        } else if (currency === 'CLP') {
          multiplier = 0.09;
        } else {
          // Default fallbacks based on file origin and URL domain
          if (fileName.includes('amazon') || fileName.includes('walmart') || fileName.includes('shein')) {
            multiplier = 83.0; // Assume USD for these global platforms
          } else if (fileName.includes('lazada')) {
            if (urlStr.includes('.id')) multiplier = 0.0053;
            else if (urlStr.includes('.vn')) multiplier = 0.0034;
            else if (urlStr.includes('.my')) multiplier = 18.0;
            else if (urlStr.includes('.ph')) multiplier = 1.45;
            else if (urlStr.includes('.sg')) multiplier = 62.0;
            else if (urlStr.includes('.th')) multiplier = 2.3;
            else multiplier = 0.0053; // default Lazada IDR
          } else if (fileName.includes('shopee')) {
            if (urlStr.includes('.vn')) multiplier = 0.0034;
            else if (urlStr.includes('.mx')) multiplier = 4.9;
            else if (urlStr.includes('.my')) multiplier = 18.0;
            else if (urlStr.includes('.sg')) multiplier = 62.0;
            else if (urlStr.includes('.id')) multiplier = 0.0053;
            else if (urlStr.includes('.ph')) multiplier = 1.45;
            else if (urlStr.includes('.th')) multiplier = 2.3;
            else if (urlStr.includes('.tw')) multiplier = 2.6;
            else if (urlStr.includes('.br')) multiplier = 15.0;
            else if (urlStr.includes('.co')) multiplier = 0.021;
            else if (urlStr.includes('.cl')) multiplier = 0.09;
            else multiplier = 4.9; // default Shopee MXN
          }
        }

        let price = Math.round(rawFinalPrice * multiplier);
        if (price <= 0) {
          // Mock realistic price if missing or zero
          price = Math.floor(299 + Math.random() * 5000);
        }

        let originalPrice = Math.round(rawInitialPrice * multiplier);
        if (originalPrice <= price) {
          originalPrice = Math.round(price * (1.15 + Math.random() * 0.25));
        }

        // 5. Discount Percentage Label
        let discount = getValueByKeys(row, ['discount', 'disc']) || '';
        if (!discount || discount.toLowerCase() === 'null') {
          const discountPct = Math.round(((originalPrice - price) / originalPrice) * 100);
          discount = discountPct > 0 ? `${discountPct}% OFF` : '';
        }

        // 6. Image Mapping
        const imageUrl = extractImageUrl(row, category);

        // 7. Rating and Reviews mapping
        const rating = parseFloat(parseRatingValue(getValueByKeys(row, ['rating', 'rating_stars'])).toFixed(1));
        const reviews = parseReviewsValue(getValueByKeys(row, ['reviews', 'reviews_count', 'review_count', 'ratingCount', 'Review Count']));

        // 8. Brand mapping
        let brand = String(getValueByKeys(row, ['brand', 'manufacturer'])).trim();
        if (brand.toLowerCase() === 'null' || !brand) {
          if (fileName.includes('meesho')) brand = 'Meesho';
          else if (fileName.includes('shein')) brand = 'SHEIN';
          else brand = 'E-Bazaar';
        }

        // 9. Mock Badge
        let badge = getValueByKeys(row, ['badge']) || '';
        if (!badge || badge.toLowerCase() === 'null') {
          if (rating >= 4.7) badge = 'Top Rated';
          else if (reviews > 400) badge = 'Best Seller';
          else if (Math.random() > 0.85) badge = 'Trending';
        }

        rowsBatch.push({
          category: category.slice(0, 250),
          brand: brand.slice(0, 250),
          title: title.slice(0, 250),
          price,
          originalPrice,
          discount: discount.slice(0, 250),
          rating,
          reviews,
          sales: (getValueByKeys(row, ['sold', 'sales']) || `${Math.floor(50 + Math.random() * 950)}+ sold`).toString().slice(0, 250),
          badge: badge ? badge.slice(0, 250) : null,
          imageUrl: imageUrl.slice(0, 490),
          description,
          gstRate: 18.0
        });
      })
      .on('end', async () => {
        try {
          console.log(`[CSV Seeder] Finished reading ${fileName}. Total parsed rows: ${rowsBatch.length}. Starting batch insertion...`);
          
          // Insert in safe batches of 100 to avoid Supabase timeout/memory limit crashes
          const batchSize = 100;
          for (let i = 0; i < rowsBatch.length; i += batchSize) {
            const chunk = rowsBatch.slice(i, i + batchSize);
            await Product.bulkCreate(chunk);
            successfullySeeded += chunk.length;
          }
          
          console.log(`[CSV Seeder] Successfully populated ${successfullySeeded}/${rowsBatch.length} products from ${fileName}.`);
          resolve(successfullySeeded);
        } catch (dbErr) {
          console.error(`[CSV Seeder] Database insertion failed for ${fileName}:`, dbErr.message);
          reject(dbErr);
        }
      })
      .on('error', (err) => {
        console.error(`[CSV Seeder] Stream error reading ${fileName}:`, err.message);
        reject(err);
      });
  });
}

// Main seeder entry function
async function seedAllCSVs() {
  try {
    console.log('[CSV Seeder] Authenticating with Supabase PostgreSQL...');
    await sequelize.authenticate();
    console.log('[CSV Seeder] Connected. Syncing product schema (WITHOUT destroying users/orders)...');
    
    // We synchronize the products table ONLY to avoid clearing other tables
    await Product.sync({ alter: true });
    
    console.log('[CSV Seeder] Truncating products table for a fresh seed...');
    await Product.destroy({ truncate: true, cascade: true });
    
    // Read the current directory for CSV files
    const backendDir = __dirname;
    const files = fs.readdirSync(backendDir);
    const csvFiles = files.filter(f => f.endsWith('.csv'));

    if (csvFiles.length === 0) {
      console.log('[CSV Seeder] No .csv files found in the backend folder to seed.');
      process.exit(0);
    }

    console.log(`[CSV Seeder] Found ${csvFiles.length} CSV files: ${csvFiles.join(', ')}`);
    
    let grandTotalProducts = 0;

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
    console.log(`[CSV Seeder] DATABASE SEEDING COMPLETED SUCCESSFULY!`);
    console.log(`[CSV Seeder] Total products successfully inserted to Supabase: ${grandTotalProducts}`);
    console.log('===============================================================\n');
    process.exit(0);

  } catch (err) {
    console.error('[CSV Seeder] Fatal error during CSV seeding execution:', err.message);
    process.exit(1);
  }
}

seedAllCSVs();
