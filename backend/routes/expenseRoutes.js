const express = require('express');
const { 
  addExpense, 
  getAllExpenses, 
  updateExpense, 
  deleteExpense 
} = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All expense routes require authentication
router.use(authMiddleware);

router.get('/', getAllExpenses);
router.post('/', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;