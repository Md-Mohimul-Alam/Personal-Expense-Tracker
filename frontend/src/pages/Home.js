import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses } from '../services/expenseService';

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses(token); // Fetch expenses from the backend
        setExpenses(data);

        // Calculate the total expense amount
        const totalAmount = data.reduce((sum, expense) => sum + expense.amount, 0);
        setTotal(totalAmount);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Personal Expense Tracker</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Total Expenses: ${total.toFixed(2)}</h2>
          <Link
            to="/add"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add New Expense
          </Link>
        </div>

        {/* Expenses List */}
        {expenses.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-4">
            <table className="min-w-full table-auto">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id} className="border-b">
                    <td className="px-4 py-2">{expense.title}</td>
                    <td className="px-4 py-2">{expense.category}</td>
                    <td className="px-4 py-2">${expense.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-6">
            <p>No expenses recorded yet. Start adding your expenses!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
