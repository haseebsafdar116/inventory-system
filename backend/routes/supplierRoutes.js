const express = require('express');
const router = express.Router();
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, getSuppliers);
router.post('/', authenticate, authorize(['Admin', 'Manager']), createSupplier);
router.put('/:id', authenticate, authorize(['Admin', 'Manager']), updateSupplier);
router.delete('/:id', authenticate, authorize(['Admin']), deleteSupplier);

module.exports = router;
