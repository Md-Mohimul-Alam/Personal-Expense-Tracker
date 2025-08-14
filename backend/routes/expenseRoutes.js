const express = require('express');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add Expense
router.post('/', authMiddleware, async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    const expense = new Expense({ title, amount, category, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense' });
  }
});

// Get All Expenses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

// Update Expense
router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;

  try {
    const expense = await Expense.findByIdAndUpdate(id, { title, amount, category, date }, { new: true });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense' });
  }
});

// Delete Expense
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await Expense.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense' });
  }
});

module.exports = router;
