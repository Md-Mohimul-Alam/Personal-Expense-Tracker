import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getExpenses, deleteExpense, updateExpense } from '../services/expenseService';
import { format } from 'date-fns';

const ExpenseList = ({ onDeleteExpense = () => {}, refreshTrigger }) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  });
  const [isSaving, setIsSaving] = useState(false);

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
      
      setExpenses(prev => prev.filter(exp => exp._id !== id));
      setSuccessMessage('Expense deleted successfully');
      onDeleteExpense();
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message || 'Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (expense) => {
    setEditingId(expense._id);
    setEditingExpense(expense);
    setEditFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date.split('T')[0]
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateExpense = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const updatedExpense = {
        ...editFormData,
        amount: parseFloat(editFormData.amount),
        date: new Date(editFormData.date).toISOString()
      };

      await updateExpense(editingExpense._id, updatedExpense, token);

      setExpenses(prev => prev.map(exp => 
        exp._id === editingExpense._id ? { ...exp, ...updatedExpense } : exp
      ));

      setSuccessMessage('Expense updated successfully');
      setIsEditModalOpen(false);
      setEditingId(null);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message || 'Failed to update expense');
    } finally {
      setIsSaving(false);
    }
  };

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
      Food: 'bg-blue-100 text-blue-800 border-blue-200',
      Transport: 'bg-green-100 text-green-800 border-green-200',
      Shopping: 'bg-purple-100 text-purple-800 border-purple-200',
      Entertainment: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Utilities: 'bg-red-100 text-red-800 border-red-200',
      Others: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: '🍔',
      Transport: '🚗',
      Shopping: '🛍️',
      Entertainment: '🎬',
      Utilities: '💡',
      Others: '📦'
    };
    return icons[category] || '📝';
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesFilter = filter === 'all' || expense.category === filter;
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categories = [
    { value: 'all', label: 'All Categories', count: expenses.length },
    { value: 'Food', label: 'Food', count: expenses.filter(e => e.category === 'Food').length },
    { value: 'Transport', label: 'Transport', count: expenses.filter(e => e.category === 'Transport').length },
    { value: 'Shopping', label: 'Shopping', count: expenses.filter(e => e.category === 'Shopping').length },
    { value: 'Entertainment', label: 'Entertainment', count: expenses.filter(e => e.category === 'Entertainment').length },
    { value: 'Utilities', label: 'Utilities', count: expenses.filter(e => e.category === 'Utilities').length },
    { value: 'Others', label: 'Others', count: expenses.filter(e => e.category === 'Others').length }
  ];

  if (isLoading && expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-teal-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-lg font-medium">Loading your expenses...</p>
          <p className="text-gray-400 text-sm mt-2">Getting everything ready for you</p>
        </div>
      </div>
    );
  }

  if (error && expenses.length === 0) {
    return (
      <div className="p-8 bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-lg border border-red-100 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={fetchExpenses}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
        >
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  if (filteredExpenses.length === 0 && expenses.length > 0) {
    return (
      <div className="p-12 text-center bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-lg border border-yellow-100">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-yellow-800 mb-3">No matching expenses found</h3>
        <p className="text-yellow-600 mb-6 max-w-md mx-auto">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
        <button 
          onClick={() => { setSearchTerm(''); setFilter('all'); }}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="p-12 text-center bg-gradient-to-br from-teal-50 to-white rounded-2xl shadow-lg border border-teal-100">
        <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-teal-800 mb-3">No expenses yet</h3>
        <p className="text-teal-600 mb-8 max-w-md mx-auto">
          Start tracking your expenses to gain insights into your spending habits and take control of your finances.
        </p>
        <Link 
          to="/add"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl transition-all duration-300 hover:shadow-xl transform hover:scale-105 font-semibold"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Your First Expense
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
            Expense History
          </h2>
          <p className="text-gray-600 mt-1">Track and manage your spending</p>
        </div>
        <Link 
          to="/add"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 font-semibold shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </Link>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold mt-1">{filteredExpenses.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Amount</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">This Month</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(expenses
                  .filter(exp => new Date(exp.date).getMonth() === new Date().getMonth())
                  .reduce((sum, exp) => sum + exp.amount, 0)
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Categories</p>
              <p className="text-2xl font-bold mt-1">
                {new Set(expenses.map(exp => exp.category)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-3">
              Search Expenses
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                id="search"
                placeholder="Search by title or category..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter */}
          <div>
            <label htmlFor="filter" className="block text-sm font-semibold text-gray-700 mb-3">
              Filter by Category
            </label>
            <select
              id="filter"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white shadow-sm appearance-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quick Actions
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => { setSearchTerm(''); setFilter('all'); }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 hover:shadow-md text-sm font-medium"
              >
                Clear All
              </button>
              <button
                onClick={fetchExpenses}
                className="flex-1 px-4 py-3 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-xl transition-all duration-300 hover:shadow-md text-sm font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl shadow-sm animate-bounce-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'Expense' : 'Expenses'} Found
            </h3>
            <div className="text-lg font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              Total: {formatCurrency(totalAmount)}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Expense
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr 
                  key={expense._id} 
                  className="hover:bg-gradient-to-r hover:from-teal-50 hover:to-white transition-all duration-300 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-teal-200 transition-colors duration-300">
                        <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors duration-300">
                          {expense.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          Added {format(new Date(expense.createdAt || expense.date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(expense.category)}`}>
                      <span className="mr-1">{getCategoryIcon(expense.category)}</span>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{formatDate(expense.date)}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditClick(expense)}
                      disabled={editingId === expense._id}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(expense._id)}
                      disabled={deletingId === expense._id}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      {deletingId === expense._id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                  Edit Expense
                </h3>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateExpense();
              }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-amount" className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      id="edit-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white"
                      value={editFormData.amount}
                      onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-category" className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="edit-category"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white appearance-none cursor-pointer"
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Food">🍔 Food</option>
                      <option value="Transport">🚗 Transport</option>
                      <option value="Shopping">🛍️ Shopping</option>
                      <option value="Entertainment">🎬 Entertainment</option>
                      <option value="Utilities">💡 Utilities</option>
                      <option value="Others">📦 Others</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-date" className="block text-sm font-semibold text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      id="edit-date"
                      type="date"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingId(null);
                    }}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-sm text-sm font-semibold transition-all duration-300 hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm animate-shake">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
            <button 
              onClick={() => {
                setError(null);
                fetchExpenses();
              }}
              className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors duration-200 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

ExpenseList.propTypes = {
  onDeleteExpense: PropTypes.func,
  refreshTrigger: PropTypes.any
};

export default ExpenseList;