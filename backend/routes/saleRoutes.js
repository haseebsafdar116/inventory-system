const express = require('express');
const router = express.Router();
const { createSale, getSales } = require('../controllers/saleController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, createSale);
router.get('/', authenticate, getSales);

module.exports = router;
