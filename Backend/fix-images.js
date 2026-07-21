const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const s = new Sequelize({ dialect: 'sqlite', storage: path.join(__dirname, 'ebazaar.sqlite'), logging: false });

const Product = s.define('Product', {
  title: DataTypes.STRING,
  imageUrl: DataTypes.STRING,
  category: DataTypes.STRING
}, { tableName: 'products' });

async function run() {
  const prods = await Product.findAll();
  
  // Count frequency of each imageUrl
  const imgFreq = {};
  for (let p of prods) {
    imgFreq[p.imageUrl] = (imgFreq[p.imageUrl] || 0) + 1;
  }
  
  let updatedCount = 0;
  for (let p of prods) {
    if (imgFreq[p.imageUrl] > 1) {
      // It's a duplicate image. Assign a unique one.
      const kw = p.category;
      const newImg = `https://loremflickr.com/800/800/${encodeURIComponent(kw)}?lock=${p.id}`;
      p.imageUrl = newImg;
      await p.save();
      updatedCount++;
    }
  }
  console.log(`Successfully updated ${updatedCount} products with duplicate images.`);
}
run();
