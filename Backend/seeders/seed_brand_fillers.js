const sequelize = require('../config/database');
const Product = require('../models/Product');

const brandsData = {
  "Amul": {
    category: "groceries",
    images: [
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Premium Gold Butter", "Processed Cheese Slices", "Taaza Fresh Toned Milk", "Pure Cow Ghee",
      "Fresh Paneer Block", "Masti Spiced Buttermilk", "Premium Dark Chocolate Bar", "High Protein Curd",
      "Whipped Cream Extra", "Condensed Sweetened Milk", "Sugar Free Ice Cream", "Mango Lassi Drink",
      "Gourmet Shrikhand", "Pure Buffalo Ghee", "Fresh Cream Canister", "Elaichi Flavored Milk",
      "Salted Butter Spread", "Cheese Spread Garlic", "Fat Free Skimmed Milk", "Mozzarella Cheese Shredded"
    ],
    basePrice: 150,
    variance: 200
  },
  "Mother Dairy": {
    category: "groceries",
    images: [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Full Cream Milk 1L", "Toned Dairy Milk", "Premium Cow Ghee 1L", "Classic Dahi Cup",
      "Traditional Mishti Doi", "Spiced Jeera Chaach", "Butterscotch Ice Cream Tub", "Salted Butter Pack",
      "Paneer Gold Block", "Mango Milkshake Drink", "Fresh Cream Pack", "Diet Dahi Cup",
      "Elaichi Lassi Drink", "Cheese Slices Pack", "Table Butter Cup", "Pure Buffalo Ghee",
      "Standardized Toned Milk", "Classic Ice Cream Cup", "Flavoured Strawberry Milk", "Low Fat Paneer"
    ],
    basePrice: 80,
    variance: 150
  },
  "Nestlé": {
    category: "groceries",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "KitKat Share Bag", "Maggi 2-Minute Oats Noodles", "Everyday Dairy Whitener", "Nescafé Classic Instant Coffee",
      "Milo Chocolate Drink", "Milkmaid Sweetened Condensed Milk", "Cerelac Multigrain Cereal", "Koko Krunch Chocolate Cereal",
      "Munch Chocolate Bar Pack", "BarOne Chocolate Pack", "Nescafé Gold Premium Blend", "Maggi Hot & Sweet Chilli Sauce",
      "Nestlé Slim Milk Tetrapack", "Milkybar White Chocolate", "Nescafé Sunrise Instant Coffee", "Maggi Masala-ae-Magic Sachet",
      "Nestlé Actiplus Probiotic Dahi", "KitKat Dessert Delight Bar", "Munch Nuts Snack Pack", "Nescafé Intense Iced Coffee Can"
    ],
    basePrice: 120,
    variance: 450
  },
  "Britannia": {
    category: "groceries",
    images: [
      "https://images.unsplash.com/photo-1558961309-dbdf71799f5a?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Good Day Cashew Cookies", "Marie Gold Crunchy Biscuits", "Bourbon Chocolate Cream Biscuits", "NutriChoice Digestive Biscuits",
      "50-50 Maska Chaska Biscuits", "Milk Bikis Kids Biscuits", "Premium Cheese Slices Pack", "Crisp Sooji Rusk Pack",
      "Veg Fruit Cake Slice", "NutriChoice Oats Cookies", "Little Hearts Sugar Glazed Biscuits", "Good Day Butter Cookies Pack",
      "Bourbon Multi-Pack Value", "Cheese Spread Creamy Classic", "Gozzo Cheese Shredded block", "Toastea Premium Rusk Pack",
      "Marie Gold Vita-Active Biscuits", "Good Day Chocochips Cookies", "Treat Jim Jam Cream Biscuits", "Winkin Cow Chocolate Milkshake"
    ],
    basePrice: 50,
    variance: 150
  },
  "Tata": {
    category: "groceries",
    images: [
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d96?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Iodized Table Salt", "Gold Premium Dust Tea", "Premium Assam Leaf Tea", "Sampann Unpolished Toor Dal",
      "Sampann Unpolished Moong Dal", "Sampann Unpolished Chana Dal", "Sampann Organic Turmeric Powder", "Sampann Organic Chilli Powder",
      "Sampann Organic Cumin Seed", "Grand Premium Filter Coffee", "Salt Lite Low Sodium Salt", "Gold Care Wellness Tea Pack",
      "Sampann Organic Coriander Powder", "Sampann Premium Kabuli Chana", "Grand Instant Chicory Coffee", "Salt Super-Saver Pack",
      "Sampann Fine Quality Besan", "Gold Kanti Cardamom Tea", "Sampann Raw Unpolished Rice", "Tetley Green Tea Lemon Ginger"
    ],
    basePrice: 40,
    variance: 250
  },
  "ITC Limited": {
    category: "groceries",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Aashirvaad Shudh Chakki Atta", "Sunfeast Dark Fantasy Choco Fills", "Sunfeast Yippee Masala Noodles", "Bingo Mad Angles Achari Masti",
      "B Natural Guava Juice Pack", "Aashirvaad Crystal Salt Pack", "Bingo Potato Chips Salted", "Aashirvaad Select Premium Sharbati Atta",
      "Sunfeast Dark Fantasy Coffee Fills", "Sunfeast Yippee Power-Up Oats Noodles", "Bingo Mad Angles Tomato Madness", "B Natural Litchi Juice Pack",
      "Aashirvaad Organic Toor Dal", "Aashirvaad Organic Chilli Powder", "Aashirvaad Pure Cow Ghee Pack", "Sunfeast Mom's Magic Cashew Biscuits",
      "Sunfeast Dark Fantasy Bourbon pack", "Bingo Tedhe Medhe Masala Tadka", "B Natural Premium Mango Juice", "Aashirvaad Organic Haldi Powder"
    ],
    basePrice: 60,
    variance: 350
  },
  "Hindustan Unilever Limited": {
    category: "groceries",
    images: [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Knorr Classic Tomato Soup", "Red Label Premium Dust Tea", "Green Label Roast Coffee", "Lipton Pure Green Tea Bags",
      "Kissan Sweet Fruit Jam", "Kissan Fresh Tomato Ketchup", "Knorr Hot & Sour Veg Soup", "Red Label Natural Care Tea",
      "Lipton Honey Lemon Green Tea", "Kissan Mixed Fruit Jam Squeezo", "Kissan Sweet & Spicy Sauce", "Knorr Sweet Corn Chicken Soup",
      "Red Label Dust Tea Extra Power", "Bru Instant Gold Coffee", "Lipton Ice Tea Lemon flavour", "Kissan Pineapple Jam jar",
      "Kissan No Onion No Garlic Ketchup", "Knorr Italian Mushroom Soup", "Red Label Green Elaichi Tea", "Bru Green Label Filter Coffee"
    ],
    basePrice: 50,
    variance: 300
  },
  "boat": {
    category: "gadgets",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Airdopes 141 True Wireless", "Rockerz 450 Bluetooth On-Ear", "Storm Pro Premium Smartwatch", "Wave Call Bluetooth Calling Smartwatch",
      "Stone 350 10W Portable Speaker", "Bassheads 100 Wired Earphones", "Airdopes 131 Pro Earbuds", "Rockerz 255 Pro+ Neckband Wireless",
      "Wave Style Fitness Watch", "Stone 190 5W Wireless Speaker", "Bassheads 225 High-Fidelity Earphones", "Rockerz 330 ANC Neckband Wireless",
      "Airdopes 411 ANC Earbuds", "Xtend Advanced Smartwatch", "Stone 1200 14W Outdoor Speaker", "Avante Bar Cinema Soundbar",
      "Immortal 121 Gaming Earbuds", "Rockerz 550 Over-Ear Headset", "Matrix Premium Call Watch", "Stone Orbit Wireless Party Speaker"
    ],
    basePrice: 599,
    variance: 4500
  },
  "JBL": {
    category: "gadgets",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Flip 6 Waterproof Bluetooth Speaker", "Charge 5 Portable Powerbank Speaker", "Tune 230NC Noise Cancelling Earbuds", "Live 660NC Wireless Headphones",
      "Cinema SB271 Dolby Digital Soundbar", "Go 3 Eco-Friendly Pocket Speaker", "Wave 300TWS True Wireless Earbuds", "Tune 510BT Wireless On-Ear Headset",
      "Clip 4 Portable Clip-on Speaker", "Pulse 5 Glowing Lightshow Speaker", "Live Pro 2 TWS Active Noise Cancelling", "Cinema SB120 Compact Bluetooth Soundbar",
      "Tune 720BT Wireless Over-Ear", "Go 4 Ultra-Compact Bluetooth Speaker", "Wave Flex Open-Ear Comfort TWS", "PartyBox Encore Essential Party Speaker",
      "Tune 130NC Active Noise Cancelling TWS", "Club One Flagship ANC Headphones", "Bar 2.1 Deep Bass Soundbar", "Quantum 100 Wired Gaming Headset"
    ],
    basePrice: 1999,
    variance: 18000
  },
  "Logitech": {
    category: "gadgets",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "MX Master 3S Wireless Developer Mouse", "MX Keys S Premium Backlit Keyboard", "G502 LIGHTSPEED Wireless Gaming Mouse", "Pebble 2 Slim Quiet Bluetooth Mouse",
      "C920 Pro HD Auto-Focus Webcam", "H390 USB Noise-Cancelling Headset", "K380 Multi-Device Wireless Keyboard", "Signature M650 Silent Wireless Mouse",
      "G435 Ultra-Lightweight Wireless Gaming Headset", "Brio 4K Ultra HD Streaming Webcam", "MX Mechanical Wireless Clicky Keyboard", "G213 Prodigy Membrane Gaming Keyboard",
      "Lift Vertical Ergonomic Wireless Mouse", "K120 Wired Standard Office Keyboard", "H111 Stereo Wired Headset Dual Plug", "Logitech Pen USI Stylus Chromebook",
      "G PRO X Mechanical Gaming Keyboard", "MX Anywhere 3S Compact Travel Mouse", "C310 HD Basic Web Camera", "Keys-To-Go Ultra-Portable iPad Keyboard"
    ],
    basePrice: 799,
    variance: 14000
  },
  "BOULT AUDIO": {
    category: "gadgets",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Drift Pro Bluetooth calling Watch", "Airbass Z40 True Wireless Earbuds", "Curve neckband wireless earphone", "Z60 Ultra-Low Latency Earbuds",
      "Anchor Active Noise Cancelling Headphones", "Rover Smartwatch with Dual Straps", "Airbass Y1 TWS Crystal Sound", "Curve Pro Neckband extra bass",
      "Striker smartwatch calling system", "Airbass Gearpod TWS fast charge", "Curve Max neckband 100H playtime", "Dive calling smartwatch metallic",
      "Airbass Propods TWS touch controls", "Curve Fit neckband lightweight", "Power Pro calling smartwatch", "Omega Active Noise Cancelling TWS",
      "Freepods wireless bluetooth earphones", "Curve XS neckband sports fit", "Crown Calling Smartwatch AMOLED", "Mace Wireless Bluetooth Headphones"
    ],
    basePrice: 999,
    variance: 4000
  },
  "Philips": {
    category: "gadgets",
    images: [
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "OneBlade Hybrid Trimmer Shaver", "Smart LED bulb Wi-Fi colour", "Hair Dryer 1600W Compact", "Air Fryer 4.1L Digital Cooker",
      "EasySpeed Steam Iron 2000W", "Sonicare ProtectiveClean Electric Toothbrush", "EasyTouch Garment Steamer Stand", "Smart Air Purifier HEPA filter",
      "Multi-Grooming Kit 9-in-1", "StraightCare Essential Hair Straightener", "Handheld Garment Steamer Compact", "Daily Collection Juicer Mixer",
      "HL7756 Mixer Grinder 750W", "Shine Protect Hair Dryer", "Sonicare Essence Toothbrush pack", "Digital Air Fryer XL 6.2L",
      "PerfectCare Compact Steam Generator", "Air Purifier Series 1000i", "Bodygroom Series 3000 Showerproof", "Straightener Premium Argan Oil infused"
    ],
    basePrice: 699,
    variance: 16000
  },
  "adidas": {
    category: "shoes",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Ultraboost Light Running Shoes", "Stan Smith Classic Leather Sneakers", "Superstar Originals Shell-Toe Shoes", "NMD R1 Refined Lifestyle Sneakers",
      "Duramo Speed Athletic Running Shoes", "Gazelle Vintage Suede Sneakers", "Terrex Eastrail Hiking Trail Shoes", "Adilette Aqua Slide Sandals",
      "Fluidflow 2.0 Lightweight Trainers", "Grand Court Cloudfoam Shoes", "Samba Leather Retro Indoor Soccer", "Supernova Rise Performance Runner",
      "Run Falcon 3.0 Daily Training Shoes", "Forum Low Retro Basketball Sneakers", "Terrex Soulstride Trail Running", "Alphabounce+ Comfort Training Shoes",
      "Adizero Adios Pro Racing Shoes", "Racer TR23 Lifestyle Runner", "Daily 3.0 Casual Skate Shoes", "Eqt Support Classic Lifestyle Shoes"
    ],
    basePrice: 1999,
    variance: 16000
  },
  "NIKE": {
    category: "shoes",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Air Max SC Lifestyle Sneakers", "Air Force 1 '07 Premium Retro", "Air Jordan 1 Low Retro", "Air Zoom Pegasus 41 Performance Running",
      "Blazer Low '77 Vintage Classic", "Metcon 9 Premium Training Shoes", "Dunk Low Retro Skate Sneakers", "Zoom Bella 6 Women's Training",
      "Revolution 7 Road Running Shoes", "Cortez Leather Vintage Lifestyle", "Air Max Pulse Modern Air Cushion", "Wildhorse 8 Trail Running Shoes",
      "Flex Experience Run 12 Trainers", "Waffle Debut Vintage Styled Runner", "Air Max Excee Sporty Sneaker", "React Infinity 3 Support Runner",
      "Vaporfly 3 Marathon Road Racing", "Court Royale 2 Clean Minimalist", "Quest 5 Cushion Training Shoes", "Air Max SYSTM Retro Runner"
    ],
    basePrice: 2499,
    variance: 18000
  },
  "PUMA": {
    category: "shoes",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Suede Classic XXI Iconic Sneakers", "RS-X Geek Futuristic Trainers", "Smash v2 Clean Leather Tennis Shoes", "Softride Enzo Evo Running Shoes",
      "Carina Street Platform Sneakers", "Deviate Nitro 2 Elite Performance Runner", "Anzarun Lite Athletic Sport Shoes", "Cali Star Clean Women's Leather",
      "Velocity Nitro 3 Cushion Running", "Supertec Retro Bold Sneakers", "Softride Vital Running Shoes", "Slipstream Leather Retro Basketball",
      "Red Bull Racing Ridge Cat Motorsport", "BMW M Motorsport Drift Cat", "Scuderia Ferrari Electron E", "Rebound v6 High-Top Basketball",
      "Fuse 2.0 Heavy Weight Training Shoes", "Star Vital Lightweight Runner", "Cell Fraction Mesh Training", "Ascent Trail Trail-running Shoes"
    ],
    basePrice: 1599,
    variance: 9000
  },
  "Reebok": {
    category: "shoes",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Club C 85 Vintage Court Shoes", "Classic Leather Retro Lifestyle Sneakers", "Nano X4 CrossFit Training Shoes", "Floatride Energy 5 Road Running",
      "Zig Kinetica II Dynamic Styled Sneakers", "Glide Clean Classic Leather Shoes", "Lite Plus 4 Daily Active Runner", "Energen Tech Performance Cushioning",
      "Classic Nylon Retro Sporty Sneakers", "Reebok Royal Complete Casual Court", "Nanoflex V2 Training Fitness Shoes", "Floatride Energy Adventure Trail",
      "Zig Dynamica 4 Modern Air Cushion", "Court Advance Comfort Tennis Shoes", "Lite 4 Ultra-Lightweight Runner", "Club C Revenge Retro Sneakers",
      "Lavante Trail Trail-running Shoes", "Royal Glide Retro Suede Sneakers", "Nano Court Fitness Sport Shoes", "Classic Slides Comfort Sandals"
    ],
    basePrice: 1499,
    variance: 9000
  },
  "comet": {
    category: "shoes",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Retro High-Top Sneakers - Nebula", "Comet X Low-Top Classic Leather", "Gravity Glide Performance Sneakers", "Nebula Edition Suede Trainer",
      "Orion High-Top Classic Retro", "Aero Glide Lightweight Sneaker", "Cosmic Wave Colorful Trainers", "Comet X Leather Sport White",
      "Velocity High-Top Basketball Inspired", "Meteor low-top clean sneaker", "Stardust High-Top Suede Edition", "Stratus Cushion Glide Sneaker",
      "Comet Active Training Sport Shoes", "Gravity Pro Cushioning Runner", "Nova High-Top Suede Casual", "Apex Suede Low-top Classic",
      "Comet Street Retro Tennis Shoes", "Retro Run Casual Canvas Sneaker", "Eclipse Low-top Minimalist Black", "Supernova High-Top Canvas"
    ],
    basePrice: 2999,
    variance: 3000
  },
  "New Balance": {
    category: "shoes",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "574 Classic Retro Lifestyle Shoes", "990v6 Premium Made in US Runner", "327 Angular Lifestyle Retro Shoes", "Fresh Foam 1080v13 Cushion Road Runner",
      "2002R Retro-Tech Lifestyle Sneakers", "550 Retro Basketball Low-Tops", "Fresh Foam Arishi v4 Daily Trainer", "574 Core Classic Colorways",
      "Fresh Foam More v4 Ultra-Cushioned", "9060 Futurist Chunky Lifestyle Sneakers", "Hierro v7 Fresh Foam Trail Running", "237 Vintage Lifestyle Sport Shoes",
      "680v8 Everyday Cushion Running", "CT302 Platform Retro Court Sneakers", "FuelCell Rebel v4 Fast Road Racer", "574 Rugged Outdoor Sport Shoes",
      "Dynasoft Nitrel Trail-Running Shoes", "RC30 Retro Minimalist Lifestyle", "880v14 Road Running Shoes", "1906R Heritage Running Tech Sneakers"
    ],
    basePrice: 3499,
    variance: 16000
  },
  "campus": {
    category: "shoes",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80"
    ],
    items: [
      "Oxyfit Running Shoes", "Rodeo Lifestyle Sneakers", "North Gym Trainers", "Stinger Walking Shoes",
      "Chrome Retro Sneakers", "Explode Cushion Running Shoes", "Wildfire Outdoor Trail Shoes", "Max Comfort Slide Sandals",
      "Waveflow Daily Training Shoes", "Hype Street Sneaker", "Brave Running Shoes", "Ninja Running Shoes",
      "Thunder Sport Sneakers", "Vibe Casual Walking Shoes", "Glory Road Running Shoes", "Apex Gym Trainers",
      "Sprint Light Running Shoes", "Force Impact Basketball Shoes", "Iconic Lifestyle Sneakers", "Storm Trail Running Shoes"
    ],
    basePrice: 999,
    variance: 2500
  }
};

async function seed() {
  try {
    console.log('[Brand Seeder] Connecting to database...');
    await sequelize.authenticate();
    
    let totalCreated = 0;
    const entries = Object.entries(brandsData);
    
    for (const [brand, data] of entries) {
      console.log(`[Brand Seeder] Seeding items for brand "${brand}"...`);
      const { category, images, items, basePrice, variance } = data;
      
      for (let i = 0; i < items.length; i++) {
        const itemName = items[i];
        const title = `${brand} ${itemName}`;
        const price = Math.round(basePrice + (i * (variance / items.length)));
        const originalPrice = Math.round(price * (1.2 + (i % 3) * 0.1));
        const discountVal = Math.round(((originalPrice - price) / originalPrice) * 100);
        const discount = discountVal > 0 ? `${discountVal}% OFF` : '15% OFF';
        const rating = parseFloat((4.2 + (i % 8) * 0.1).toFixed(1));
        const reviews = 50 + (i * 12);
        const badge = i === 0 ? "Best Seller" : (i === 1 ? "Trending" : "New Arrival");
        const imageUrl = images[i % images.length];
        
        const productData = {
          category,
          brand,
          title,
          price,
          originalPrice,
          discount,
          rating,
          reviews,
          sales: `${reviews * 2}+ sold`,
          badge,
          imageUrl,
          description: `High-quality authentic product from ${brand}. Categorized under premium ${category}. Engineered with the highest standards of materials to provide durable, aesthetic, and outstanding daily performance.`,
          stock: 50 + (i * 2),
          gstRate: 18.0
        };

        const [prod, created] = await Product.findOrCreate({
          where: { title },
          defaults: productData
        });
        
        if (!created) {
          await prod.update(productData);
        } else {
          totalCreated++;
        }
      }
    }
    
    console.log(`[Brand Seeder] Completed! Added ${totalCreated} brand products.`);
    process.exit(0);
  } catch (err) {
    console.error('[Brand Seeder Error]:', err);
    process.exit(1);
  }
}

seed();
