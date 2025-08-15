import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-teal-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-300">
            Expense Tracker
          </Link>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-4">
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
            {!user ? (
              <>
                <li>
                  <Link to="/" className="hover:text-gray-300 hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-gray-300 hover:underline">
                    Register
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
        </nav>

        {/* User Profile / Logout */}
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">Welcome, {user.name}</span>
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;