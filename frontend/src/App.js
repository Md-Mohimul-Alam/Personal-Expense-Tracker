import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import AddExpense from './pages/AddExpenseForm'; 
import Login from './pages/LoginForm';
import Register from './pages/RegisterForm'; 
import ExpenseList from './pages/ExpenseList';
import { AuthProvider } from './context/AuthContext';
import './index.css';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;
