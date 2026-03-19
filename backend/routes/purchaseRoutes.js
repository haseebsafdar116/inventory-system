const express = require('express');
const router = express.Router();
const { createPurchase, getPurchases } = require('../controllers/purchaseController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/', authenticate, authorize(['Admin', 'Manager']), createPurchase);
router.get('/', authenticate, authorize(['Admin', 'Manager']), getPurchases);

module.exports = router;
