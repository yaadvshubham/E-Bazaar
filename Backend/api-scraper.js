const axios = require('axios');
const sequelize = require('./config/database');
const Product = require('./models/Product');

function mapCategory(extCat) {
  if (!extCat) return 'electronics';
  const c = extCat.toLowerCase();
  if (['smartphones', 'laptops'].includes(c)) return 'electronics';
  if (['mens-watches', 'womens-watches'].includes(c)) return 'gadgets';
  if (['womens-dresses', 'mens-shirts', 'tops'].includes(c)) return 'fashion';
  if (['womens-shoes', 'mens-shoes'].includes(c)) return 'shoes';
  if (c === 'groceries') return 'groceries';
  return 'electronics';
}

function mapBrand(brand, mappedCat) {
  if (brand && brand.trim()) return brand.trim();
  const defaultBrands = {
    electronics: 'TechCorp',
    gadgets: 'ChronoTime',
    fashion: 'StyleCo',
    shoes: 'FootWear',
    groceries: 'FreshProduce'
  };
  return defaultBrands[mappedCat] || 'Generic';
}

async function fetchAndSeedExternalData() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();

    console.log('Fetching external product data from DummyJSON API...');
    const response = await axios.get('https://dummyjson.com/products?limit=50');
    const externalProducts = response.data && response.data.products ? response.data.products : [];

    console.log(`Received ${externalProducts.length} raw products. Transforming to local schema...`);

    const mappedProducts = externalProducts.map(p => {
      const category = mapCategory(p.category);
      const brand = mapBrand(p.brand, category);
      const price = parseFloat(p.price) || 0;
      const originalPrice = parseFloat((price * 1.2).toFixed(2));
      const reviews = Math.floor(Math.random() * (5000 - 100 + 1)) + 100;
      const sales = `${Math.floor(Math.random() * 50) + 1}k+`;
      const imageUrl = p.thumbnail || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '');

      return {
        title: p.title || 'Untitled Product',
        category,
        brand,
        price,
        originalPrice,
        discount: '20% off',
        rating: parseFloat(p.rating) || 4.0,
        reviews,
        sales,
        imageUrl,
        description: p.description || ''
      };
    });

    console.log('Recreating tables in SQLite database...');
    await sequelize.sync({ force: true });

    console.log('Seeding products into local database...');
    const savedProducts = await Product.bulkCreate(mappedProducts);

    console.log(`SUCCESS: Pipeline execution complete. Mapped and saved ${savedProducts.length} products to local SQLite database.`);
    process.exit(0);
  } catch (error) {
    console.error('ERROR: Data pipeline script failed:', error.message);
    process.exit(1);
  }
}

fetchAndSeedExternalData();
