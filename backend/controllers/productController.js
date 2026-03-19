const { Product, Category } = require('../models');
const twilio = require('twilio');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ['id', 'name'] }]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Bulk Import Products (CSV)
const bulkCreateProducts = async (req, res) => {
  try {
    const { products } = req.body;
    await Product.bulkCreate(products);
    res.status(201).json({ message: 'Products imported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error bulk importing products', error });
  }
};

// Send Low Stock SMS Alerts (Twilio FR-07)
const sendLowStockSms = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items to alert for' });

    // Optional: Twilio variables from .env if the user configures them
    const accountSid = process.env.TWILIO_SID || 'AC_dummy_sid'; 
    const authToken = process.env.TWILIO_AUTH_TOKEN || 'dummy_token';

    const messageBody = `FreshMart Inventory Alert: You have ${items.length} products running low on stock (e.g., ${items[0].name}). Please restock soon!`;

    // Simulated successful log if no real keys present
    if (accountSid === 'AC_dummy_sid') {
      console.log('--- TWILIO SIMULATION ---');
      console.log('To: Admin | Message:', messageBody);
      return res.json({ message: 'Simulated SMS sent successfully to Admin via Twilio (Real keys not configured in .env).' });
    }

    // Real sending if keys exist
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      to: process.env.ADMIN_PHONE_NUMBER || '+0987654321'
    });

    res.json({ message: 'Twilio SMS Sent Successfully' });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ message: 'Error sending SMS', error });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, sku, price, stock, low_stock_threshold, categoryId, image_url } = req.body;
    const newProduct = await Product.create({
      name, sku, price, stock, low_stock_threshold, categoryId, image_url
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Product.update(req.body, { where: { id } });
    if (updated) {
      const updatedProduct = await Product.findByPk(id);
      return res.json(updatedProduct);
    }
    return res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (deleted) {
      return res.json({ message: 'Product deleted' });
    }
    return res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

module.exports = { getProducts, bulkCreateProducts, sendLowStockSms, createProduct, updateProduct, deleteProduct };
