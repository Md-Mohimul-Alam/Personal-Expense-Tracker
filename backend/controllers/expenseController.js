const Expense = require('../models/Expense');

// Add a new expense
exports.addExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;

  try {
    const expense = new Expense({
      title,
      amount,
      category,
      date,
      user: req.user.userId  // Associate expense with user
    });

    await expense.save();
    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error adding expense',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all expenses for authenticated user
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching expenses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;

  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.userId },  // Ensure the expense belongs to the user
      { title, amount, category, date },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedExpense
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating expense',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: id, 
      user: req.user.userId  // Ensure the expense belongs to the user
    });

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found or unauthorized'
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting expense',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
