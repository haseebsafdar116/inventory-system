const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sale = sequelize.define('Sale', {
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  payment_method: { type: DataTypes.ENUM('Cash', 'Card', 'Online'), defaultValue: 'Cash' },
  datetime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: true
});

module.exports = Sale;
