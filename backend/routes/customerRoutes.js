const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, getCustomers);
// Cashiers should also be able to create a customer during billing
router.post('/', authenticate, createCustomer);
router.put('/:id', authenticate, authorize(['Admin', 'Manager']), updateCustomer);
router.delete('/:id', authenticate, authorize(['Admin']), deleteCustomer);

module.exports = router;
