const express = require('express');
const router = express.Router();
const { getProducts, bulkCreateProducts, sendLowStockSms, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Get all products (All authenticated users)
router.get('/', authenticate, getProducts);

// Trigger SMS alerts via Twilio (Admin, Manager)
router.post('/low-stock-alert', authenticate, authorize(['Admin', 'Manager']), sendLowStockSms);

// Bulk Import Products (Admin, Manager)
router.post('/bulk', authenticate, authorize(['Admin', 'Manager']), bulkCreateProducts);

// Create product (Admin, Manager)
router.post('/', authenticate, authorize(['Admin', 'Manager']), createProduct);

// Update product (Admin, Manager)
router.put('/:id', authenticate, authorize(['Admin', 'Manager']), updateProduct);

// Delete product (Admin only)
router.delete('/:id', authenticate, authorize(['Admin']), deleteProduct);

module.exports = router;
