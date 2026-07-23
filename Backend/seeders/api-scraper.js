const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');
const sequelize = require('../config/database');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com';

const SEARCH_QUERIES = [
  { query: 'Calvin Klein underwear', brand: 'Calvin Klein', category: 'clothing' },
  { query: 'boat soundbar speaker', brand: 'boat', category: 'gadgets' },
  { query: 'Puma running shoes men', brand: 'PUMA', category: 'shoes' }
];

// Fallback high-quality product feeds in case RapidAPI key is exhausted, blocked, or invalid
const FALLBACK_FEEDS = {
  'Calvin Klein': [
    {
      product_title: 'Calvin Klein Modern Cotton Stretch Hipster Panties 3-Pack',
      product_price: '₹2,299.00',
      product_original_price: '₹3,499.00',
      product_star_rating: '4.8',
      product_num_ratings: 412,
      product_photo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      sales_volume: '300+ bought in past month',
      is_best_seller: true
    },
    {
      product_title: 'Calvin Klein Mens Liquid Stretch Microfiber Trunk Underwear',
      product_price: '₹1,899.00',
      product_original_price: '₹2,799.00',
      product_star_rating: '4.7',
      product_num_ratings: 289,
      product_photo: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      sales_volume: '150+ bought in past month',
      is_best_seller: false
    }
  ],
  'boat': [
    {
      product_title: 'boat Aavante Bar 1500 120W 2.1 Channel Bluetooth Soundbar',
      product_price: '₹6,999.00',
      product_original_price: '₹14,999.00',
      product_star_rating: '4.4',
      product_num_ratings: 1250,
      product_photo: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
      sales_volume: '1k+ bought in past month',
      is_best_seller: true
    }
  ],
  'PUMA': [
    {
      product_title: 'Puma Men Redon Move Fashion Athletic Sneakers',
      product_price: '₹3,499.00',
      product_original_price: '₹5,999.00',
      product_star_rating: '4.6',
      product_num_ratings: 810,
      product_photo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      sales_volume: '400+ bought in past month',
      is_best_seller: false
    }
  ]
};

function parseNumericValue(valStr) {
  if (!valStr) return 0;
  const cleaned = String(valStr).replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

async function fetchFromAmazonAPI(query) {
  if (!RAPIDAPI_KEY || RAPIDAPI_KEY.startsWith('YOUR_')) {
    console.warn(`[Scraper API] RapidAPI Key missing or placeholders found. Using offline live-feed fallback.`);
    return null;
  }

  console.log(`[Scraper API] Querying online: "${query}" via RapidAPI ${RAPIDAPI_HOST}...`);
  try {
    const response = await axios.request({
      method: 'GET',
      url: `https://${RAPIDAPI_HOST}/search`,
      params: {
        query: query,
        country: 'IN',
        page: '1'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      },
      timeout: 10000 // 10 seconds timeout
    });

    if (response.data && response.data.status === 'OK' && response.data.data && Array.isArray(response.data.data.products)) {
      return response.data.data.products;
    } else {
      console.warn(`[Scraper API] Unexpected response format from RapidAPI:`, response.data);
      return null;
    }
  } catch (error) {
    console.warn(`[Scraper API] RapidAPI request failed: ${error.message}. Switching to local feed fallback.`);
    return null;
  }
}

async function scrapeAndSeed() {
  try {
    console.log('[Scraper Seeder] Connecting to Supabase Database via Sequelize...');
    await sequelize.authenticate();
    console.log('[Scraper Seeder] Database connection authenticated successfully.');

    let newlyFetchedCount = 0;
    let skippedCount = 0;

    for (const qItem of SEARCH_QUERIES) {
      console.log(`\n======================================================`);
      console.log(`[Scraper Seeder] Fetching: "${qItem.query}" (Brand: ${qItem.brand})`);
      console.log(`======================================================`);

      let productsList = await fetchFromAmazonAPI(qItem.query);

      // If online fetch fails or returns empty, fall back to high-quality localized product feed list
      if (!productsList || productsList.length === 0) {
        console.log(`[Scraper Seeder] Using high-resolution local product feed fallback for ${qItem.brand}.`);
        productsList = FALLBACK_FEEDS[qItem.brand] || [];
      }

      console.log(`[Scraper Seeder] Processing ${productsList.length} items for brand "${qItem.brand}"...`);

      for (const rawProd of productsList) {
        const title = rawProd.product_title || rawProd.title;
        if (!title) continue;

        // 1. Duplicate check to ensure additive-only insertion
        const existing = await Product.findOne({ where: { title: title } });
        if (existing) {
          console.log(`[Scraper Seeder] [SKIP] Product already exists in database: "${title.slice(0, 50)}..."`);
          skippedCount++;
          continue;
        }

        // 2. Pricing and Original Pricing logic
        let price = parseNumericValue(rawProd.product_price || rawProd.price);
        if (price <= 0) {
          // Mock realistic category-based price if missing
          price = qItem.brand === 'Calvin Klein' ? Math.floor(1299 + Math.random() * 1500) : Math.floor(499 + Math.random() * 4000);
        }

        let originalPrice = parseNumericValue(rawProd.product_original_price || rawProd.originalPrice);
        if (originalPrice <= price) {
          originalPrice = Math.round(price * (1.2 + Math.random() * 0.3));
        }

        const discountPct = Math.round(((originalPrice - price) / originalPrice) * 100);
        const discount = discountPct > 0 ? `${discountPct}% OFF` : '15% OFF';

        // 3. Metadata validation
        const rating = parseFloat(parseFloat(rawProd.product_star_rating || rawProd.rating || 4.2).toFixed(1));
        const reviews = parseInt(rawProd.product_num_ratings || rawProd.reviews || Math.floor(50 + Math.random() * 200), 10);
        const sales = rawProd.sales_volume || `${Math.floor(100 + Math.random() * 900)}+ sold`;
        
        let badge = 'Trending';
        if (rawProd.is_best_seller) {
          badge = 'Best Seller';
        } else if (rating >= 4.7) {
          badge = 'Top Rated';
        }

        const imageUrl = rawProd.product_photo || rawProd.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80';
        
        let description = `Authentic ${qItem.brand} product. Sourced with the highest quality standards. Features premium design, perfect fit, and long-lasting durability.`;
        if (qItem.brand === 'Calvin Klein') {
          description = `Official Calvin Klein designer apparel. Fabricated with ultra-soft cotton stretch material and features the iconic Calvin Klein logo waistband for custom luxury styling.`;
        }

        // 4. Create record in Supabase
        await Product.create({
          category: qItem.category,
          brand: qItem.brand,
          title: title.slice(0, 255),
          price: Math.round(price),
          originalPrice: Math.round(originalPrice),
          discount: discount,
          rating: rating,
          reviews: reviews,
          sales: sales.slice(0, 255),
          badge: badge,
          imageUrl: imageUrl.slice(0, 490),
          description: description,
          stock: Math.floor(20 + Math.random() * 80),
          gstRate: 18.0
        });

        console.log(`[Scraper Seeder] [INSERTED] "${title.slice(0, 50)}..." @ ₹${Math.round(price)}`);
        newlyFetchedCount++;
      }
    }

    console.log('\n======================================================');
    console.log('[Scraper Seeder] COMPLETED RUN SUCCESSFULLY!');
    console.log(`[Scraper Seeder] Added: ${newlyFetchedCount} new products.`);
    console.log(`[Scraper Seeder] Skipped (Duplicates): ${skippedCount} items.`);
    console.log('======================================================\n');
    process.exit(0);

  } catch (err) {
    console.error('[Scraper Seeder] Fatal error during scrape and seed execution:', err.message);
    process.exit(1);
  }
}

scrapeAndSeed();
