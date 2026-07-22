const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WishlistItem = sequelize.define('WishlistItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productData: {
    type: DataTypes.TEXT, // Store stringified product object
    allowNull: true,
  }
}, {
  tableName: 'wishlist_items',
  timestamps: true,
});

module.exports = WishlistItem;
