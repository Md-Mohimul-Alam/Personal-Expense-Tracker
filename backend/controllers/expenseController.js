const Expense = require('../models/Expense');

// Add a new expense
exports.addExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;

  try {
    const expense = new Expense({
      title,
      amount,
      category,
      date
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding expense' });
  }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching expenses' });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, amount, category, date },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating expense' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting expense' });
  }
};
