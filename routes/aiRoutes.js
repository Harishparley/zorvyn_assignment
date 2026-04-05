const express = require('express');
const router = express.Router();
const { getAiAdvice } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only Admins and Analysts should get financial advice
router.get('/advisor', protect, authorize('Admin', 'Analyst'), getAiAdvice);

module.exports = router;