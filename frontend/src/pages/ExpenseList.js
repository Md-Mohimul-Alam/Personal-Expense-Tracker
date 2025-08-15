import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getExpenses, deleteExpense } from '../services/expenseService';
import { format } from 'date-fns';

const ExpenseList = ({ onDeleteExpense = () => {}, refreshTrigger }) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await getExpenses(token);
      const expensesData = Array.isArray(response) ? response : response?.data || [];
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError(error.message || 'Failed to load expenses. Please try again.');
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      await deleteExpense(id, token);
      
      // Update UI after successful deletion
      setExpenses(prev => prev.filter(exp => exp._id !== id));
      setSuccessMessage('Expense deleted successfully');
      onDeleteExpense();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message || 'Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

  // Helper functions remain the same
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-blue-100 text-blue-800',
      Transport: 'bg-green-100 text-green-800',
      Shopping: 'bg-purple-100 text-purple-800',
      Entertainment: 'bg-yellow-100 text-yellow-800',
      Utilities: 'bg-red-100 text-red-800',
      Others: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Filter and search functionality
  const filteredExpenses = expenses.filter(expense => {
    const matchesFilter = filter === 'all' || expense.category === filter;
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Loading and empty states remain the same
  if (isLoading && expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <p className="text-gray-500">Loading your expenses...</p>
      </div>
    );
  }

  if (error && expenses.length === 0) {
    return (
      <div className="p-6 bg-red-50 rounded-xl shadow-sm">
        <div className="flex flex-col items-center text-center space-y-3">
          <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800">{error}</h3>
          <button 
            onClick={fetchExpenses}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (filteredExpenses.length === 0 && expenses.length > 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No matching expenses</h3>
        <p className="mt-1 text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No expenses yet</h3>
        <p className="mt-1 text-gray-500">
          Get started by adding your first expense.
        </p>
      </div>
    );
  }

  return (
   <div className="space-y-6">
      <div className="relative flex justify-between items-center w-full ml-10 pl-10 left-10 top-5 ">
        <div className="flex space-x-4 w-full ml-10 pl-10 left-10 top-10 inset-x-0 pb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mr-4 left-10 ml-10 ">
            <div className="flex items-center mb-3 md:mb-0 mr-4">
              <svg className="h-8 w-8 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-teal-800">Expense History</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto ml-10">
              <div className="relative flex-grow ml-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search expenses..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="block w-full pl-3 pr-10 py-2 ml-10 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </div>
      </div>



      {/* Success message */}
      {successMessage && (
        <div className="p-4 bg-green-50 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-white overflow-hidden shadow rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {filteredExpenses.length} {filteredExpenses.length === 1 ? 'Expense' : 'Expenses'}
          </h3>
          <div className="text-lg font-semibold text-teal-600">
            Total: {formatCurrency(totalAmount)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900 font-medium">
                      {formatCurrency(expense.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(expense.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(expense._id)}
                      disabled={deletingId === expense._id}
                      className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {deletingId === expense._id ? (
                        <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <span className="flex items-center">
                          <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </span>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
          <button 
            onClick={() => {
              setError(null);
              fetchExpenses();
            }}
            className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

ExpenseList.propTypes = {
  onDeleteExpense: PropTypes.func,
  refreshTrigger: PropTypes.any
};

export default ExpenseList;