import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../services/expenseService';

const ExpenseList = ({ onDeleteExpense }) => {
  const [expenses, setExpenses] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenses = await getExpenses(token);
        setExpenses(expenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id, token);
      onDeleteExpense(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div>
      <h2>Total Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>
            {expense.title} - ${expense.amount} - {expense.category}{' '}
            <button onClick={() => handleDelete(expense._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
