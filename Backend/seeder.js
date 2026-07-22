const axios = require('axios');
const sequelize = require('./config/database');
const Product = require('./models/Product');

// Fallback high-quality product seed data with matching descriptions, prices, categories, and correct image URLs
const fallbackProducts = [
  {
    title: 'Minimalist Walnut Wood Desk Organizer',
    description: 'Premium walnut wood organizer with dedicated slots for pens, phone stand, and mail holder. Keeps your workstation clean, tidy, and aesthetically pleasing.',
    price: 1899.00,
    originalPrice: 2499.00,
    discount: '24% OFF',
    rating: 4.8,
    reviews: 142,
    sales: '300+ sold',
    badge: 'Best Seller',
    category: 'home-kitchen',
    brand: 'Oakwood',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Double-Walled Borosilicate Glass Coffee Mug',
    description: 'Set of 2 insulated double-wall glasses, perfect for cappuccino, latte, or iced drinks. Heat-resistant borosilicate glass keeps your hands cool and drinks hot.',
    price: 899.00,
    originalPrice: 1200.00,
    discount: '25% OFF',
    rating: 4.6,
    reviews: 98,
    sales: '500+ sold',
    badge: 'Trending',
    category: 'home-kitchen',
    brand: 'GlassCo',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Premium Ergonomic Memory Foam Seat Cushion',
    description: 'Designed to provide relief from lower back, tailbone, and sciatic pain. Ideal for office chairs, car seats, and long flights.',
    price: 1499.00,
    originalPrice: 1999.00,
    discount: '25% OFF',
    rating: 4.5,
    reviews: 215,
    sales: '1k+ sold',
    badge: 'Relief Choice',
    category: 'home-kitchen',
    brand: 'ComfortFit',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Hyper-Charge Wireless Noise Cancelling Earbuds',
    description: 'Active Noise Cancellation technology blocks external sounds. Enjoy 30 hours of continuous playback with crystal clear bass and touch control convenience.',
    price: 4999.00,
    originalPrice: 7999.00,
    discount: '37% OFF',
    rating: 4.7,
    reviews: 640,
    sales: '2k+ sold',
    badge: 'Popular',
    category: 'electronics',
    brand: 'AcousticPro',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Super-Slim 4K UHD LED Smart Television',
    description: 'Immerse yourself in spectacular 4K imagery with smart hub capabilities. Includes streaming app shortcuts, HDR10 decoding, and surround sound integration.',
    price: 34999.00,
    originalPrice: 49999.00,
    discount: '30% OFF',
    rating: 4.4,
    reviews: 87,
    sales: '100+ sold',
    badge: 'Big Screen',
    category: 'electronics',
    brand: 'VisionTech',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Premium Leather Smart Watch with Heart Tracker',
    description: 'Stylish stainless steel smartwatch with genuine leather strap. Features sleep tracking, blood oxygen monitors, 12 sport modes, and notification alerts.',
    price: 3999.00,
    originalPrice: 5999.00,
    discount: '33% OFF',
    rating: 4.6,
    reviews: 304,
    sales: '800+ sold',
    badge: 'Style Pick',
    category: 'electronics',
    brand: 'ChronoSync',
    imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Hydrating Vitamin C & Hyaluronic Face Serum',
    description: 'Brighten and deeply hydrate your skin with our antioxidant-rich vitamin C formula. Softens fine lines, fades spots, and gives a radiant natural glow.',
    price: 599.00,
    originalPrice: 799.00,
    discount: '25% OFF',
    rating: 4.7,
    reviews: 1205,
    sales: '5k+ sold',
    badge: 'Super Seller',
    category: 'beauty',
    brand: 'GlowRx',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Organic Tea Tree Purifying Face Wash',
    description: 'Gentle clarifying cleanser made with organic tea tree extract. Targets blemishes, controls oiliness, and cleanses deep down into pores without drying.',
    price: 399.00,
    originalPrice: 499.00,
    discount: '20% OFF',
    rating: 4.5,
    reviews: 432,
    sales: '3k+ sold',
    badge: 'Naturally Clean',
    category: 'beauty',
    brand: 'PureHerb',
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Ultra-Grip Yoga and Pilates Exercise Mat',
    description: '6mm thick high-density TPE exercise mat offering maximum cushioning and anti-slip traction. Eco-friendly, odorless, and comes with a carrying strap.',
    price: 1299.00,
    originalPrice: 1799.00,
    discount: '27% OFF',
    rating: 4.8,
    reviews: 211,
    sales: '1k+ sold',
    badge: 'Fitness Choice',
    category: 'sports',
    brand: 'FlexiFit',
    imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Adjustable Dumbbell Set (20kg Total)',
    description: 'All-in-one dumbbell to barbell converter set. Heavy duty iron plates with secure spinlock collars. Adaptable weight sets perfect for home gym exercises.',
    price: 2499.00,
    originalPrice: 3999.00,
    discount: '37% OFF',
    rating: 4.6,
    reviews: 182,
    sales: '400+ sold',
    badge: 'Heavy Duty',
    category: 'sports',
    brand: 'IronMass',
    imageUrl: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Waterproof Lightweight Hiking Backpack (45L)',
    description: 'Tough ripstop nylon backpack with mesh side pockets, gear loops, and rain cover. Perfect for weekend trekking, hiking, and travel camping.',
    price: 1999.00,
    originalPrice: 2999.00,
    discount: '33% OFF',
    rating: 4.7,
    reviews: 99,
    sales: '300+ sold',
    badge: 'Explorer',
    category: 'sports',
    brand: 'PeakBound',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Classic White Cotton Unisex Slim-Fit Tee',
    description: 'Tailored slim-fit t-shirt crafted from 100% organic long-staple combed cotton. Ultra-breathable, pre-shrunk, and maintains structure after washing.',
    price: 499.00,
    originalPrice: 799.00,
    discount: '37% OFF',
    rating: 4.5,
    reviews: 954,
    sales: '6k+ sold',
    badge: 'Essentials',
    category: 'clothing',
    brand: 'DailyBasic',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Luxury Leather Smart Trifold Wallet',
    description: 'Genuine full-grain leather wallet with integrated RFID protection. Compact size features 8 card slots, ID window, and bills slot.',
    price: 1199.00,
    originalPrice: 1799.00,
    discount: '33% OFF',
    rating: 4.6,
    reviews: 320,
    sales: '2k+ sold',
    badge: 'Style Icon',
    category: 'clothing',
    brand: 'Modena',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Premium Raw Organic Honey (500g)',
    description: '100% pure, unfiltered raw forest honey. Sourced ethically from wild hives. Full of natural enzymes, pollen, and immune-boosting antioxidants.',
    price: 449.00,
    originalPrice: 599.00,
    discount: '25% OFF',
    rating: 4.9,
    reviews: 612,
    sales: '4k+ sold',
    badge: 'Purest Quality',
    category: 'groceries',
    brand: 'WildHive',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  },
  {
    title: 'Gourmet Roasted Salted Cashews (250g)',
    description: 'Premium jumbo cashew nuts roasted to perfection and lightly seasoned with pink Himalayan salt. Rich in fiber, protein, and essential healthy fats.',
    price: 349.00,
    originalPrice: 450.00,
    discount: '22% OFF',
    rating: 4.8,
    reviews: 198,
    sales: '1k+ sold',
    badge: 'Crunchy Fresh',
    category: 'groceries',
    brand: 'NutriBites',
    imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d96?auto=format&fit=crop&w=600&q=80',
    gstRate: 18.0
  }
];

async function seed() {
  try {
    console.log('[Seeder] Authenticating with Supabase PostgreSQL...');
    await sequelize.authenticate();
    console.log('[Seeder] Connection established. Syncing database schemas...');
    
    // We recreate tables on migration
    await sequelize.sync({ force: true });
    console.log('[Seeder] Tables synced successfully.');

    let productsToSeed = [];

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com';

    if (apiKey && apiKey.trim() !== '') {
      console.log(`[Seeder] Rapid API key detected. Fetching products dynamically from host: ${apiHost}...`);
      
      const searchTerms = [
        { term: 'Office Organizer', category: 'home-kitchen' },
        { term: 'Laptop Screen', category: 'electronics' },
        { term: 'Vitamin C Serum', category: 'beauty' },
        { term: 'Yoga Mat', category: 'sports' },
        { term: 'Unisex Tshirt', category: 'clothing' },
        { term: 'Organic Honey', category: 'groceries' }
      ];

      for (const item of searchTerms) {
        try {
          console.log(`[Seeder] Fetching products for term: "${item.term}"...`);
          const response = await axios.get(`https://${apiHost}/search`, {
            params: { query: item.term, page: '1', country: 'US' },
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': apiHost
            }
          });

          const itemsList = response.data?.data?.products || [];
          console.log(`[Seeder] Received ${itemsList.length} products from API.`);

          // Map items dynamically ensuring matching title, description, category, price, and matching imageUrl
          for (const apiProd of itemsList.slice(0, 3)) { // Limit to 3 items per category to stay in limits
            const price = parseFloat(apiProd.product_price ? apiProd.product_price.replace(/[^0-9.-]+/g, "") : "499") || 499.00;
            const originalPrice = apiProd.product_original_price ? parseFloat(apiProd.product_original_price.replace(/[^0-9.-]+/g, "")) : (price * 1.3);
            
            // Map exact values together as a single block to ensure NO image shifting or description mismatch
            productsToSeed.push({
              title: apiProd.product_title || 'E-Commerce Product',
              description: apiProd.product_description || `High quality premium product from E-Bazaar. Category: ${item.category}.`,
              price: price,
              originalPrice: originalPrice,
              discount: apiProd.product_discount || '15% OFF',
              rating: parseFloat(apiProd.product_star_rating) || 4.2,
              reviews: parseInt(apiProd.product_num_ratings) || 12,
              sales: apiProd.sales_volume || '100+ sold',
              badge: apiProd.delivery_message || 'New Arrival',
              category: item.category,
              brand: apiProd.product_by_line || 'E-Bazaar Brand',
              imageUrl: apiProd.product_photo || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
              gstRate: 18.0
            });
          }
        } catch (apiErr) {
          console.error(`[Seeder] Error calling Rapid API for term "${item.term}":`, apiErr.message);
        }
      }
    }

    // If API seeder failed or didn't fetch any products, seed high quality fallback data
    if (productsToSeed.length === 0) {
      console.log('[Seeder] Seeding high-quality, matched fallback product list into Supabase...');
      productsToSeed = fallbackProducts;
    }

    console.log(`[Seeder] Inserting ${productsToSeed.length} products to Supabase PostgreSQL database...`);
    await Product.bulkCreate(productsToSeed);
    console.log('[Seeder] Product database seeding completed successfully!');
    process.exit(0);

  } catch (err) {
    console.error('[Seeder] Database seeding crashed:', err);
    process.exit(1);
  }
}

seed();
