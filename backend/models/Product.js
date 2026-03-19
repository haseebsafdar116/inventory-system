const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, allowNull: true, unique: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  low_stock_threshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
  image_url: { type: DataTypes.STRING, allowNull: true }
}, {
  timestamps: true
});

module.exports = Product;
