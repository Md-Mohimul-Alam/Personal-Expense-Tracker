import { useState } from 'react';
import PropTypes from 'prop-types';
import { addExpense } from '../services/expenseService';

const AddExpenseForm = ({ onAddExpense = () => {} }) => {
  const [expense, setExpense] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setExpense({
      title: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
    setSuccess(false);
  };

  const validateForm = () => {
    if (!expense.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!expense.amount || expense.amount <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }
    if (!expense.category) {
      setError('Category is required');
      return false;
    }
    if (!expense.date) {
      setError('Date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const newExpense = await addExpense({
        ...expense,
        amount: parseFloat(expense.amount)
      }, token);

      onAddExpense(newExpense);
      setSuccess(true);
      setTimeout(resetForm, 2000);
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error.response?.data?.message || 
               error.message || 
               'Failed to add expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { value: 'Food', icon: '🍔', color: 'bg-blue-500' },
    { value: 'Transport', icon: '🚗', color: 'bg-green-500' },
    { value: 'Shopping', icon: '🛍️', color: 'bg-purple-500' },
    { value: 'Entertainment', icon: '🎬', color: 'bg-yellow-500' },
    { value: 'Utilities', icon: '💡', color: 'bg-red-500' },
    { value: 'Others', icon: '📦', color: 'bg-gray-500' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-white to-teal-50 p-8 rounded-2xl shadow-xl border border-teal-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
            Add New Expense
          </h2>
          <p className="text-gray-600 mt-2">Track your spending effortlessly</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Field */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Expense Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={expense.title}
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                placeholder="Dinner with friends"
                maxLength={50}
              />
            </div>

            {/* Amount Field */}
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Amount (USD) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 text-lg">$</span>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={expense.amount}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={expense.category}
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-gray-400">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value} className="flex items-center">
                    {cat.icon} {cat.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Field */}
            <div className="md:col-span-2">
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={expense.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-sm animate-bounce-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700 font-medium">Expense added successfully!</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 text-white font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/30 flex items-center justify-center shadow-lg ${
                isLoading 
                  ? 'bg-teal-400 cursor-not-allowed transform scale-95' 
                  : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 hover:shadow-xl hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Expense...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

AddExpenseForm.propTypes = {
  onAddExpense: PropTypes.func
};

export default AddExpenseForm;