import axios from 'axios';

const API_URL = 'http://localhost:5005/api/expenses';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const handleRequest = async (method, endpoint = '', data = null, token = null) => {
  try {
    const config = {
      method,
      url: endpoint,
      data,
      headers: token ? { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {}
    };
    
    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error(`Error with ${method} request:`, error.response || error.message);
    
    let errorMessage = 'Something went wrong!';
    if (error.response) {
      // Server responded with a status code outside 2xx
      errorMessage = error.response.data?.message || error.response.statusText;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'No response from server';
    }
    
    throw new Error(errorMessage);
  }
};


// API functions
export const addExpense = async (expenseData, token) => {
  return handleRequest('POST', '', expenseData, token);
};

export const getExpenses = async (token) => {
  return handleRequest('GET', '', null, token);
};

export const updateExpense = async (id, expenseData, token) => {
  return handleRequest('PATCH', `/${id}`, expenseData, token);
};

export const deleteExpense = async (id, token) => {
  return handleRequest('DELETE', `/${id}`, null, token);
};