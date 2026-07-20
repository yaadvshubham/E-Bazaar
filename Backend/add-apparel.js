const sequelize = require('./config/database');
const Product = require('./models/Product');

const apparelProducts = [
  // --- WOMEN'S LINGERIE & INNERWEAR ---
  {
    title: "Victoria's Secret Floral Lace Cheeky Panties",
    category: "fashion",
    brand: "Victoria's Secret",
    price: 1499,
    originalPrice: 1899,
    discount: "21% off",
    rating: 4.8,
    reviews: 3200,
    sales: "8k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    description: "Soft stretch lace cheeky panty with subtle scalloped trim for comfortable all-day luxury."
  },
  {
    title: "Victoria's Secret Very Sexy Push-Up Bra",
    category: "fashion",
    brand: "Victoria's Secret",
    price: 4599,
    originalPrice: 5499,
    discount: "16% off",
    rating: 4.9,
    reviews: 4100,
    sales: "12k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80",
    description: "Plush padding adds full cup size lift with smooth microfiber finish under any shirt."
  },
  {
    title: "Calvin Klein Women's Modern Cotton Bralette",
    category: "fashion",
    brand: "Calvin Klein",
    price: 2499,
    originalPrice: 2999,
    discount: "16% off",
    rating: 4.8,
    reviews: 6500,
    sales: "18k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=800&q=80",
    description: "Iconic elastic logo band bra in soft breathable cotton modal blend with unlined racerback style."
  },
  {
    title: "Calvin Klein Women's Cotton Bikinis (3-Pack)",
    category: "fashion",
    brand: "Calvin Klein",
    price: 2999,
    originalPrice: 3599,
    discount: "16% off",
    rating: 4.8,
    reviews: 5100,
    sales: "15k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    description: "Multipack classic bikini underwear featuring signature repeating logo waistband and pure cotton gusset."
  },

  // --- ETHNIC WEAR ---
  {
    title: "FabIndia Pure Tussar Silk Handloom Saree",
    category: "fashion",
    brand: "FabIndia",
    price: 6999,
    originalPrice: 8499,
    discount: "17% off",
    rating: 4.9,
    reviews: 1890,
    sales: "5k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    description: "Elegantly woven pure silk saree with subtle gold zari border, ideal for festive celebrations."
  },
  {
    title: "Biba Printed Cotton Anarkali Salwar Suit Set",
    category: "fashion",
    brand: "Biba",
    price: 3499,
    originalPrice: 4299,
    discount: "18% off",
    rating: 4.7,
    reviews: 3400,
    sales: "9k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
    description: "Flared cotton kurta paired with matching churidar pants and lightweight chiffon dupatta."
  },
  {
    title: "Manyavar Men's Silk Blend Kurta Pajama Set",
    category: "fashion",
    brand: "Manyavar",
    price: 4999,
    originalPrice: 5999,
    discount: "16% off",
    rating: 4.8,
    reviews: 2800,
    sales: "7k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    description: "Traditional mandarin collar knee-length silk blend kurta with comfortable cream churidar."
  },
  {
    title: "FabIndia Men's Short Cotton Chanderi Kurta",
    category: "fashion",
    brand: "FabIndia",
    price: 2199,
    originalPrice: 2699,
    discount: "18% off",
    rating: 4.6,
    reviews: 1420,
    sales: "4k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    description: "Breathable hand-block printed short kurta tailored for smart casual traditional gatherings."
  },

  // --- JEANS & DENIM ---
  {
    title: "Levi's 501 Original Straight Fit Jeans",
    category: "fashion",
    brand: "Levi's",
    price: 3999,
    originalPrice: 4799,
    discount: "16% off",
    rating: 4.9,
    reviews: 9200,
    sales: "25k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    description: "The timeless blueprint denim since 1873 featuring classic button fly and regular straight leg cut."
  },
  {
    title: "Wrangler Retro Bootcut Stretch Jeans",
    category: "fashion",
    brand: "Wrangler",
    price: 2999,
    originalPrice: 3699,
    discount: "18% off",
    rating: 4.7,
    reviews: 2150,
    sales: "6k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    description: "Authentic Western bootcut denim engineered with comfort stretch fabric and flat rivets."
  },
  {
    title: "Zara Women's High-Waisted Baggy Denim Jeans",
    category: "fashion",
    brand: "Zara",
    price: 2990,
    originalPrice: 3590,
    discount: "16% off",
    rating: 4.6,
    reviews: 3100,
    sales: "11k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80",
    description: "Relaxed vintage wash wide leg jeans crafted from 100% rigid cotton for retro street style."
  },
  {
    title: "H&M Women's High-Waisted Flared Jeans",
    category: "fashion",
    brand: "H&M",
    price: 2299,
    originalPrice: 2799,
    discount: "17% off",
    rating: 4.6,
    reviews: 2890,
    sales: "10k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    description: "70s silhouette flare denim hugging hips with dramatic bell bottom wide leg opening."
  },
  {
    title: "Levi's 511 Slim Fit Stretch Denim Jeans",
    category: "fashion",
    brand: "Levi's",
    price: 3299,
    originalPrice: 3999,
    discount: "17% off",
    rating: 4.8,
    reviews: 7400,
    sales: "20k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1511105612320-2e62a04dd044?w=800&q=80",
    description: "Sleek modern slim fit jeans sitting below waist with narrow leg from hip to ankle."
  },

  // --- DRESSES & WOMEN'S FASHION ---
  {
    title: "Zara Tiered Floral Print Maxi Dress",
    category: "fashion",
    brand: "Zara",
    price: 3990,
    originalPrice: 4990,
    discount: "20% off",
    rating: 4.7,
    reviews: 1850,
    sales: "6k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
    description: "Breezy V-neck maxi dress with delicate botanical print, ruffled sleeves, and fluid movement."
  },
  {
    title: "H&M Satin Ribbed Bodycon Party Dress",
    category: "fashion",
    brand: "H&M",
    price: 1999,
    originalPrice: 2499,
    discount: "20% off",
    rating: 4.7,
    reviews: 4200,
    sales: "14k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    description: "Figure-hugging square neckline midi dress with subtle sheen suited for cocktail evenings."
  },
  {
    title: "Forever 21 Floral Summer Sundress",
    category: "fashion",
    brand: "Forever 21",
    price: 1499,
    originalPrice: 1899,
    discount: "21% off",
    rating: 4.5,
    reviews: 2900,
    sales: "9k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    description: "Charming mini sundress featuring adjustable spaghetti straps and sweetheart neckline."
  },
  {
    title: "Zara Draped Wrap Satin Shirt Dress",
    category: "fashion",
    brand: "Zara",
    price: 3290,
    originalPrice: 3990,
    discount: "17% off",
    rating: 4.8,
    reviews: 1640,
    sales: "5k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&q=80",
    description: "Sophisticated collared wrap dress styled with cinched waist tie and asymmetric hemline."
  },

  // --- MEN'S WEAR ---
  {
    title: "Tommy Hilfiger Classic Fit Polo T-Shirt",
    category: "fashion",
    brand: "Tommy Hilfiger",
    price: 3499,
    originalPrice: 4299,
    discount: "18% off",
    rating: 4.8,
    reviews: 6100,
    sales: "16k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80",
    description: "Breathable piqué cotton polo shirt embroidered with iconic flag emblem on chest."
  },
  {
    title: "Calvin Klein Men's Cotton Stretch Boxer Briefs (3-Pack)",
    category: "fashion",
    brand: "Calvin Klein",
    price: 3299,
    originalPrice: 3999,
    discount: "17% off",
    rating: 4.9,
    reviews: 8300,
    sales: "22k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    description: "Ultrasoft cotton stretch trunks featuring signature logo elastic waistband for flexible support."
  },
  {
    title: "Polo Ralph Lauren Iconic Oxford Button-Down Shirt",
    category: "fashion",
    brand: "Polo Ralph Lauren",
    price: 8990,
    originalPrice: 10990,
    discount: "18% off",
    rating: 4.9,
    reviews: 2100,
    sales: "7k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    description: "Tailored long-sleeve cotton Oxford shirt finished with signature Pony embroidery."
  },
  {
    title: "Allen Solly Men's Slim Fit Formal Trousers",
    category: "fashion",
    brand: "Allen Solly",
    price: 2299,
    originalPrice: 2799,
    discount: "17% off",
    rating: 4.6,
    reviews: 3900,
    sales: "12k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&q=80",
    description: "Flat-front wrinkle-resistant trousers built for sharp professional office attire."
  },
  {
    title: "Zara Men's Double-Breasted Trench Coat",
    category: "fashion",
    brand: "Zara",
    price: 8990,
    originalPrice: 10990,
    discount: "18% off",
    rating: 4.8,
    reviews: 980,
    sales: "3k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
    description: "Water-repellent cotton blend trench coat with epaulettes, waist belt, and storm flap."
  },
  {
    title: "Tommy Hilfiger Lightweight Puffer Jacket",
    category: "fashion",
    brand: "Tommy Hilfiger",
    price: 8999,
    originalPrice: 10999,
    discount: "18% off",
    rating: 4.8,
    reviews: 1450,
    sales: "4k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&q=80",
    description: "Packable insulated down jacket providing warmth without bulk during cold weather."
  },

  // --- ADDITIONAL FASHION ITEMS TO TOTAL 40+ ---
  {
    title: "Zara Linen Blend Casual Summer Shirt",
    category: "fashion",
    brand: "Zara",
    price: 2590,
    originalPrice: 3190,
    discount: "18% off",
    rating: 4.6,
    reviews: 1200,
    sales: "5k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80",
    description: "Airy linen cotton mix shirt with camp collar designed for relaxed warm weather outings."
  },
  {
    title: "H&M Women's Oversized Denim Jacket",
    category: "fashion",
    brand: "H&M",
    price: 2999,
    originalPrice: 3599,
    discount: "16% off",
    rating: 4.7,
    reviews: 3100,
    sales: "11k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
    description: "Dropped shoulder trucker jacket in light blue wash denim with metallic button closures."
  },
  {
    title: "Victoria's Secret Satin Chemise Nightdress",
    category: "fashion",
    brand: "Victoria's Secret",
    price: 3999,
    originalPrice: 4799,
    discount: "16% off",
    rating: 4.9,
    reviews: 1890,
    sales: "6k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80",
    description: "Silky draped satin sleepwear with lace V-neck trim and adjustable cross-back straps."
  },
  {
    title: "Calvin Klein Women's Lounge Sweatpants",
    category: "fashion",
    brand: "Calvin Klein",
    price: 3499,
    originalPrice: 4299,
    discount: "18% off",
    rating: 4.7,
    reviews: 2100,
    sales: "7k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    description: "Soft French terry jogger pants with elastic drawstring waist and subtle logo patch."
  },
  {
    title: "Manyavar Men's Jacquard Nehru Jacket",
    category: "fashion",
    brand: "Manyavar",
    price: 3999,
    originalPrice: 4799,
    discount: "16% off",
    rating: 4.8,
    reviews: 1540,
    sales: "4k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    description: "Textured woven sleeveless jacket tailored to pair over kurtas for wedding receptions."
  },
  {
    title: "Biba Chanderi Cotton Dupatta Set",
    category: "fashion",
    brand: "Biba",
    price: 1799,
    originalPrice: 2199,
    discount: "18% off",
    rating: 4.6,
    reviews: 950,
    sales: "3k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    description: "Lightweight sheer dupatta embellished with zari woven borders and tassel finishes."
  },
  {
    title: "FabIndia Handblock Printed Cotton Kurti",
    category: "fashion",
    brand: "FabIndia",
    price: 1890,
    originalPrice: 2290,
    discount: "17% off",
    rating: 4.7,
    reviews: 2100,
    sales: "8k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
    description: "Straight cut daily wear kurti in authentic Bagru block print with side slits."
  },
  {
    title: "Tommy Hilfiger Women's Cable Knit Sweater",
    category: "fashion",
    brand: "Tommy Hilfiger",
    price: 5999,
    originalPrice: 7199,
    discount: "16% off",
    rating: 4.8,
    reviews: 1420,
    sales: "4k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    description: "Classic crewneck cable sweater knitted from soft cotton combed yarn with flag embroidery."
  },
  {
    title: "Polo Ralph Lauren Chino Baseball Cap",
    category: "fashion",
    brand: "Polo Ralph Lauren",
    price: 2999,
    originalPrice: 3599,
    discount: "16% off",
    rating: 4.9,
    reviews: 4800,
    sales: "15k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
    description: "Signature 6-panel cotton chino cap with adjustable buckle strap and multi-colored pony logo."
  },
  {
    title: "Allen Solly Women's Formal Blazer",
    category: "fashion",
    brand: "Allen Solly",
    price: 4499,
    originalPrice: 5399,
    discount: "16% off",
    rating: 4.7,
    reviews: 1250,
    sales: "3k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    description: "Single-button notch collar blazer designed for sharp executive corporate style."
  },
  {
    title: "Levi's Graphic Crewneck T-Shirt",
    category: "fashion",
    brand: "Levi's",
    price: 1499,
    originalPrice: 1799,
    discount: "16% off",
    rating: 4.7,
    reviews: 5800,
    sales: "19k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    description: "Pure cotton jersey tee printed with iconic housemark batwing logo."
  },
  {
    title: "Wrangler Sherpa Lined Corduroy Jacket",
    category: "fashion",
    brand: "Wrangler",
    price: 5999,
    originalPrice: 7199,
    discount: "16% off",
    rating: 4.8,
    reviews: 1100,
    sales: "3k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
    description: "Rugged corduroy exterior lined with plush faux sherpa fleece for winter warmth."
  },
  {
    title: "Zara Sleeveless Pleated Jumpsuit",
    category: "fashion",
    brand: "Zara",
    price: 4590,
    originalPrice: 5490,
    discount: "16% off",
    rating: 4.6,
    reviews: 940,
    sales: "2k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    description: "Chic wide-leg jumpsuit with pleated front overlay and subtle back cutout detail."
  },
  {
    title: "Forever 21 Cropped Faux Fur Jacket",
    category: "fashion",
    brand: "Forever 21",
    price: 2999,
    originalPrice: 3599,
    discount: "16% off",
    rating: 4.5,
    reviews: 1350,
    sales: "4k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    description: "Glamorous plush faux fur coat cropped at waist with hidden hook-and-eye closures."
  },
  {
    title: "H&M Knit Ribbed Midi Skirt",
    category: "fashion",
    brand: "H&M",
    price: 1799,
    originalPrice: 2199,
    discount: "18% off",
    rating: 4.6,
    reviews: 1680,
    sales: "5k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
    description: "Form-fitting elastic waistband skirt knitted from soft stretchy ribbed cotton."
  },
  {
    title: "Calvin Klein Logo Leather Belt",
    category: "fashion",
    brand: "Calvin Klein",
    price: 2999,
    originalPrice: 3599,
    discount: "16% off",
    rating: 4.8,
    reviews: 2900,
    sales: "10k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80",
    description: "Genuine smooth leather belt styled with brushed metal monogram buckle."
  },
  {
    title: "Victoria's Secret Satin Robe",
    category: "fashion",
    brand: "Victoria's Secret",
    price: 4999,
    originalPrice: 5999,
    discount: "16% off",
    rating: 4.9,
    reviews: 2400,
    sales: "7k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80",
    description: "Luxurious knee-length kimono robe crafted in smooth satin with tie waist belt."
  }
];

async function injectApparel() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();

    console.log(`Injecting ${apparelProducts.length} apparel items into SQLite database (preserving existing data)...`);
    const saved = await Product.bulkCreate(apparelProducts);

    console.log(`Successfully injected 40+ Premium Fashion, Ethnic, and Innerwear Products into the E-Bazaar database!`);
    process.exit(0);
  } catch (error) {
    console.error('Error injecting apparel products:', error.message);
    process.exit(1);
  }
}

injectApparel();
