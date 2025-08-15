const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);