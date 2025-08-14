import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses';

// Add Expense
export const addExpense = async (expenseData, token) => {
  const response = await axios.post(API_URL, expenseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get All Expenses
export const getExpenses = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update Expense
export const updateExpense = async (id, expenseData, token) => {
  const response = await axios.patch(`${API_URL}/${id}`, expenseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete Expense
export const deleteExpense = async (id, token) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
