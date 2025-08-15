import axios from 'axios';

const API_URL = 'http://localhost:5005/api/expenses';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Improved token decoder
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    console.error('Token decoding error:', e);
    return null;
  }
};

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
    console.error(`Error with ${method} request:`, error.response || error);
    
    let errorMessage = 'Something went wrong!';
    if (error.response) {
      errorMessage = error.response.data?.message || 
                   error.response.data?.error || 
                   error.response.statusText;
    } else if (error.request) {
      errorMessage = 'No response from server';
    }
    
    throw new Error(errorMessage);
  }
};

export const addExpense = async (expenseData, token) => {
  if (!token) throw new Error('Authentication token is required');
  
  const decoded = decodeToken(token);
  console.log('Decoded token:', decoded); // Debug log
  
  // Changed from decoded?.id to decoded?.userId
  if (!decoded?.userId) {
    throw new Error('Invalid or expired session. Please login again.');
  }

  return handleRequest('POST', '', expenseData, token);
};

export const getExpenses = async (token) => {
  try {
    const response = await handleRequest('GET', '', null, token);
    return Array.isArray(response) ? response : response?.data || [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
};

export const updateExpense = async (id, expenseData, token) => {
  if (!token) throw new Error('Authentication token is required');
  
  try {
    const config = {
      method: 'PATCH',
      url: `/${id}`,
      data: expenseData,
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw new Error(error.message || 'Failed to update expense');
  }
};
export const deleteExpense = async (id, token) => {
  if (!token) throw new Error('Authentication token is required');
  
  try {
    const config = {
      method: 'DELETE',
      url: `/${id}`,
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      responseType: 'json' // Explicitly set response type
    };
    
    const response = await api(config);
    
    // Handle cases where response.data might be empty
    if (!response.data) {
      return { success: true, message: 'Expense deleted' };
    }
    
    return response.data;
    
  } catch (error) {
    // Improved error handling
    if (error.response) {
      // Server responded with error status
      const serverError = error.response.data?.message || 
         error.response.statusText;
      throw new Error(serverError);
    } else if (error.request) {
      // Request was made but no response
      throw new Error('No response from server');
    } else {
      // Other errors
      throw new Error(error.message);
    }
  }
};