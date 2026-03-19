const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Purchase = sequelize.define('Purchase', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unit_cost: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total_cost: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  datetime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: true
});

module.exports = Purchase;
