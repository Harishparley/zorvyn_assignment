const Record = require('../models/Record');

// @desc    Get dashboard financial summary
// @access  Private (Admin, Analyst)
const getDashboardSummary = async (req, res) => {
  try {
    // 1. Calculate Total Income and Total Expenses
    const totals = await Record.aggregate([
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach(item => {
      if (item._id === 'income') totalIncome = item.totalAmount;
      if (item._id === 'expense') totalExpense = item.totalAmount;
    });

    const netBalance = totalIncome - totalExpense;

    // 2. Calculate Category-wise Totals
    const categoryTotals = await Record.aggregate([
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          totalAmount: 1
        }
      },
      { $sort: { totalAmount: -1 } } // Sort by highest amount first
    ]);

    // 3. Send the structured response
    res.json({
      success: true,
      data: {
        overview: {
          totalIncome,
          totalExpense,
          netBalance
        },
        categoryBreakdown: categoryTotals
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardSummary };