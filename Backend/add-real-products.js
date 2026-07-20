const sequelize = require('./config/database');
const Product = require('./models/Product');

const realProducts = [
  // --- ELECTRONICS ---
  {
    title: "Apple iPhone 15 Pro (128GB, Natural Titanium)",
    category: "electronics",
    brand: "Apple",
    price: 134900,
    originalPrice: 144900,
    discount: "7% off",
    rating: 4.9,
    reviews: 4520,
    sales: "12k+",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    description: "Forged in titanium featuring the ground-breaking A17 Pro chip, customizable Action button, and a versatile 48MP camera system."
  },
  {
    title: "Sony PlayStation 5 Console (Slim Disc Edition)",
    category: "electronics",
    brand: "Sony",
    price: 54990,
    originalPrice: 59990,
    discount: "8% off",
    rating: 4.8,
    reviews: 8900,
    sales: "25k+",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    description: "Unleash new gaming possibilities with lightning fast loading via ultra-high speed SSD, haptic feedback, and 3D Audio."
  },
  {
    title: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)",
    category: "electronics",
    brand: "Samsung",
    price: 129999,
    originalPrice: 139999,
    discount: "7% off",
    rating: 4.8,
    reviews: 3200,
    sales: "10k+",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    description: "Welcome to the era of mobile AI with Galaxy S24 Ultra. Capture epic photos with 200MP camera and built-in S Pen."
  },
  {
    title: "MacBook Air M3 15-inch (16GB, 512GB SSD)",
    category: "electronics",
    brand: "Apple",
    price: 134900,
    originalPrice: 144900,
    discount: "7% off",
    rating: 4.9,
    reviews: 1850,
    sales: "8k+",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    description: "Supercharged by M3 chip, this ultra-portable laptop delivers exceptional performance and up to 18 hours of battery life."
  },
  {
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    category: "electronics",
    brand: "Sony",
    price: 29990,
    originalPrice: 34990,
    discount: "14% off",
    rating: 4.8,
    reviews: 6700,
    sales: "18k+",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Industry-leading noise cancellation with two processors and 8 microphones for unparalleled calls and music quality."
  },
  {
    title: "Apple iPad Air M2 11-inch (128GB Wi-Fi)",
    category: "electronics",
    brand: "Apple",
    price: 59900,
    originalPrice: 64900,
    discount: "8% off",
    rating: 4.7,
    reviews: 1200,
    sales: "6k+",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    description: "Freshly redesigned with Liquid Retina display, M2 power, and landscape front camera perfect for video calling."
  },
  {
    title: "Dell XPS 15 9530 Core i9 13th Gen Laptop",
    category: "electronics",
    brand: "Dell",
    price: 249990,
    originalPrice: 279990,
    discount: "11% off",
    rating: 4.7,
    reviews: 640,
    sales: "3k+",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    description: "Immersive 3.5K OLED touch display powered by NVIDIA GeForce RTX graphics and CNC machined aluminum chassis."
  },
  {
    title: "Bose QuietComfort Ultra Wireless Earbuds",
    category: "electronics",
    brand: "Bose",
    price: 25900,
    originalPrice: 29900,
    discount: "13% off",
    rating: 4.7,
    reviews: 2400,
    sales: "9k+",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    description: "Breakthrough spatialized audio for immersive listening and world-class noise cancellation tuned to your ears."
  },
  {
    title: "Samsung 55-inch 4K Ultra HD Smart QLED TV",
    category: "electronics",
    brand: "Samsung",
    price: 64990,
    originalPrice: 84900,
    discount: "23% off",
    rating: 4.6,
    reviews: 3100,
    sales: "14k+",
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
    description: "100% Color Volume with Quantum Dot technology, Quantum HDR, and ultra-thin AirSlim modern aesthetic."
  },
  {
    title: "LG 32-inch Ultragear QHD IPS Gaming Monitor",
    category: "electronics",
    brand: "LG",
    price: 28999,
    originalPrice: 35000,
    discount: "17% off",
    rating: 4.7,
    reviews: 1890,
    sales: "5k+",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    description: "165Hz refresh rate with 1ms MBR responsiveness, NVIDIA G-SYNC compatibility, and HDR10 picture depth."
  },
  {
    title: "Apple Watch Series 9 GPS 45mm Midnight Aluminum",
    category: "electronics",
    brand: "Apple",
    price: 44900,
    originalPrice: 48900,
    discount: "8% off",
    rating: 4.8,
    reviews: 2890,
    sales: "11k+",
    imageUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
    description: "S9 SiP enables double tap gesture control, a brighter display, and faster on-device Siri with health measurement."
  },
  {
    title: "Asus ROG Strix G16 Gaming Laptop Core i7",
    category: "electronics",
    brand: "Asus",
    price: 139990,
    originalPrice: 159990,
    discount: "12% off",
    rating: 4.8,
    reviews: 1450,
    sales: "4k+",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    description: "Dominate the battlefield with 13th Gen Intel Core CPU and NVIDIA GeForce RTX GPU backed by ROG Intelligent Cooling."
  },

  // --- SHOES ---
  {
    title: "Nike Air Jordan 1 Retro High OG Chicago",
    category: "shoes",
    brand: "Nike",
    price: 16995,
    originalPrice: 19995,
    discount: "15% off",
    rating: 4.9,
    reviews: 8400,
    sales: "22k+",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
    description: "The classic sneaker that started it all. Full-grain premium leather upper with encapsulated Air cushioning."
  },
  {
    title: "Adidas Ultraboost Light Running Shoes",
    category: "shoes",
    brand: "Adidas",
    price: 15999,
    originalPrice: 18999,
    discount: "16% off",
    rating: 4.8,
    reviews: 4200,
    sales: "15k+",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    description: "Experience light energy with Light BOOST midsole cushioning and adaptive Primeknit+ upper for supreme comfort."
  },
  {
    title: "Puma RS-X Reinvent Chunky Unisex Sneakers",
    category: "shoes",
    brand: "Puma",
    price: 8999,
    originalPrice: 10999,
    discount: "18% off",
    rating: 4.6,
    reviews: 2900,
    sales: "11k+",
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80",
    description: "Retro-futuristic silhouette engineered with mesh & suede layers and Puma's signature Running System technology."
  },
  {
    title: "Nike Air Max 270 Black/White Sneakers",
    category: "shoes",
    brand: "Nike",
    price: 12995,
    originalPrice: 14995,
    discount: "13% off",
    rating: 4.7,
    reviews: 5100,
    sales: "17k+",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    description: "Boasts Nike's biggest heel Air unit yet for a super soft ride that feels as impossible as it looks."
  },
  {
    title: "Adidas Originals Stan Smith Classic White",
    category: "shoes",
    brand: "Adidas",
    price: 8999,
    originalPrice: 9999,
    discount: "10% off",
    rating: 4.8,
    reviews: 7300,
    sales: "30k+",
    imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
    description: "Clean, minimalist leather tennis shoes with perforated 3-Stripes and green heel tab icon."
  },
  {
    title: "Puma Suede Classic XXI Sneakers Black",
    category: "shoes",
    brand: "Puma",
    price: 6499,
    originalPrice: 7499,
    discount: "13% off",
    rating: 4.7,
    reviews: 3800,
    sales: "14k+",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    description: "The timeless low-top sneaker featuring soft full suede upper, rubber outsole, and Puma Formstrip."
  },
  {
    title: "Nike Pegasus 40 Road Running Shoes",
    category: "shoes",
    brand: "Nike",
    price: 11895,
    originalPrice: 13995,
    discount: "15% off",
    rating: 4.8,
    reviews: 3100,
    sales: "9k+",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    description: "A responsive ride for every run with dual Zoom Air units and engineered mesh for tuned breathable support."
  },
  {
    title: "Adidas Forum Low Retro Basketball Shoes",
    category: "shoes",
    brand: "Adidas",
    price: 9999,
    originalPrice: 11999,
    discount: "16% off",
    rating: 4.7,
    reviews: 2150,
    sales: "7k+",
    imageUrl: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80",
    description: "80s hardwood legacy remade with ankle strap detail, durable leather upper, and classic pivot point outsole."
  },
  {
    title: "Puma Future Rider Play On Sneakers",
    category: "shoes",
    brand: "Puma",
    price: 6999,
    originalPrice: 7999,
    discount: "12% off",
    rating: 4.6,
    reviews: 1980,
    sales: "6k+",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
    description: "Lightweight shock-absorbing Federbein outsole paired with vibrant color-blocked nylon and suede upper."
  },

  // --- FASHION ---
  {
    title: "Zara Men's Leather Jacket",
    category: "fashion",
    brand: "Zara",
    price: 7990,
    originalPrice: 9990,
    discount: "20% off",
    rating: 4.7,
    reviews: 1400,
    sales: "5k+",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    description: "Edgy biker jacket styled with asymmetric lapels, metal zip pockets, and soft quilted lining."
  },
  {
    title: "H&M Denim Jeans",
    category: "fashion",
    brand: "H&M",
    price: 2499,
    originalPrice: 2999,
    discount: "16% off",
    rating: 4.5,
    reviews: 4100,
    sales: "16k+",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    description: "5-pocket cotton rigid denim jeans with a loose straight leg cut for effortless everyday streetwear."
  },
  {
    title: "Levi's 511 Slim Fit",
    category: "fashion",
    brand: "Levi's",
    price: 3299,
    originalPrice: 3999,
    discount: "17% off",
    rating: 4.8,
    reviews: 6200,
    sales: "20k+",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    description: "Modern slim fit jeans crafted with room to move and infused with stretch for all-day flexible comfort."
  },
  {
    title: "Zara High-Rise Tailored Wide Leg Trousers",
    category: "fashion",
    brand: "Zara",
    price: 2990,
    originalPrice: 3590,
    discount: "16% off",
    rating: 4.6,
    reviews: 2100,
    sales: "8k+",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    description: "High waist trousers featuring side pockets, rear welt detail, and a chic fluid wide-leg cut."
  },
  {
    title: "H&M Premium Oversized Cotton Hoodie",
    category: "fashion",
    brand: "H&M",
    price: 1999,
    originalPrice: 2499,
    discount: "20% off",
    rating: 4.7,
    reviews: 5300,
    sales: "24k+",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    description: "Thick plush fleece hoodie styled with dropped shoulders, double-layered hood, and ribbed cuffs."
  },
  {
    title: "Levi's Original Trucker Denim Jacket",
    category: "fashion",
    brand: "Levi's",
    price: 4999,
    originalPrice: 5999,
    discount: "16% off",
    rating: 4.9,
    reviews: 3400,
    sales: "12k+",
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    description: "The original denim jacket since 1967. Point collar, button placket, and signature branded chest flap pockets."
  },
  {
    title: "Uniqlo 100% Pure Cashmere V-Neck Sweater",
    category: "fashion",
    brand: "Uniqlo",
    price: 6990,
    originalPrice: 7990,
    discount: "12% off",
    rating: 4.8,
    reviews: 1100,
    sales: "4k+",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    description: "100% pure cashmere knitted for unbelievable softness, warmth, and feather-light everyday luxury."
  },
  {
    title: "Zara Tailored Double-Breasted Blazer",
    category: "fashion",
    brand: "Zara",
    price: 6990,
    originalPrice: 8990,
    discount: "22% off",
    rating: 4.7,
    reviews: 1650,
    sales: "5k+",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    description: "Structured shoulders with notched lapels and tortoiseshell buttons for effortless smart formalwear."
  },
  {
    title: "Tommy Hilfiger Classic Oxford Cotton Shirt",
    category: "fashion",
    brand: "Tommy Hilfiger",
    price: 4999,
    originalPrice: 5999,
    discount: "16% off",
    rating: 4.8,
    reviews: 2780,
    sales: "9k+",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    description: "Pure cotton Oxford weave shirt with button-down collar and signature embroidered flag logo."
  },

  // --- GROCERIES & DAIRY ---
  {
    title: "Amul Pasteurized Butter 500g Pack",
    category: "groceries",
    brand: "Amul",
    price: 275,
    originalPrice: 290,
    discount: "5% off",
    rating: 4.9,
    reviews: 18400,
    sales: "50k+",
    imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80",
    description: "Utterly butterly delicious butter made from fresh cow and buffalo milk cream. Ideal for toast and baking."
  },
  {
    title: "Amul Gold Full Cream Milk 1L Tetra Pack",
    category: "groceries",
    brand: "Amul",
    price: 72,
    originalPrice: 75,
    discount: "4% off",
    rating: 4.9,
    reviews: 21000,
    sales: "60k+",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80",
    description: "Standardised homogenised milk enriched with Vitamin A and D. Wholesome nutrition for the entire family."
  },
  {
    title: "Amul Dark Chocolate 75% Cocoa 150g Bar",
    category: "groceries",
    brand: "Amul",
    price: 150,
    originalPrice: 175,
    discount: "14% off",
    rating: 4.8,
    reviews: 6400,
    sales: "28k+",
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80",
    description: "Crafted with fine single-origin cocoa beans for a bittersweet melt-in-mouth experience."
  },
  {
    title: "Maggi 2-Minute Noodles (Pack of 12)",
    category: "groceries",
    brand: "Nestle",
    price: 168,
    originalPrice: 180,
    discount: "7% off",
    rating: 4.8,
    reviews: 32000,
    sales: "80k+",
    imageUrl: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&q=80",
    description: "India's favorite instant noodles infused with signature roasted spices for a delicious quick meal."
  },
  {
    title: "Nescafe Classic 100% Pure Instant Coffee Jar 200g",
    category: "groceries",
    brand: "Nestle",
    price: 620,
    originalPrice: 675,
    discount: "8% off",
    rating: 4.9,
    reviews: 14200,
    sales: "35k+",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
    description: "Signature blend of slow-roasted Robusta coffee beans delivering rich aroma and bold coffee taste."
  },
  {
    title: "Amul Pure Cow Ghee 1 Litre Tin",
    category: "groceries",
    brand: "Amul",
    price: 650,
    originalPrice: 699,
    discount: "7% off",
    rating: 4.9,
    reviews: 15400,
    sales: "45k+",
    imageUrl: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800&q=80",
    description: "100% pure cow ghee with rich granular texture and mouth-watering traditional aroma."
  },
  {
    title: "Amul Processed Cheese Slices 400g Pack",
    category: "groceries",
    brand: "Amul",
    price: 240,
    originalPrice: 260,
    discount: "8% off",
    rating: 4.8,
    reviews: 9100,
    sales: "22k+",
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80",
    description: "Individually wrapped cheese slices crafted for burgers, sandwiches, and quick melting snacks."
  },
  {
    title: "Nestle KitKat 4-Finger Milk Chocolate (Pack of 8)",
    category: "groceries",
    brand: "Nestle",
    price: 200,
    originalPrice: 240,
    discount: "16% off",
    rating: 4.8,
    reviews: 11200,
    sales: "40k+",
    imageUrl: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80",
    description: "Crispy wafer fingers covered with smooth milk chocolate. Have a break, have a KitKat!"
  },
  {
    title: "Britannia Good Day Butter Cookies (Pack of 4)",
    category: "groceries",
    brand: "Britannia",
    price: 120,
    originalPrice: 140,
    discount: "14% off",
    rating: 4.7,
    reviews: 18900,
    sales: "55k+",
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",
    description: "Rich crunchy butter cookies baked with love and real butter for a smiling everyday tea break."
  },
  {
    title: "Tata Tea Gold Premium Black Tea 1kg",
    category: "groceries",
    brand: "Tata",
    price: 580,
    originalPrice: 625,
    discount: "7% off",
    rating: 4.8,
    reviews: 13400,
    sales: "32k+",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
    description: "Exquisite blend of fine Assam CTC tea leaves with 15% long leaves for irresistible cup richness."
  }
];

async function injectRealProducts() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();

    console.log(`Injecting ${realProducts.length} real products into SQLite database (preserving existing data)...`);
    const saved = await Product.bulkCreate(realProducts);

    console.log(`Successfully injected ${saved.length}+ Premium Real Products into the E-Bazaar database!`);
    process.exit(0);
  } catch (error) {
    console.error('Error injecting real products:', error.message);
    process.exit(1);
  }
}

injectRealProducts();
