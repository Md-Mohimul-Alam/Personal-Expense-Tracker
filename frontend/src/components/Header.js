import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
              <Link to="/" className="hover:text-gray-300 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/add" className="hover:text-gray-300 hover:underline">
                Add Expense
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gray-300 hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-gray-300  hover:underline">
                Register
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Profile / Logout (Optional) */}
        {/* Example: If user is logged in */}
        <div className="hidden sm:flex sm:items-center">
          <button className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
