const { Product, Sale, Purchase, sequelize } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    
    const lowStockProducts = await Product.findAll({
      where: {
        stock: { [Op.lte]: sequelize.col('low_stock_threshold') }
      }
    });

    // Sales this month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const monthlySales = await Sale.sum('total_amount', {
      where: {
        datetime: { [Op.gte]: startOfMonth }
      }
    });

    const recentSales = await Sale.findAll({
      limit: 5,
      order: [['datetime', 'DESC']]
    });

    res.json({
      totalProducts,
      lowStockAlerts: lowStockProducts.length,
      lowStockProducts,
      monthlySales: monthlySales || 0,
      recentSales
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error });
  }
};

module.exports = { getDashboardStats };
