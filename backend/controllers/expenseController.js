const Expense = require('../models/Expense');
exports.addExpense = async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      user: req.user.id // Comes from your auth middleware
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      error: error.errors 
    });
  }
};
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }); // Only fetch expenses for the current user
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure the expense belongs to the user
      req.body,
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!expense) {
      return res.status(404).json({ 
        success: false,
        message: 'Expense not found or unauthorized'
      });
    }
    
    return res.json({
      success: true,
      message: 'Expense deleted successfully',
      data: {
        id: expense._id,
        title: expense.title
      }
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};