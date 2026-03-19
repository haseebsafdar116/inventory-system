const { Product, Sale } = require('../models');
const { writeToString } = require('fast-csv');

const exportInventoryCSV = async (req, res) => {
  try {
    const products = await Product.findAll({ raw: true });
    
    const csvString = await writeToString(products, { headers: true });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.csv');
    res.status(200).send(csvString);
  } catch (error) {
    res.status(500).json({ message: 'Error generating CSV report', error });
  }
};

const exportSalesCSV = async (req, res) => {
  try {
    const sales = await Sale.findAll({ raw: true });
    
    const csvString = await writeToString(sales, { headers: true });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sales_report.csv');
    res.status(200).send(csvString);
  } catch (error) {
    res.status(500).json({ message: 'Error generating CSV report', error });
  }
};

module.exports = { exportInventoryCSV, exportSalesCSV };
