const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const ExpenseController = require('../controllers/expenseController.js');

const router = express.Router();

// Validation rules for expense
const expenseValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Invalid date format').toDate()
];

// Validation rule for 'id' in URL parameters
const idValidationRule = [
  param('id').isMongoId().withMessage('Invalid expense ID')
];

// Add Expense
router.post(
  '/', 
  authMiddleware,  // Ensure the user is authenticated
  expenseValidationRules, 
  validateRequest,  // Validate the request body
  ExpenseController.addExpense
);

// Get All Expenses (for authenticated user)
router.get(
  '/', 
  authMiddleware,  // Ensure the user is authenticated
  ExpenseController.getAllExpenses
);

// Update Expense
router.patch(
  '/:id', 
  authMiddleware,  // Ensure the user is authenticated
  [...idValidationRule, ...expenseValidationRules], 
  validateRequest,  // Validate the request body and parameters
  ExpenseController.updateExpense
);

// Delete Expense
router.delete(
  '/:id', 
  authMiddleware,  // Ensure the user is authenticated
  idValidationRule,  // Validate the 'id' parameter
  validateRequest,  // Validate the request parameters
  ExpenseController.deleteExpense
);

module.exports = router;
