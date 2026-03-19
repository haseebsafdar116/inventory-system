const express = require('express');
const router = express.Router();
const { exportInventoryCSV, exportSalesCSV } = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/inventory', authenticate, authorize(['Admin', 'Manager']), exportInventoryCSV);
router.get('/sales', authenticate, authorize(['Admin', 'Manager']), exportSalesCSV);

module.exports = router;
