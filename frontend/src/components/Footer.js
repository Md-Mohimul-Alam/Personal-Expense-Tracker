import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../asset/logo.png';

const Footer = () => {
  return (
    <footer className="bg-teal-600 text-white shadow-md mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Logo" className="h-11 bg-white hover:rounded-md" />
            </Link>
            <p className="text-teal-100">
              Track and manage your expenses effortlessly with our intuitive expense tracker application.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-teal-100 hover:text-white hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/expenses" className="text-teal-100 hover:text-white hover:underline">
                  Expenses
                </Link>
              </li>
              <li>
                <Link to="/add" className="text-teal-100 hover:text-white hover:underline">
                  Add Expense
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-teal-100 hover:text-white hover:underline">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <address className="not-italic text-teal-100">
              <p>H-430, R-11, Block - F</p>
              <p>Bashundhara R/A, Dhaka </p>
              <p>Bangladesh </p>
              <p className="mt-2">Email: mohimreza1234@gmail.com</p>
              <p>Phone: +8801322004276</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-teal-500 mt-8 pt-6 text-center text-teal-100">
          <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;