const { Sale, SaleItem, Product, sequelize } = require('../models');

const createSale = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { customerId, items, payment_method } = req.body;
    // items is an array of { productId, quantity, unit_price }
    
    let total_amount = 0;
    
    // Create the main Sale record
    const newSale = await Sale.create({
      customerId: customerId || null,
      userId: req.user.id,
      total_amount: 0, 
      payment_method: payment_method || 'Cash'
    }, { transaction });

    for (let item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save({ transaction });

      const subtotal = item.quantity * item.unit_price;
      total_amount += subtotal;

      // Create SaleItem
      await SaleItem.create({
        saleId: newSale.id,
        productId: item.productId,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal
      }, { transaction });
    }

    // Update main Sale total
    newSale.total_amount = total_amount;
    await newSale.save({ transaction });

    await transaction.commit();
    res.status(201).json({ message: 'Sale completed successfully', sale: newSale });

  } catch (error) {
    await transaction.rollback();
    console.error('Sale transaction error:', error);
    res.status(400).json({ message: error.message || 'Error processing sale' });
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        { model: SaleItem, include: [Product] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales' });
  }
};

module.exports = { createSale, getSales };
