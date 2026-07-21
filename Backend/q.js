const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite', logging: false });
const { DataTypes } = require('sequelize');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  originalPrice: { type: DataTypes.FLOAT },
  category: { type: DataTypes.STRING },
  subCategory: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING }
});

async function q() {
  const products = await Product.findAll({ where: { category: 'Groceries' } });
  console.log(products.map(p => ({ id: p.id, name: p.name, price: p.price, oPrice: p.originalPrice })));
}
q();
