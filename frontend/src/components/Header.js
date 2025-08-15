import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../asset/logo.png'; 

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await logout();       
      navigate('/');     
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-teal-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-300">
            <img src={logo} alt="Logo" className="h-11 inline-block bg-white rounded-md " />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-4">
            {user && (
              <>
                <li>
                  <Link to="/expenses" className="hover:text-gray-300 hover:underline">
                    Expenses
                  </Link>
                </li>
                <li>
                  <Link to="/add" className="hover:text-gray-300 hover:underline">
                    Add Expense
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* User Profile / Logout */}
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">Welcome, {user.name || user.email}</span>
            <button 
              onClick={handleLogout}  // Use new handler
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-gray-300 hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300 hover:underline">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
