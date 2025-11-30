import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'; 
import AddExpense from './pages/AddExpenseForm'; 
import Login from './pages/LoginForm';
import Register from './pages/RegisterForm'; 
import ExpenseList from './pages/ExpenseList';
import { AuthProvider, useAuth } from './context/AuthContext';
import Footer from './components/Footer';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

// Public Route Component (redirect to expenses if already logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/expenses" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex flex-col">
          <Header />
          <main className="flex-1 py-8">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/expenses" 
                element={
                  <ProtectedRoute>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <ExpenseList />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add" 
                element={
                  <ProtectedRoute>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <AddExpense />
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Analytics Route (if you have one) */}
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h2>
                        <p className="text-gray-600">Analytics dashboard coming soon...</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* About Route */}
              <Route 
                path="/about" 
                element={
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-6">
                        About ExpenseTracker
                      </h2>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 mb-4">
                          ExpenseTracker is a powerful and intuitive application designed to help you take control of your finances. 
                          Track your expenses, analyze your spending patterns, and make informed financial decisions.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          <div className="bg-teal-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-teal-800 mb-3">Features</h3>
                            <ul className="text-gray-700 space-y-2">
                              <li>• Easy expense tracking</li>
                              <li>• Category-based organization</li>
                              <li>• Real-time analytics</li>
                              <li>• Secure data storage</li>
                              <li>• Multi-device sync</li>
                            </ul>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3">Benefits</h3>
                            <ul className="text-gray-700 space-y-2">
                              <li>• Better financial awareness</li>
                              <li>• Identify spending patterns</li>
                              <li>• Set and track budgets</li>
                              <li>• Achieve savings goals</li>
                              <li>• Peace of mind</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                } 
              />
              
              {/* 404 Catch-all Route */}
              <Route 
                path="*" 
                element={
                  <div className="max-w-md mx-auto px-4 py-16 text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                      <button 
                        onClick={() => window.history.back()}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 font-semibold"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;