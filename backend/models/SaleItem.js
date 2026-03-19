const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SaleItem = sequelize.define('SaleItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  timestamps: true
});

module.exports = SaleItem;
