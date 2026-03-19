const sequelize = require('../config/database');

const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Supplier = require('./Supplier');
const Customer = require('./Customer');
const Sale = require('./Sale');
const SaleItem = require('./SaleItem');
const Purchase = require('./Purchase');

// Define Relationships

// A Category has many Products
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// A Sale belongs to a User (Cashier) and optionally a Customer
Sale.belongsTo(User, { foreignKey: 'userId', as: 'cashier' });
User.hasMany(Sale, { foreignKey: 'userId' });

Sale.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(Sale, { foreignKey: 'customerId' });

// A Sale has many Sale Items (Products)
Sale.hasMany(SaleItem, { foreignKey: 'saleId' });
SaleItem.belongsTo(Sale, { foreignKey: 'saleId' });

SaleItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(SaleItem, { foreignKey: 'productId' });

// A Purchase (Stock In) belongs to a Supplier, Product, and User (Admin/Manager)
Purchase.belongsTo(Supplier, { foreignKey: 'supplierId' });
Supplier.hasMany(Purchase, { foreignKey: 'supplierId' });

Purchase.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Purchase, { foreignKey: 'productId' });

Purchase.belongsTo(User, { foreignKey: 'userId', as: 'purchaser' });
User.hasMany(Purchase, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Supplier,
  Customer,
  Sale,
  SaleItem,
  Purchase
};
