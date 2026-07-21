const sequelize = require('./config/database');
const Product = require('./models/Product');

// 1. CORE HAND-CRAFTED SPORTS PRODUCTS (60 Items)
const coreSportsProducts = [
  // --- BADMINTON (12 ITEMS) ---
  {
    title: "Yonex Astrox 99 Pro Graphite Badminton Racquet",
    category: "sports",
    brand: "Yonex",
    price: 16490,
    originalPrice: 18990,
    discount: "13% off",
    rating: 4.9,
    reviews: 2800,
    sales: "8k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
    description: "Pro tournament head-heavy frame with Namd revolutionary graphite for steep devastating smashes."
  },
  {
    title: "Yonex Nanoray 18i Light Weight Badminton Racquet",
    category: "sports",
    brand: "Yonex",
    price: 2490,
    originalPrice: 2990,
    discount: "16% off",
    rating: 4.8,
    reviews: 14200,
    sales: "45k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
    description: "5U ultralight (77g) frame delivering lightning-fast racquet speed and rapid backhand drives."
  },
  {
    title: "Yonex Muscle Power 29 Light Badminton Racquet",
    category: "sports",
    brand: "Yonex",
    price: 3290,
    originalPrice: 3890,
    discount: "15% off",
    rating: 4.7,
    reviews: 8900,
    sales: "25k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    description: "Muscle Power frame locks string into rounded archways to eliminate stress friction and fatigue."
  },
  {
    title: "Yonex Mavis 350 Nylon Shuttlecock (Pack of 6, Yellow)",
    category: "sports",
    brand: "Yonex",
    price: 1150,
    originalPrice: 1350,
    discount: "14% off",
    rating: 4.9,
    reviews: 38000,
    sales: "90k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    description: "Precision engineered nylon shuttles designed to closely match flight performance of feather shuttles."
  },
  {
    title: "Yonex Mavis 2000 Premium Nylon Shuttlecock (Pack of 6)",
    category: "sports",
    brand: "Yonex",
    price: 1490,
    originalPrice: 1750,
    discount: "14% off",
    rating: 4.8,
    reviews: 16500,
    sales: "40k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
    description: "Wing Ribbon technology allows air flow through skirt to create fast recovery and stable trajectory."
  },
  {
    title: "Yonex Super Grap Synthetic Overgrip (Pack of 3)",
    category: "sports",
    brand: "Yonex",
    price: 450,
    originalPrice: 550,
    discount: "18% off",
    rating: 4.9,
    reviews: 21000,
    sales: "60k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
    description: "Tacky feel overgrip absorbing moisture and sweat to provide supreme racquet handling confidence."
  },
  {
    title: "Li-Ning G-Force Superlite 3700 Badminton Racquet",
    category: "sports",
    brand: "Li-Ning",
    price: 2990,
    originalPrice: 3590,
    discount: "16% off",
    rating: 4.7,
    reviews: 6400,
    sales: "20k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    description: "High tension carbon fiber frame supporting string tension up to 30 lbs for powerful smashes."
  },
  {
    title: "Li-Ning Bolt Boost Badminton Shoes",
    category: "sports",
    brand: "Li-Ning",
    price: 3490,
    originalPrice: 4190,
    discount: "16% off",
    rating: 4.8,
    reviews: 4800,
    sales: "15k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    description: "Non-marking gum rubber sole engineered with anti-torsion TPU midfoot plate for court grip."
  },
  {
    title: "Yonex Power Cushion 65 Z3 Court Shoes",
    category: "sports",
    brand: "Yonex",
    price: 11990,
    originalPrice: 13990,
    discount: "14% off",
    rating: 4.9,
    reviews: 3200,
    sales: "10k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    description: "Power Cushion+ shock absorption converts impact energy into smooth propulsion for footwork."
  },
  {
    title: "Cosco CB-88 Aluminum Badminton Racquet Twin Pack",
    category: "sports",
    brand: "Cosco",
    price: 990,
    originalPrice: 1200,
    discount: "17% off",
    rating: 4.5,
    reviews: 11200,
    sales: "30k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80",
    description: "Durable aluminum shaft twin racquet kit with carrying cover ideal for casual outdoor recreation."
  },
  {
    title: "Yonex BG-65 Durability Badminton String (10m)",
    category: "sports",
    brand: "Yonex",
    price: 550,
    originalPrice: 650,
    discount: "15% off",
    rating: 4.9,
    reviews: 18900,
    sales: "50k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1555315051-7140e94f1cc8?w=800&q=80",
    description: "0.70mm thick braided nylon fiber construction providing soft feel and long-lasting durability."
  },
  {
    title: "Decathlon Perfly BR 190 Beginner Badminton Set",
    category: "sports",
    brand: "Decathlon",
    price: 1299,
    originalPrice: 1499,
    discount: "13% off",
    rating: 4.6,
    reviews: 9400,
    sales: "28k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
    description: "Complete starter set including 2 steel racquets, 2 plastic shuttles, and a shoulder strap bag."
  },

  // --- FOOTBALL & BASKETBALL (12 ITEMS) ---
  {
    title: "Nivia Ashtang FIFA Quality Pro Football (Size 5)",
    category: "sports",
    brand: "Nivia",
    price: 1490,
    originalPrice: 1790,
    discount: "16% off",
    rating: 4.8,
    reviews: 19800,
    sales: "60k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&q=80",
    description: "Official match football with 32-panel thermal bonded PU leather for accurate flight stability."
  },
  {
    title: "Cosco Milano Hand Sewn Football (Size 5)",
    category: "sports",
    brand: "Cosco",
    price: 890,
    originalPrice: 1050,
    discount: "15% off",
    rating: 4.6,
    reviews: 14500,
    sales: "40k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&q=80",
    description: "Hand-stitched synthetic rubber composite surface built for turf and tough muddy ground conditions."
  },
  {
    title: "Spalding NBA Official Tack-Soft Basketball (Size 7)",
    category: "sports",
    brand: "Spalding",
    price: 2490,
    originalPrice: 2990,
    discount: "16% off",
    rating: 4.9,
    reviews: 12400,
    sales: "35k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    description: "Premium indoor/outdoor composite leather with soft tack grip channels for superior ball control."
  },
  {
    title: "Nivia Spider Goalkeeper Gloves with Finger Save",
    category: "sports",
    brand: "Nivia",
    price: 990,
    originalPrice: 1200,
    discount: "17% off",
    rating: 4.7,
    reviews: 6800,
    sales: "22k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&q=80",
    description: "3mm German latex palm with finger spines protection to absorb impact and prevent hyperextension."
  },
  {
    title: "Decathlon Kipsta Hardground Football Boots",
    category: "sports",
    brand: "Decathlon",
    price: 1999,
    originalPrice: 2499,
    discount: "20% off",
    rating: 4.7,
    reviews: 9100,
    sales: "30k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    description: "Molded studs designed for hard dirt pitch and synthetic turf offering durable multidirectional traction."
  },
  {
    title: "Nivia Encounter Studs Football Shoes",
    category: "sports",
    brand: "Nivia",
    price: 1290,
    originalPrice: 1590,
    discount: "18% off",
    rating: 4.6,
    reviews: 16200,
    sales: "45k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    description: "Synthetic leather upper with printed graphic design and TPU outsole featuring fixed conical studs."
  },
  {
    title: "Spalding Highlight Rubber Basketball (Size 7)",
    category: "sports",
    brand: "Spalding",
    price: 1190,
    originalPrice: 1490,
    discount: "20% off",
    rating: 4.7,
    reviews: 15400,
    sales: "40k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    description: "Durable pebbled rubber outdoor basketball built to withstand concrete, asphalt, and playground courts."
  },
  {
    title: "Cosco Tournament Volleyball (Size 4)",
    category: "sports",
    brand: "Cosco",
    price: 750,
    originalPrice: 890,
    discount: "15% off",
    rating: 4.6,
    reviews: 8200,
    sales: "25k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&q=80",
    description: "18-panel soft PU leather construction providing soft touch for precision setting and spiking."
  },
  {
    title: "Nivia Shin Guard with Ankle Sleeve Support",
    category: "sports",
    brand: "Nivia",
    price: 350,
    originalPrice: 450,
    discount: "22% off",
    rating: 4.7,
    reviews: 11000,
    sales: "35k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&q=80",
    description: "Hard polypropylene shell backed with EVA foam cushion to absorb shin blows during tackles."
  },
  {
    title: "Decathlon Tarmak Heavy Duty Basketball Hoop & Net Set",
    category: "sports",
    brand: "Decathlon",
    price: 3499,
    originalPrice: 3999,
    discount: "12% off",
    rating: 4.8,
    reviews: 3400,
    sales: "10k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    description: "Solid steel rim with weather-resistant braided nylon net designed for wall mounting."
  },
  {
    title: "Cosco Shot Put Steel Ball 4kg",
    category: "sports",
    brand: "Cosco",
    price: 1450,
    originalPrice: 1700,
    discount: "14% off",
    rating: 4.6,
    reviews: 2100,
    sales: "5k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "Machine turned solid cast iron shot put ball meeting official school and college sports specs."
  },
  {
    title: "Nivia Speed Agility Ladder for Footwork Training (6m)",
    category: "sports",
    brand: "Nivia",
    price: 690,
    originalPrice: 850,
    discount: "18% off",
    rating: 4.8,
    reviews: 7900,
    sales: "22k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "Heavy-duty flat adjustable rungs with nylon straps for soccer, football, and fitness drills."
  },

  // --- SWIMMING (10 ITEMS) ---
  {
    title: "Speedo Biofuse 2.0 Anti-Fog Swim Goggles",
    category: "sports",
    brand: "Speedo",
    price: 1990,
    originalPrice: 2390,
    discount: "16% off",
    rating: 4.9,
    reviews: 11200,
    sales: "30k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: "Super-soft flexible seal frame adapting to facial contours with anti-fog UV protected lenses."
  },
  {
    title: "Speedo Plain Moulded Silicone Swim Cap",
    category: "sports",
    brand: "Speedo",
    price: 690,
    originalPrice: 790,
    discount: "12% off",
    rating: 4.8,
    reviews: 18500,
    sales: "50k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: "100% premium silicone 3D ergonomic shaping reduces drag and protects hair against chlorine."
  },
  {
    title: "Speedo Mens Eco Endurance+ Swimming Trunks",
    category: "sports",
    brand: "Speedo",
    price: 1890,
    originalPrice: 2290,
    discount: "17% off",
    rating: 4.8,
    reviews: 6400,
    sales: "18k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: "100% chlorine resistant quick-drying stretch fabric with adjustable drawstring waistband."
  },
  {
    title: "Speedo Fastskin Speedsocket 2 Mirror Racing Goggles",
    category: "sports",
    brand: "Speedo",
    price: 3490,
    originalPrice: 3990,
    discount: "12% off",
    rating: 4.9,
    reviews: 4200,
    sales: "12k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: "Hydrodynamic low profile mirrored lenses designed to reduce glare and drag for competitive racing."
  },
  {
    title: "Decathlon Nabaiji Women's One-Piece Swimsuit",
    category: "sports",
    brand: "Decathlon",
    price: 1299,
    originalPrice: 1599,
    discount: "18% off",
    rating: 4.7,
    reviews: 14200,
    sales: "38k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: "Chlorine-resistant fabric with U-shaped back straps for easy dressing and freedom of movement."
  },
  {
    title: "Decathlon Nabaiji Foam Swimming Kickboard",
    category: "sports",
    brand: "Decathlon",
    price: 599,
    originalPrice: 699,
    discount: "14% off",
    rating: 4.8,
    reviews: 8900,
    sales: "25k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: "Ergonomic high-buoyancy EVA foam board providing upper body support for lower body leg drills."
  },
  {
    title: "Speedo Ergo Earplugs for Swimming (Pair)",
    category: "sports",
    brand: "Speedo",
    price: 390,
    originalPrice: 490,
    discount: "20% off",
    rating: 4.7,
    reviews: 9500,
    sales: "28k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: "Soft TPR ear plugs crafted to seal out water without damaging ear canals."
  },
  {
    title: "Decathlon Nabaiji Microfiber Swim Towel XL (110x175cm)",
    category: "sports",
    brand: "Decathlon",
    price: 799,
    originalPrice: 999,
    discount: "20% off",
    rating: 4.9,
    reviews: 21000,
    sales: "60k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: "Ultra-compact ultra-absorbent microfiber towel that dries rapidly after swimming sessions."
  },
  {
    title: "Speedo Mariner Supreme Optical Swim Goggles",
    category: "sports",
    brand: "Speedo",
    price: 2490,
    originalPrice: 2890,
    discount: "13% off",
    rating: 4.8,
    reviews: 3100,
    sales: "9k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: "Wide vision lens system with comfortable synthetic seal and easy adjustment side clips."
  },
  {
    title: "Decathlon Nabaiji Inflatable Swimming Armbands (3-6 yrs)",
    category: "sports",
    brand: "Decathlon",
    price: 399,
    originalPrice: 499,
    discount: "20% off",
    rating: 4.8,
    reviews: 12400,
    sales: "32k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: "Dual chamber PVC safety floaties designed to help young children gain confidence in water."
  },

  // --- CRICKET (12 ITEMS) ---
  {
    title: "MRF Genius Grand Edition English Willow Cricket Bat",
    category: "sports",
    brand: "MRF",
    price: 24990,
    originalPrice: 28990,
    discount: "13% off",
    rating: 4.9,
    reviews: 3400,
    sales: "10k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "Hand-crafted Grade 1 English Willow modeled after Virat Kohli's preferred profile and sweet spot."
  },
  {
    title: "SG Savage Edition Kashmir Willow Cricket Bat",
    category: "sports",
    brand: "SG",
    price: 2490,
    originalPrice: 2990,
    discount: "16% off",
    rating: 4.8,
    reviews: 18900,
    sales: "50k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "Traditional shape with thick edges and toe protector, ideal for leather ball club matches."
  },
  {
    title: "SS Ton Sunridges Reserve English Willow Bat",
    category: "sports",
    brand: "SS",
    price: 18990,
    originalPrice: 21990,
    discount: "13% off",
    rating: 4.9,
    reviews: 2900,
    sales: "8k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "Hand-selected air dried Grade 2 English Willow with concaved spine and lightweight pick up."
  },
  {
    title: "SG Test White Leather Cricket Ball (Pack of 2)",
    category: "sports",
    brand: "SG",
    price: 1890,
    originalPrice: 2190,
    discount: "13% off",
    rating: 4.9,
    reviews: 14200,
    sales: "40k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "Four-piece alum tanned leather ball with linen stitching for 80-over match durability."
  },
  {
    title: "Cosco Light Weight Tennis Cricket Ball (Pack of 6, Yellow)",
    category: "sports",
    brand: "Cosco",
    price: 480,
    originalPrice: 570,
    discount: "15% off",
    rating: 4.8,
    reviews: 45000,
    sales: "100k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "High quality felt tennis ball designed for gully and street cricket matches."
  },
  {
    title: "Cosco Heavy Weight Rubber Tennis Ball (Pack of 6)",
    category: "sports",
    brand: "Cosco",
    price: 540,
    originalPrice: 630,
    discount: "14% off",
    rating: 4.8,
    reviews: 29000,
    sales: "75k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "Extra durable heavy rubber tennis ball built for high bounce on hard concrete pitches."
  },
  {
    title: "SS Gladiator Cricket Batting Leg Guard Pads",
    category: "sports",
    brand: "SS",
    price: 3490,
    originalPrice: 4190,
    discount: "16% off",
    rating: 4.8,
    reviews: 6100,
    sales: "18k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "High-density foam face with cane reinforcement bolster providing lightweight protection."
  },
  {
    title: "SG Tournament Cricket Batting Gloves (Right Hand)",
    category: "sports",
    brand: "SG",
    price: 1290,
    originalPrice: 1590,
    discount: "18% off",
    rating: 4.7,
    reviews: 11500,
    sales: "32k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "Premium leather palm with sausage finger rolls and three-piece side bar protection."
  },
  {
    title: "MRF Prodigy Kashmir Willow Junior Cricket Bat",
    category: "sports",
    brand: "MRF",
    price: 1690,
    originalPrice: 1990,
    discount: "15% off",
    rating: 4.7,
    reviews: 8400,
    sales: "24k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "Junior size 5 Kashmir willow bat with short handle rubber grip for academies."
  },
  {
    title: "SG Full Size Wooden Cricket Wickets & Bail Set",
    category: "sports",
    brand: "SG",
    price: 990,
    originalPrice: 1200,
    discount: "17% off",
    rating: 4.8,
    reviews: 13500,
    sales: "38k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "6 polished hardwood stumps (28-inch) with 4 wooden bails for official turf matches."
  },
  {
    title: "SS Helmet Air 3D Adjustable Cricket Helmet",
    category: "sports",
    brand: "SS",
    price: 1990,
    originalPrice: 2390,
    discount: "16% off",
    rating: 4.8,
    reviews: 7200,
    sales: "20k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "High impact outer shell with steel wire face visor and rear dial adjuster for secure fit."
  },
  {
    title: "SG Club Leather Cricket Ball (Red, Pack of 3)",
    category: "sports",
    brand: "SG",
    price: 1350,
    originalPrice: 1600,
    discount: "15% off",
    rating: 4.8,
    reviews: 16800,
    sales: "45k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: "Solid two-piece alum tanned leather ball with cork core center for 40-over games."
  },

  // --- GYM & FITNESS (14 ITEMS) ---
  {
    title: "Decathlon Domyos 8mm Non-Slip Yoga Mat with Strap",
    category: "sports",
    brand: "Decathlon",
    price: 999,
    originalPrice: 1299,
    discount: "23% off",
    rating: 4.8,
    reviews: 34000,
    sales: "80k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    description: "Cushioned TPE eco-friendly mat with textured grip surface for Pilates and floor stretching."
  },
  {
    title: "Decathlon Domyos Rubber Hex Dumbbell 10kg (Pair)",
    category: "sports",
    brand: "Decathlon",
    price: 3499,
    originalPrice: 3999,
    discount: "12% off",
    rating: 4.9,
    reviews: 18500,
    sales: "40k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    description: "Heavy-duty rubber coated hexagonal heads prevent rolling with chrome ergonomic knurled handle."
  },
  {
    title: "Decathlon Domyos Cast Iron Kettlebell 12kg",
    category: "sports",
    brand: "Decathlon",
    price: 2499,
    originalPrice: 2899,
    discount: "13% off",
    rating: 4.9,
    reviews: 9200,
    sales: "22k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "Solid single-piece cast iron construction with wide smooth handle for swings and snatches."
  },
  {
    title: "Decathlon Domyos Heavy Resistance Band Set (3 Levels)",
    category: "sports",
    brand: "Decathlon",
    price: 799,
    originalPrice: 999,
    discount: "20% off",
    rating: 4.8,
    reviews: 28000,
    sales: "65k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "100% natural latex loop bands (Light, Medium, Heavy) for pull-up assist and mobility drills."
  },
  {
    title: "Decathlon Domyos Foldable Motorized Treadmill T540B",
    category: "sports",
    brand: "Decathlon",
    price: 44990,
    originalPrice: 49990,
    discount: "10% off",
    rating: 4.8,
    reviews: 2100,
    sales: "5k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "1.25 HP continuous motor reaching 16 km/h with 10% motorized incline and 24 preset programs."
  },
  {
    title: "Cosco Adjustable Speed Skipping Rope with Ball Bearings",
    category: "sports",
    brand: "Cosco",
    price: 390,
    originalPrice: 490,
    discount: "20% off",
    rating: 4.7,
    reviews: 19800,
    sales: "55k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "3-meter steel wire rope with PVC coating and smooth high-speed ball bearing handles."
  },
  {
    title: "Decathlon Domyos Abdominal Wheel Roller with Knee Pad",
    category: "sports",
    brand: "Decathlon",
    price: 699,
    originalPrice: 899,
    discount: "22% off",
    rating: 4.8,
    reviews: 24000,
    sales: "60k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "Dual wide wheel stability design with non-slip foam handles for core strength rollouts."
  },
  {
    title: "Nivia Gym Wrist Support Straps with Thumb Loop (Pair)",
    category: "sports",
    brand: "Nivia",
    price: 299,
    originalPrice: 399,
    discount: "25% off",
    rating: 4.7,
    reviews: 31000,
    sales: "80k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "Elasticized heavy cotton wrist wraps with velcro lock for heavy bench press and overhead lifts."
  },
  {
    title: "Decathlon Domyos Push Up Bars Stand (Pair)",
    category: "sports",
    brand: "Decathlon",
    price: 499,
    originalPrice: 649,
    discount: "23% off",
    rating: 4.8,
    reviews: 16500,
    sales: "40k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "Ergonomic handles reduce wrist joint strain while increasing chest range of motion."
  },
  {
    title: "Decathlon Core Balance Foam Roller (45cm)",
    category: "sports",
    brand: "Decathlon",
    price: 1199,
    originalPrice: 1499,
    discount: "20% off",
    rating: 4.9,
    reviews: 14200,
    sales: "35k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "High-density EVA foam grid roller for myofascial self-massage and deep muscle recovery."
  },
  {
    title: "Decathlon Domyos Weightlifting Padded Leather Belt",
    category: "sports",
    brand: "Decathlon",
    price: 1999,
    originalPrice: 2399,
    discount: "16% off",
    rating: 4.9,
    reviews: 8900,
    sales: "22k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "4-inch wide split leather belt with dual prong steel buckle for lumbar spinal support."
  },
  {
    title: "Nivia Python Gym Gloves with Wrist Wrap",
    category: "sports",
    brand: "Nivia",
    price: 490,
    originalPrice: 590,
    discount: "17% off",
    rating: 4.6,
    reviews: 21500,
    sales: "55k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "Padded suede leather palm prevents calluses while breathable mesh back keeps hands cool."
  },
  {
    title: "Decathlon Domyos Adjustable Weight Bench 500",
    category: "sports",
    brand: "Decathlon",
    price: 8999,
    originalPrice: 10499,
    discount: "14% off",
    rating: 4.8,
    reviews: 4100,
    sales: "12k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "Flat, incline, and decline positions tested up to 220kg maximum user + weight load capacity."
  },
  {
    title: "Decathlon Domyos 50mm Olympic Barbell Collars (Pair)",
    category: "sports",
    brand: "Decathlon",
    price: 399,
    originalPrice: 499,
    discount: "20% off",
    rating: 4.9,
    reviews: 11000,
    sales: "30k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: "Quick-release nylon jaw clamps designed to lock Olympic weight plates securely on bar."
  }
];

// 2. PROGRAMMATIC VARIATION GENERATOR (95+ Additional Items to hit 155+ Total)
const sportsVariations = [];

// A. Decathlon Hex Dumbbells (Weights 2kg to 25kg) - 10 items
const dumbbellWeights = [2, 3, 5, 7.5, 12.5, 15, 17.5, 20, 22.5, 25];
dumbbellWeights.forEach(wt => {
  sportsVariations.push({
    title: `Decathlon Domyos Rubber Hex Dumbbell ${wt}kg (Single)`,
    category: "sports",
    brand: "Decathlon",
    price: Math.round(wt * 280),
    originalPrice: Math.round(wt * 320),
    discount: "12% off",
    rating: 4.8,
    reviews: Math.floor(Math.random() * 5000) + 1200,
    sales: `${Math.floor(Math.random() * 20) + 5}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    description: `Heavy-duty rubber hex dumbbell ${wt}kg with chrome knurled grip handle for strength training.`
  });
});

// B. Decathlon Cast Iron Gym Plates (1.25kg to 20kg) - 6 items
const plateWeights = [1.25, 2.5, 5, 10, 15, 20];
plateWeights.forEach(wt => {
  sportsVariations.push({
    title: `Decathlon Domyos Cast Iron Weight Plate ${wt}kg (28mm)`,
    category: "sports",
    brand: "Decathlon",
    price: Math.round(wt * 220),
    originalPrice: Math.round(wt * 260),
    discount: "15% off",
    rating: 4.9,
    reviews: Math.floor(Math.random() * 6000) + 2000,
    sales: `${Math.floor(Math.random() * 25) + 10}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: `Solid cast iron disc plate ${wt}kg with 28mm center hole compatible with standard barbells.`
  });
});

// C. Yoga Mats in Multiple Colors & Thicknesses - 10 items
const yogaColors = ["Teal Blue", "Coral Pink", "Plum Purple", "Charcoal Black", "Olive Green", "Electric Red", "Navy Blue", "Lavender", "Mustard Yellow", "Slate Grey"];
yogaColors.forEach((color, i) => {
  const thick = (i % 2 === 0) ? "4mm" : "6mm";
  sportsVariations.push({
    title: `Decathlon Domyos Gentle Yoga Mat ${thick} - ${color}`,
    category: "sports",
    brand: "Decathlon",
    price: 799 + (i * 50),
    originalPrice: 999 + (i * 50),
    discount: "20% off",
    rating: 4.8,
    reviews: Math.floor(Math.random() * 4000) + 3000,
    sales: `${Math.floor(Math.random() * 15) + 15}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    description: `Lightweight non-slip ${color.toLowerCase()} yoga mat (${thick}) crafted for alignment and comfort.`
  });
});

// D. Nivia Football Models & Sizes - 12 items
const footballModels = [
  { name: "Ashtang Turf", size: 4 },
  { name: "Ashtang Turf", size: 3 },
  { name: "Dominator 3.0", size: 5 },
  { name: "Dominator 3.0", size: 4 },
  { name: "Shinining Star", size: 5 },
  { name: "Shinining Star", size: 4 },
  { name: "Country Color Brazil", size: 5 },
  { name: "Country Color Argentina", size: 5 },
  { name: "Ultra Rubber", size: 5 },
  { name: "Trainer Pro", size: 5 },
  { name: "Trainer Pro", size: 4 },
  { name: "Classic Stitch", size: 5 }
];
footballModels.forEach(m => {
  sportsVariations.push({
    title: `Nivia ${m.name} Football (Size ${m.size})`,
    category: "sports",
    brand: "Nivia",
    price: Math.floor(Math.random() * 600) + 650,
    originalPrice: Math.floor(Math.random() * 600) + 850,
    discount: "16% off",
    rating: 4.7,
    reviews: Math.floor(Math.random() * 5000) + 2000,
    sales: `${Math.floor(Math.random() * 20) + 10}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&q=80",
    description: `32-panel durable outer casing size ${m.size} football engineered for high bounce and shape retention.`
  });
});

// E. Yonex Badminton Racquet Variants - 15 items
const yonexModels = [
  "Astrox 88D Play", "Astrox 88S Play", "Astrox 77 Play", "Astrox 3DG", 
  "Nanoray 68 Light", "Nanoray 70 Light", "Nanoflare 100", "Nanoflare 001",
  "Voltric 0.5DG", "Voltric Lite", "Muscle Power 55", "Muscle Power 2",
  "Arcsaber 11 Play", "Arcsaber 7 Play", "DUORA 10 LT"
];
yonexModels.forEach((m, idx) => {
  sportsVariations.push({
    title: `Yonex ${m} Full Graphite Badminton Racquet`,
    category: "sports",
    brand: "Yonex",
    price: 2190 + (idx * 250),
    originalPrice: 2690 + (idx * 250),
    discount: "18% off",
    rating: 4.8,
    reviews: Math.floor(Math.random() * 6000) + 1500,
    sales: `${Math.floor(Math.random() * 30) + 10}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    description: `Isometric head shape frame delivering expanded sweet spot and head light maneuverability.`
  });
});

// F. SG Cricket Bats & Gear Variants - 12 items
const sgItems = [
  "SG Sierra 350 Kashmir Willow Bat", "SG Triple Crown Kashmir Willow Bat", "SG Scorer Classic Kashmir Bat",
  "SG Club Leather Batting Pads", "SG Campus Batting Gloves", "SG Proficient Helmet",
  "SG Cricket Kit Bag with Wheels", "SG Optipro Wicket Keeping Gloves", "SG Abdominal Guard Supporter",
  "SG Thigh Guard Combo Pad", "SG Leather Ball Maintenance Wax", "SG Bat Grip Cone Tool"
];
sgItems.forEach((item, i) => {
  sportsVariations.push({
    title: item,
    category: "sports",
    brand: "SG",
    price: 490 + (i * 300),
    originalPrice: 590 + (i * 350),
    discount: "15% off",
    rating: 4.7,
    reviews: Math.floor(Math.random() * 4000) + 1000,
    sales: `${Math.floor(Math.random() * 15) + 5}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    description: `Official SG cricket gear engineered for club tournaments and training academy practice.`
  });
});

// G. Speedo Goggles & Swimwear Colors - 12 items
const speedoItems = [
  "Speedo Mariner Supreme Goggles (Clear)", "Speedo Mariner Supreme Goggles (Blue)", "Speedo Mariner Supreme Goggles (Black)",
  "Speedo Futura Biofuse Flex Goggles", "Speedo Aquapure Optical Goggles", "Speedo Fastskin Elite Cap",
  "Speedo Printed Silicone Cap (Floral)", "Speedo Printed Silicone Cap (Abstract)", "Speedo Men's Jammer Swim Shorts",
  "Speedo Women's Placement Digital Swimsuit", "Speedo Nose Clip Pro", "Speedo Centre Snorkel Training Tool"
];
speedoItems.forEach((item, i) => {
  sportsVariations.push({
    title: item,
    category: "sports",
    brand: "Speedo",
    price: 450 + (i * 200),
    originalPrice: 550 + (i * 220),
    discount: "14% off",
    rating: 4.8,
    reviews: Math.floor(Math.random() * 3000) + 1200,
    sales: `${Math.floor(Math.random() * 12) + 8}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    description: `Authentic Speedo aquatic gear built with UV protection, anti-fog and anti-chlorine technology.`
  });
});

// H. Spalding Basketball Models & Accessories - 10 items
const spaldingItems = [
  "Spalding TF-250 Indoor/Outdoor Basketball (Size 7)", "Spalding TF-150 Outdoor Rubber Basketball (Size 6)",
  "Spalding TF-50 Basketball (Size 5)", "Spalding Layup Rubber Basketball (Size 7)", "Spalding Heavy Duty Dual Action Ball Pump",
  "Spalding All Weather Nylon Replacement Net", "Spalding NBA Wristbands (Pack of 2)", "Spalding Basketball Carry Net",
  "Spalding Precision TPU Basketball (Size 7)", "Spalding Grip Control Ball Spray"
];
spaldingItems.forEach((item, i) => {
  sportsVariations.push({
    title: item,
    category: "sports",
    brand: "Spalding",
    price: 350 + (i * 250),
    originalPrice: 450 + (i * 280),
    discount: "16% off",
    rating: 4.8,
    reviews: Math.floor(Math.random() * 4000) + 1500,
    sales: `${Math.floor(Math.random() * 18) + 5}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    description: `Official NBA heritage basketball equipment designed for control, durability and responsiveness.`
  });
});

// G. Cosco Fitness & Ball Variations - 10 items
const coscoItems = [
  "Cosco Light Weight Tennis Ball (Pack of 12)", "Cosco High Bounce Rubber Ball (Pack of 6)", "Cosco Super Volleyball (Size 4)",
  "Cosco Handball Match (Size 2)", "Cosco Table Tennis Balls 3-Star (Pack of 6)", "Cosco TT Bat CE-200 Speed",
  "Cosco Ankle Weight Cuff 1kg Pair", "Cosco Ankle Weight Cuff 2kg Pair", "Cosco Aerobic Stepper Board", "Cosco Pilates Gym Ball 65cm"
];
coscoItems.forEach((item, i) => {
  sportsVariations.push({
    title: item,
    category: "sports",
    brand: "Cosco",
    price: 290 + (i * 180),
    originalPrice: 350 + (i * 200),
    discount: "17% off",
    rating: 4.6,
    reviews: Math.floor(Math.random() * 5000) + 2000,
    sales: `${Math.floor(Math.random() * 25) + 10}k+ bought`,
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    description: `High performance Cosco sports gear manufactured under strict quality standards.`
  });
});

// COMBINE ALL SPORTS PRODUCTS (Target 155+ Products total)
const massiveSportsArray = [...coreSportsProducts, ...sportsVariations];

async function injectSportsProducts() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();

    console.log(`Injecting MASSIVE dataset of ${massiveSportsArray.length} sports & gym products into SQLite database (preserving existing data)...`);
    const saved = await Product.bulkCreate(massiveSportsArray);

    console.log(`Successfully injected 150+ Premium Sports & Gym Products into the E-Bazaar database!`);
    process.exit(0);
  } catch (error) {
    console.error('Error injecting sports products:', error.message);
    process.exit(1);
  }
}

injectSportsProducts();
