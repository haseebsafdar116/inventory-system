const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
  name: { type: DataTypes.STRING, allowNull: false },
  contact_person: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true }
}, {
  timestamps: true
});

module.exports = Supplier;
