const Record = require('../models/Record');

// @desc    Create a new financial record
// @access  Private (Admin only)
const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;

    // Basic Validation
    if (!amount || !type || !category) {
      return res.status(400).json({ message: 'Amount, type, and category are required' });
    }

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      description,
      createdBy: req.user._id // Taken from the protect middleware
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all financial records (with optional filtering)
// @access  Private (Admin, Analyst, Viewer)
const getRecords = async (req, res) => {
  try {
    const { type, category } = req.query;
    
    // Build filter object based on query params
    let query = {};
    if (type) query.type = type;
    if (category) query.category = category;

    const records = await Record.find(query).sort({ date: -1 }).populate('createdBy', 'name email');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a financial record
// @access  Private (Admin only)
const updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a financial record
// @access  Private (Admin only)
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    await record.deleteOne();
    res.json({ message: 'Record removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord };