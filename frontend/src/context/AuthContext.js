import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/auth/me');
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to fetch user data', error);
      logout();
    }
  }, []); // Add any dependencies here if needed

  useEffect(() => {
    if (token) {
      axios.defaults.headers['Authorization'] = `Bearer ${token}`;
      // If we have a token but no user data, fetch user info
      if (!user) {
        fetchUserData();
      }
    }
  }, [token, user, fetchUserData]); // Added all dependencies

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};