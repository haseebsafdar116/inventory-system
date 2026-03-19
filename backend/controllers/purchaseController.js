const { Purchase, Product, Supplier, User, sequelize } = require('../models');

const createPurchase = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { supplierId, productId, quantity, unit_cost } = req.body;
    
    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      throw new Error('Product not found');
    }

    const total_cost = quantity * unit_cost;

    const newPurchase = await Purchase.create({
      supplierId,
      productId,
      userId: req.user.id,
      quantity,
      unit_cost,
      total_cost
    }, { transaction });

    // Increase stock for the product
    product.stock += quantity;
    // Optionally update price if it's different, but for now we just manage cost
    await product.save({ transaction });

    await transaction.commit();
    res.status(201).json({ message: 'Stock added successfully', purchase: newPurchase });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: error.message || 'Error processing purchase' });
  }
};

const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: Supplier },
        { model: Product },
        { model: User, as: 'purchaser', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases', error });
  }
};

module.exports = { createPurchase, getPurchases };
