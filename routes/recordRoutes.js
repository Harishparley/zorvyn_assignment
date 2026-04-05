const express = require('express');
const router = express.Router();
const { createRecord, getRecords, updateRecord, deleteRecord } = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET route is accessible by all authenticated roles
router.get('/', protect, getRecords);

// POST, PUT, DELETE are strictly for Admins
router.post('/', protect, authorize('Admin'), createRecord);
router.put('/:id', protect, authorize('Admin'), updateRecord);
router.delete('/:id', protect, authorize('Admin'), deleteRecord);

module.exports = router;