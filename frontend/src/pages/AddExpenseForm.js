import { useState } from 'react';
import { addExpense } from '../services/expenseService';

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!expense.title || !expense.amount || !expense.category || !expense.date) {
      setError('All fields are required!');
      return;
    }

    setIsLoading(true);
    setError(null);  // Reset previous error messages

    try {
      const newExpense = await addExpense(expense, token);
      onAddExpense(newExpense);
      setSuccess(true);
      setExpense({ title: '', amount: '', category: '', date: '' });  // Reset form
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error.message || 'An error occurred while adding the expense.');
    } finally {
      setIsLoading(false);  // Reset loading state
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={expense.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
              placeholder="Dinner with friends"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={expense.amount}
                onChange={handleChange}
                required
                className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={expense.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 appearance-none bg-white"
            >
              <option value="" disabled>Select a category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={expense.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Show error message */}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        {/* Show success message */}
        {success && <div className="text-green-500 text-sm mt-2">Expense added successfully!</div>}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 ${isLoading ? 'bg-teal-300' : 'bg-teal-600'} hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center justify-center`}
          >
            {isLoading ? 'Adding...' : (
              <>
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Expense
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseForm;
