import { useState } from 'react';
import { addExpense } from '../services/expenseService';

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
  });

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const newExpense = await addExpense(expense, token);
      onAddExpense(newExpense);
      setExpense({ title: '', amount: '', category: '', date: '' });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={expense.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <input
        type="number"
        name="amount"
        value={expense.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
      />
      <select
        name="category"
        value={expense.category}
        onChange={handleChange}
        required
      >
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Shopping">Shopping</option>
        <option value="Others">Others</option>
      </select>
      <input
        type="date"
        name="date"
        value={expense.date}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default AddExpenseForm;
