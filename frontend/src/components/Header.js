import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../asset/logo.png'; 

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();       
      navigate('/');     
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/expenses', label: 'Expenses' },
    { path: '/add', label: 'Add Expense' },
    { path: '/analytics', label: 'Analytics' }
  ];

  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/" 
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={logo} 
                alt="Expense Tracker Logo" 
                className="h-12 bg-white p-1 rounded-lg shadow-md" 
              />
            </Link>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                ExpenseTracker
              </h1>
              <p className="text-teal-200 text-xs">Smart Financial Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {user && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActiveLink(link.path)
                    ? 'bg-white text-teal-700 shadow-md'
                    : 'hover:bg-teal-500 hover:text-white hover:shadow-md'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Profile / Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Desktop User Info */}
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {user.name || user.email.split('@')[0]}
                    </p>
                    <p className="text-teal-200 text-sm">
                      Welcome back!
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="font-bold text-white">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg bg-teal-500 hover:bg-teal-400 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/" 
                  className="px-6 py-2 rounded-full border-2 border-teal-400 text-teal-100 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-300 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 rounded-full bg-white text-teal-700 hover:bg-teal-100 hover:shadow-md transition-all duration-300 font-medium shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && user && (
          <div className="md:hidden mt-4 bg-teal-500 rounded-lg shadow-lg p-4 animate-slideDown">
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-teal-400">
              <div className="w-8 h-8 bg-teal-300 rounded-full flex items-center justify-center">
                <span className="font-bold text-teal-700 text-sm">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">{user.name || user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActiveLink(link.path)
                      ? 'bg-white text-teal-700 shadow-md'
                      : 'hover:bg-teal-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors duration-300 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Add this to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;