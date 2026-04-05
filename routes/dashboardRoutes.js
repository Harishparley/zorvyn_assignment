const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route accessible ONLY to Admin and Analyst roles
router.get('/summary', protect, authorize('Admin', 'Analyst'), getDashboardSummary);

module.exports = router;