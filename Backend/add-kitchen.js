const sequelize = require('./config/database');
const Product = require('./models/Product');

// 1. CORE HAND-CRAFTED KITCHEN PRODUCTS (50 Items)
const coreKitchenProducts = [
  // --- COOKWARE (15 ITEMS) ---
  {
    title: "Hawkins Classic Aluminium Pressure Cooker (3 Litre)",
    category: "home-kitchen",
    brand: "Hawkins",
    price: 1425,
    originalPrice: 1650,
    discount: "14% off",
    rating: 4.9,
    reviews: 42000,
    sales: "95k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "ISI Certified | 5 Years Warranty | Made from pure virgin aluminum with inner lid safety valve."
  },
  {
    title: "Prestige Svachh Hard Anodized Pressure Cooker (5 Litre)",
    category: "home-kitchen",
    brand: "Prestige",
    price: 2490,
    originalPrice: 2890,
    discount: "14% off",
    rating: 4.8,
    reviews: 28400,
    sales: "70k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "ISI Certified | Unique spillage-control Svachh lid design with heavy duty induction base."
  },
  {
    title: "Pigeon By Stovekraft Non-Stick Cookware Set (3 Pieces)",
    category: "home-kitchen",
    brand: "Pigeon",
    price: 1299,
    originalPrice: 1699,
    discount: "23% off",
    rating: 4.6,
    reviews: 18900,
    sales: "50k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "100% PFOA Free | 5-layer non-stick coating set includes Dosa Tawa, Fry Pan and Kadai with Lid."
  },
  {
    title: "Prestige Omega Deluxe Granite Dosa Tawa (280mm)",
    category: "home-kitchen",
    brand: "Prestige",
    price: 890,
    originalPrice: 1090,
    discount: "18% off",
    rating: 4.8,
    reviews: 21500,
    sales: "60k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "German tech 5-layer granite spatter finish non-stick tawa compatible with induction and gas."
  },
  {
    title: "Hawkins Contura Hard Anodised Pressure Cooker (3.5 Litre)",
    category: "home-kitchen",
    brand: "Hawkins",
    price: 2150,
    originalPrice: 2450,
    discount: "12% off",
    rating: 4.9,
    reviews: 31000,
    sales: "80k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "Hard Anodised body with stainless steel lid does not tarnish or react with acidic food."
  },
  {
    title: "Hawkins Tri-Ply Stainless Steel Deep Fry Pan with Glass Lid (2.5 Litre)",
    category: "home-kitchen",
    brand: "Hawkins",
    price: 2290,
    originalPrice: 2650,
    discount: "14% off",
    rating: 4.9,
    reviews: 14200,
    sales: "35k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "3-layer construction ensures uniform heat distribution without hot spots or burning."
  },
  {
    title: "Prestige Nakshatra Alpha Stainless Steel Pressure Cooker (3 Litre)",
    category: "home-kitchen",
    brand: "Prestige",
    price: 1890,
    originalPrice: 2190,
    discount: "13% off",
    rating: 4.8,
    reviews: 19500,
    sales: "45k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "Alpha base induction bottom with comfortable pressure indicator for extra cooking safety."
  },
  {
    title: "Pigeon Special Non-Stick Flat Tawa 250mm",
    category: "home-kitchen",
    brand: "Pigeon",
    price: 499,
    originalPrice: 650,
    discount: "23% off",
    rating: 4.5,
    reviews: 16200,
    sales: "40k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "Strong sturdy cool touch Bakelite handle with 3-layer German coating for oil-free cooking."
  },
  {
    title: "Borosil Stainless Steel Handi Pressure Cooker (4 Litre)",
    category: "home-kitchen",
    brand: "Borosil",
    price: 2790,
    originalPrice: 3290,
    discount: "15% off",
    rating: 4.8,
    reviews: 8900,
    sales: "22k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "7mm thick impact bonded 3-ply base heats 30% faster than ordinary steel pressure cookers."
  },
  {
    title: "Hawkins Futura Hard Anodised Non-Stick Katai with Lid (3.25 Litre)",
    category: "home-kitchen",
    brand: "Hawkins",
    price: 2190,
    originalPrice: 2490,
    discount: "12% off",
    rating: 4.9,
    reviews: 17800,
    sales: "45k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "Patent non-stick locked into tough hard anodised surface for heavy Indian deep frying."
  },
  {
    title: "Pigeon Sheetal Aluminium Pressure Cooker (5 Litre)",
    category: "home-kitchen",
    brand: "Pigeon",
    price: 1199,
    originalPrice: 1499,
    discount: "20% off",
    rating: 4.6,
    reviews: 24000,
    sales: "65k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "High grade virgin aluminium outer lid cooker with nitrile gasket for daily dal and rice."
  },
  {
    title: "Prestige Deluxe Alpha Stainless Steel Kadai with Glass Lid (260mm)",
    category: "home-kitchen",
    brand: "Prestige",
    price: 1790,
    originalPrice: 2090,
    discount: "14% off",
    rating: 4.8,
    reviews: 12400,
    sales: "30k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "Heavy gauge stainless steel body with mirror finish and toughened glass steam vent lid."
  },
  {
    title: "Hawkins Hevibase Aluminium Pressure Cooker (2 Litre)",
    category: "home-kitchen",
    brand: "Hawkins",
    price: 1390,
    originalPrice: 1590,
    discount: "13% off",
    rating: 4.9,
    reviews: 21000,
    sales: "55k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "Heavy 6.35mm thick double base for uniform heating on both electric and gas stovetops."
  },
  {
    title: "Borosil Stainless Steel Classic Kadai (2.8 Litre)",
    category: "home-kitchen",
    brand: "Borosil",
    price: 1990,
    originalPrice: 2390,
    discount: "16% off",
    rating: 4.8,
    reviews: 6400,
    sales: "18k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "100% food grade 304 stainless steel kadai with silicone insulated stay-cool handles."
  },
  {
    title: "Prestige Marvel Glass Top 3 Burner Gas Stove",
    category: "home-kitchen",
    brand: "Prestige",
    price: 4490,
    originalPrice: 5290,
    discount: "15% off",
    rating: 4.8,
    reviews: 19800,
    sales: "50k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    description: "Shatter-proof toughened glass top with tri-pin brass burners and ergonomic spill tray."
  },

  // --- APPLIANCES (15 ITEMS) ---
  {
    title: "Bajaj Rex 500W Mixer Grinder with 3 Jars",
    category: "home-kitchen",
    brand: "Bajaj",
    price: 2199,
    originalPrice: 2599,
    discount: "15% off",
    rating: 4.7,
    reviews: 38000,
    sales: "90k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
    description: "500-Watt motor with overload protector and 3 stainless steel chutney & liquidizing jars."
  },
  {
    title: "Philips HD9200/90 4.1L Digital Air Fryer (1400W)",
    category: "home-kitchen",
    brand: "Philips",
    price: 5990,
    originalPrice: 7990,
    discount: "25% off",
    rating: 4.9,
    reviews: 28900,
    sales: "75k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "Rapid Air technology fries, bakes, roasts with up to 90% less oil for healthy snacks."
  },
  {
    title: "Prestige Iris 750W Mixer Grinder with 4 Jars",
    category: "home-kitchen",
    brand: "Prestige",
    price: 3290,
    originalPrice: 3990,
    discount: "17% off",
    rating: 4.8,
    reviews: 41000,
    sales: "95k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
    description: "Heavy duty 750W copper motor includes juicer jar for smoothies and tough batter grinding."
  },
  {
    title: "Prestige PIC 20.0 2000W Induction Cooktop",
    category: "home-kitchen",
    brand: "Prestige",
    price: 2290,
    originalPrice: 2790,
    discount: "17% off",
    rating: 4.8,
    reviews: 34000,
    sales: "85k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    description: "Indian menu preset options with automatic voltage regulator and aerodynamic cooling fan."
  },
  {
    title: "Bajaj Majesty 15 Litre Storage Water Heater Geyser",
    category: "home-kitchen",
    brand: "Bajaj",
    price: 6490,
    originalPrice: 7990,
    discount: "18% off",
    rating: 4.8,
    reviews: 14500,
    sales: "35k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "Titanium armour technology with 8 bar pressure suitable for high-rise buildings."
  },
  {
    title: "Pigeon 2-Slice Pop-up Toaster 750W",
    category: "home-kitchen",
    brand: "Pigeon",
    price: 999,
    originalPrice: 1299,
    discount: "23% off",
    rating: 4.6,
    reviews: 18200,
    sales: "45k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "6 browning control settings with cool touch body and removable crumb tray for quick cleaning."
  },
  {
    title: "Philips Daily Collection 830W Hand Blender",
    category: "home-kitchen",
    brand: "Philips",
    price: 1690,
    originalPrice: 1990,
    discount: "15% off",
    rating: 4.8,
    reviews: 21000,
    sales: "50k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
    description: "ProMix advanced blending technology with anti-splash blade guard for quick soup purees."
  },
  {
    title: "Usha Armour 1500W Dry Iron Box",
    category: "home-kitchen",
    brand: "Usha",
    price: 799,
    originalPrice: 999,
    discount: "20% off",
    rating: 4.7,
    reviews: 29000,
    sales: "70k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "Weilburger non-stick coated soleplate with 360-degree swivel cord for effortless ironing."
  },
  {
    title: "Bajaj DX-7 1000W Lightweight Dry Iron",
    category: "home-kitchen",
    brand: "Bajaj",
    price: 649,
    originalPrice: 799,
    discount: "18% off",
    rating: 4.7,
    reviews: 42000,
    sales: "95k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "Golden German non-stick coated soleplate with thermal fuse protection against overheating."
  },
  {
    title: "Philips HD9306/06 1.5 Litre Stainless Steel Electric Kettle",
    category: "home-kitchen",
    brand: "Philips",
    price: 2190,
    originalPrice: 2490,
    discount: "12% off",
    rating: 4.8,
    reviews: 16400,
    sales: "40k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "304 food grade stainless steel body with steam sensor auto shut-off for quick boiling water."
  },
  {
    title: "Prestige Electric Kettle PKOSS 1.5 Litre (1500W)",
    category: "home-kitchen",
    brand: "Prestige",
    price: 799,
    originalPrice: 1095,
    discount: "27% off",
    rating: 4.7,
    reviews: 58000,
    sales: "120k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "360-degree swivel power base with locking lid and single-touch button operation."
  },
  {
    title: "Usha Techne 5000 1300W Garment Steamer",
    category: "home-kitchen",
    brand: "Usha",
    price: 2890,
    originalPrice: 3490,
    discount: "17% off",
    rating: 4.8,
    reviews: 6400,
    sales: "18k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "21g/min continuous steam output removes stubborn creases and sanitizes clothes."
  },
  {
    title: "Pigeon Amaze Plus 1.8L Stainless Steel Electric Kettle",
    category: "home-kitchen",
    brand: "Pigeon",
    price: 599,
    originalPrice: 999,
    discount: "40% off",
    rating: 4.6,
    reviews: 62000,
    sales: "150k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "Cordless pouring feature with wide mouth for easy cleaning and fast 1500W heating element."
  },
  {
    title: "Bajaj Splendora 3 Litre Instant Water Heater Geyser",
    category: "home-kitchen",
    brand: "Bajaj",
    price: 2990,
    originalPrice: 3590,
    discount: "16% off",
    rating: 4.7,
    reviews: 11200,
    sales: "30k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "ABS rust-proof body with copper heating element providing instant hot water for kitchen sinks."
  },
  {
    title: "Borosil Prima 10 Litre Oven Toaster Grill (OTG)",
    category: "home-kitchen",
    brand: "Borosil",
    price: 3290,
    originalPrice: 3890,
    discount: "15% off",
    rating: 4.8,
    reviews: 7800,
    sales: "20k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    description: "Adjustable temperature control from 90°C to 230°C for baking cakes, grilling, and toasting."
  },

  // --- STORAGE & FLASKS (10 ITEMS) ---
  {
    title: "Milton Thermosteel Flip Lid Vacuum Flask 1000ml",
    category: "home-kitchen",
    brand: "Milton",
    price: 999,
    originalPrice: 1199,
    discount: "16% off",
    rating: 4.9,
    reviews: 49000,
    sales: "100k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "24-Hour Hot & Cold retention | 100% Rust-free 304 stainless steel double wall insulation."
  },
  {
    title: "Milton Executive Insulated Stainless Steel Tiffin Lunch Box (3 Containers)",
    category: "home-kitchen",
    brand: "Milton",
    price: 890,
    originalPrice: 1050,
    discount: "15% off",
    rating: 4.8,
    reviews: 26000,
    sales: "60k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "Leak-proof stainless steel containers packed in insulated fabric bag with fork and spoon."
  },
  {
    title: "Borosil Klip N Store Microwavable Glass Container Set (3 Pieces)",
    category: "home-kitchen",
    brand: "Borosil",
    price: 1190,
    originalPrice: 1450,
    discount: "17% off",
    rating: 4.9,
    reviews: 18400,
    sales: "45k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "100% Borosilicate glass containers withstand temperature up to 400°C in oven & microwave."
  },
  {
    title: "Cello Checkers Airtight Plastic Container Set 18-Pieces",
    category: "home-kitchen",
    brand: "Cello",
    price: 699,
    originalPrice: 899,
    discount: "22% off",
    rating: 4.7,
    reviews: 31000,
    sales: "80k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "BPA-Free 100% food grade clear plastic canisters with textured grip for pulse & spice storage."
  },
  {
    title: "Milton Royal 3-Piece Casserole Gift Set (1000ml, 1500ml, 2000ml)",
    category: "home-kitchen",
    brand: "Milton",
    price: 1290,
    originalPrice: 1590,
    discount: "18% off",
    rating: 4.8,
    reviews: 15400,
    sales: "35k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "Double-walled insulated inner stainless steel retains roti and curry warmth for up to 6 hours."
  },
  {
    title: "Milton Aqua Stainless Steel Water Bottle 1000ml (Set of 3)",
    category: "home-kitchen",
    brand: "Milton",
    price: 799,
    originalPrice: 999,
    discount: "20% off",
    rating: 4.8,
    reviews: 22000,
    sales: "55k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "Single wall Grade 304 ergonomic slim stainless steel fridge bottles with leak-proof cap."
  },
  {
    title: "Borosil Carry Fresh Stainless Steel Insulated Lunch Box (4 Containers)",
    category: "home-kitchen",
    brand: "Borosil",
    price: 1390,
    originalPrice: 1690,
    discount: "17% off",
    rating: 4.9,
    reviews: 9800,
    sales: "25k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "Double wall vacuum insulation keeps dal hot for 8 hours without condensation."
  },
  {
    title: "Cello H2O Stainless Steel Fridge Water Bottle 1 Litre",
    category: "home-kitchen",
    brand: "Cello",
    price: 299,
    originalPrice: 399,
    discount: "25% off",
    rating: 4.7,
    reviews: 16500,
    sales: "40k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "Odourless 100% food grade steel bottle designed to fit standard refrigerator door pockets."
  },
  {
    title: "Milton Spotzero Spin Mop with Microfiber Refills",
    category: "home-kitchen",
    brand: "Milton",
    price: 1190,
    originalPrice: 1490,
    discount: "20% off",
    rating: 4.8,
    reviews: 38000,
    sales: "90k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: "360-degree steel wringer bucket mop with big wheels and extendable stainless steel handle."
  },
  {
    title: "Cello Max Fresh Click Glass Lunch Box with Bag (2 Containers)",
    category: "home-kitchen",
    brand: "Cello",
    price: 799,
    originalPrice: 999,
    discount: "20% off",
    rating: 4.8,
    reviews: 8400,
    sales: "20k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "Non-porous toughened borosilicate glass that does not absorb food stains or odors."
  },

  // --- DINING & GLASSWARE (10 ITEMS) ---
  {
    title: "Borosil Vision Glass Set (Pack of 6, 295ml)",
    category: "home-kitchen",
    brand: "Borosil",
    price: 540,
    originalPrice: 650,
    discount: "17% off",
    rating: 4.9,
    reviews: 21500,
    sales: "60k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    description: "Extreme temperature resistant flame-proof glass tumblers for serving hot chai or iced drinks."
  },
  {
    title: "Cello Tropical Lagoon Opalware Dinner Set 33-Pieces",
    category: "home-kitchen",
    brand: "Cello",
    price: 2490,
    originalPrice: 3290,
    discount: "24% off",
    rating: 4.8,
    reviews: 14200,
    sales: "30k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    description: "100% bone-ash free German technology chip-resistant white opalware dinnerware set."
  },
  {
    title: "Borosil Mixing Bowl Set with Lid (3-Pieces: 500ml, 1L, 1.5L)",
    category: "home-kitchen",
    brand: "Borosil",
    price: 890,
    originalPrice: 1090,
    discount: "18% off",
    rating: 4.9,
    reviews: 19800,
    sales: "50k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    description: "Scratch-resistant glass mixing bowls safe for microwave, oven, freezer, and dishwasher."
  },
  {
    title: "Cello Imperial Opalware Full Plates (Pack of 6)",
    category: "home-kitchen",
    brand: "Cello",
    price: 899,
    originalPrice: 1199,
    discount: "25% off",
    rating: 4.7,
    reviews: 9200,
    sales: "22k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    description: "Lightweight thermal resistant dinner plates printed with elegant fade-resistant floral motif."
  },
  {
    title: "Borosil Carafe Flameproof Glass Teapot with Strainer 1 Litre",
    category: "home-kitchen",
    brand: "Borosil",
    price: 799,
    originalPrice: 999,
    discount: "20% off",
    rating: 4.8,
    reviews: 11500,
    sales: "28k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    description: "Can be used directly on flame or hot plate to brew green tea, herbal infusions, and filter coffee."
  },
  {
    title: "Milton Pro Stainless Steel Cutlery Set 24-Pieces with Stand",
    category: "home-kitchen",
    brand: "Milton",
    price: 999,
    originalPrice: 1299,
    discount: "23% off",
    rating: 4.8,
    reviews: 8900,
    sales: "20k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    description: "High grade mirror finish steel forks, dinner spoons, tea spoons and knives with rack."
  },
  {
    title: "Borosil Curved Glass Coffee Mugs (Pack of 6, 220ml)",
    category: "home-kitchen",
    brand: "Borosil",
    price: 650,
    originalPrice: 790,
    discount: "18% off",
    rating: 4.9,
    reviews: 12400,
    sales: "32k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    description: "Crystal clear borosilicate glass coffee cups with heat resistant comfortable ear handles."
  },
  {
    title: "Cello Dazzle Series Glass Tumblers (Pack of 6, 300ml)",
    category: "home-kitchen",
    brand: "Cello",
    price: 450,
    originalPrice: 590,
    discount: "23% off",
    rating: 4.6,
    reviews: 7800,
    sales: "18k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    description: "Heavy base diamond cut patterned glass tumblers for serving mocktails, juices and water."
  },
  {
    title: "Borosil Stainless Steel Vacuum Insulated Travel Mug (350ml)",
    category: "home-kitchen",
    brand: "Borosil",
    price: 799,
    originalPrice: 999,
    discount: "20% off",
    rating: 4.9,
    reviews: 14200,
    sales: "35k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "Sipper lid travel coffee mug keeps beverages hot for 8 hours or ice cold for 14 hours."
  },
  {
    title: "Milton Glass Oil Dispenser Bottle with Silicone Brush (500ml)",
    category: "home-kitchen",
    brand: "Milton",
    price: 349,
    originalPrice: 449,
    discount: "22% off",
    rating: 4.7,
    reviews: 16800,
    sales: "42k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: "Drip-free pour spout with measurement markings for precise cooking oil control."
  }
];

// 2. PROGRAMMATIC VARIATIONS GENERATOR (55+ Additional Items to total 105+ Items)
const kitchenVariations = [];

// A. Hawkins Pressure Cooker Capacities (1.5L to 10L) - 8 items
const hawkinsCapacities = [1.5, 2, 3, 4, 5, 6.5, 8, 10];
hawkinsCapacities.forEach(cap => {
  kitchenVariations.push({
    title: `Hawkins Classic Aluminium Pressure Cooker (${cap} Litre)`,
    category: "home-kitchen",
    brand: "Hawkins",
    price: Math.round(1000 + (cap * 220)),
    originalPrice: Math.round(1200 + (cap * 250)),
    discount: "14% off",
    rating: 4.9,
    reviews: Math.floor(Math.random() * 8000) + 3000,
    sales: `${Math.floor(Math.random() * 40) + 20}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: `ISI Certified | Pure virgin aluminium pressure cooker (${cap}L) with inner safety valve.`
  });
});

// B. Prestige Pressure Cookers (2L to 10L) - 6 items
const prestigeCapacities = [2, 3, 5, 6.5, 7.5, 10];
prestigeCapacities.forEach(cap => {
  kitchenVariations.push({
    title: `Prestige Svachh Hard Anodized Pressure Cooker (${cap} Litre)`,
    category: "home-kitchen",
    brand: "Prestige",
    price: Math.round(1400 + (cap * 280)),
    originalPrice: Math.round(1600 + (cap * 320)),
    discount: "13% off",
    rating: 4.8,
    reviews: Math.floor(Math.random() * 6000) + 2500,
    sales: `${Math.floor(Math.random() * 30) + 15}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: `ISI Certified | Heavy duty induction base Svachh spillage-control cooker (${cap}L).`
  });
});

// C. Milton Thermosteel Flask Sizes (350ml, 500ml, 750ml, 1000ml, 1500ml, 2000ml) - 6 items
const flaskSizes = [
  { vol: "350ml", p: 699 },
  { vol: "500ml", p: 799 },
  { vol: "750ml", p: 899 },
  { vol: "1000ml", p: 999 },
  { vol: "1500ml", p: 1290 },
  { vol: "2000ml", p: 1590 }
];
flaskSizes.forEach(f => {
  kitchenVariations.push({
    title: `Milton Thermosteel Flip Lid Vacuum Flask (${f.vol})`,
    category: "home-kitchen",
    brand: "Milton",
    price: f.p,
    originalPrice: Math.round(f.p * 1.2),
    discount: "16% off",
    rating: 4.9,
    reviews: Math.floor(Math.random() * 10000) + 5000,
    sales: `${Math.floor(Math.random() * 50) + 20}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: `24-Hour Hot & Cold retention | Grade 304 double wall stainless steel vacuum flask (${f.vol}).`
  });
});

// D. Prestige Gas Stove Burner Variants (1-Burner to 4-Burner) - 4 items
const burners = [1, 2, 3, 4];
burners.forEach(b => {
  kitchenVariations.push({
    title: `Prestige Marvel Glass Top ${b} Burner Gas Stove`,
    category: "home-kitchen",
    brand: "Prestige",
    price: Math.round(1990 + (b * 950)),
    originalPrice: Math.round(2390 + (b * 1100)),
    discount: "16% off",
    rating: 4.8,
    reviews: Math.floor(Math.random() * 7000) + 2000,
    sales: `${Math.floor(Math.random() * 25) + 10}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    description: `Toughened glass gas stove featuring ${b} high-efficiency brass burners and ergonomic knobs.`
  });
});

// E. Pigeon Non-Stick Pan & Tawa Sizes - 8 items
const pigeonItems = [
  "Pigeon Non-Stick Flat Dosa Tawa 280mm", "Pigeon Non-Stick Flat Dosa Tawa 300mm",
  "Pigeon Non-Stick Fry Pan with Glass Lid 240mm", "Pigeon Non-Stick Fry Pan 260mm",
  "Pigeon Non-Stick Deep Kadai with Stainless Steel Lid 2.5L", "Pigeon Non-Stick Appam Patra with Lid 12-Cavity",
  "Pigeon Non-Stick Grill Pan 240mm", "Pigeon Non-Stick Saucepan 1.5L"
];
pigeonItems.forEach((item, i) => {
  kitchenVariations.push({
    title: item,
    category: "home-kitchen",
    brand: "Pigeon",
    price: 450 + (i * 120),
    originalPrice: 590 + (i * 140),
    discount: "20% off",
    rating: 4.6,
    reviews: Math.floor(Math.random() * 5000) + 1500,
    sales: `${Math.floor(Math.random() * 20) + 10}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    description: `PFOA-free 3-layer food grade non-stick coating with stay-cool sturdy Bakelite handle.`
  });
});

// F. Bajaj Kitchen Appliances & Geysers - 8 items
const bajajItems = [
  "Bajaj Majesty RX11 2000W Heat Convector Room Heater", "Bajaj Popular 1000W Dry Iron",
  "Bajaj Majesty Slim 2000W Induction Cooktop", "Bajaj Electric Kettle 1.7L Stainless Steel",
  "Bajaj GX-1 500W Mixer Grinder with 3 Jars", "Bajaj Twister 750W Mixer Grinder with 3 Jars",
  "Bajaj Majesty Chopper 300W", "Bajaj Food Processor FX-11 600W"
];
bajajItems.forEach((item, i) => {
  kitchenVariations.push({
    title: item,
    category: "home-kitchen",
    brand: "Bajaj",
    price: 799 + (i * 450),
    originalPrice: 999 + (i * 500),
    discount: "18% off",
    rating: 4.7,
    reviews: Math.floor(Math.random() * 6000) + 2000,
    sales: `${Math.floor(Math.random() * 25) + 10}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
    description: `Durable Bajaj home appliance backed by 2-Year warranty and copper motor protection.`
  });
});

// G. Borosil Glassware & Bowls - 8 items
const borosilItems = [
  "Borosil Vision Glass Large Set (Pack of 6, 350ml)", "Borosil Vision Glass Small Set (Pack of 6, 200ml)",
  "Borosil Square Glass Dish with Lid (1.5 Litre)", "Borosil Casserole Glass Dish with Lid (2 Litre)",
  "Borosil Storage Borosilicate Glass Jar 1000ml", "Borosil Storage Borosilicate Glass Jar 500ml",
  "Borosil Gourmet Stainless Steel Casserole 2 Litre", "Borosil Chef Delite Electric Chopper 300W"
];
borosilItems.forEach((item, i) => {
  kitchenVariations.push({
    title: item,
    category: "home-kitchen",
    brand: "Borosil",
    price: 490 + (i * 220),
    originalPrice: 590 + (i * 260),
    discount: "16% off",
    rating: 4.9,
    reviews: Math.floor(Math.random() * 5000) + 2000,
    sales: `${Math.floor(Math.random() * 20) + 10}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    description: `100% Borosilicate glass guaranteed to withstand extreme hot and cold temperatures.`
  });
});

// H. Milton Casseroles & Thermoware - 8 items
const miltonItems = [
  "Milton Marvel 1500 Casserole (1.5 Litre)", "Milton Marvel 2500 Casserole (2.5 Litre)",
  "Milton Thermosteel Vacuum Flask 500ml", "Milton Thermosteel Vacuum Flask 750ml",
  "Milton Insulated Stainless Steel Water Bottle 750ml", "Milton Pro Lunch Box Stainless Steel (4 Jars)",
  "Milton Spotzero Spin Mop Refill Head (Pack of 2)", "Milton Microfiber Dusting Cloth (Pack of 4)"
];
miltonItems.forEach((item, i) => {
  kitchenVariations.push({
    title: item,
    category: "home-kitchen",
    brand: "Milton",
    price: 350 + (i * 180),
    originalPrice: 450 + (i * 210),
    discount: "18% off",
    rating: 4.8,
    reviews: Math.floor(Math.random() * 6000) + 2000,
    sales: `${Math.floor(Math.random() * 30) + 10}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    description: `Premium temperature retention thermoware designed for long-lasting freshness.`
  });
});

// COMBINE ALL KITCHEN PRODUCTS (Target 105+ Products total)
const kitchenProductsArray = [...coreKitchenProducts, ...kitchenVariations];

async function injectKitchenProducts() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();

    console.log(`Injecting MASSIVE dataset of ${kitchenProductsArray.length} Home & Kitchen products into SQLite database (preserving existing data)...`);
    const saved = await Product.bulkCreate(kitchenProductsArray);

    console.log(`Successfully injected 100+ Premium Home & Kitchen Products into the E-Bazaar database!`);
    process.exit(0);
  } catch (error) {
    console.error('Error injecting kitchen products:', error.message);
    process.exit(1);
  }
}

injectKitchenProducts();
