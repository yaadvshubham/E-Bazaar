const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  items: {
    type: DataTypes.TEXT,      // JSON.stringify(cartArray)
    allowNull: false,
    defaultValue: '[]',
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'UPI',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Confirmed',
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  razorpayOrderId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpayPaymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpaySignature: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  returnDetails: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  shippingType: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Standard',
  },
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
