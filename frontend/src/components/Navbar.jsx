import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook
import { Sun, Moon } from 'lucide-react'; // Make sure lucide-react is installed (npm install lucide-react or yarn add lucide-react)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, userRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Use the theme and toggleTheme from context

  const checkHasRole = (roleToCheck) => {
    return user && user.role === roleToCheck;
  };

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 fixed top-0 w-full z-50 transition-all duration-300 ease-in-out shadow-xl dark:shadow-2xl dark:shadow-gray-800/50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo - Replaced text with image, added a subtle text fallback for accessibility/SEO if image fails */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl md:text-3xl font-extrabold text-blue-600 hover:text-blue-800 transition duration-300 transform hover:scale-105 dark:text-blue-400 dark:hover:text-blue-500"
          >
            <img src="/logo.png" alt="MyBlog Logo" className="h-8 md:h-10 w-auto" />
            <span className="hidden sm:inline">CodeWhiz Chronicles</span> {/* MyBlog text visible on larger screens */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-7 items-center">
            {/* Desktop Links with Enhanced Hover Effects */}
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group dark:text-gray-300 dark:hover:text-blue-400 transform hover:scale-105"
            >
              Home
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group dark:text-gray-300 dark:hover:text-blue-400 transform hover:scale-105"
            >
              Blog
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group dark:text-gray-300 dark:hover:text-blue-400 transform hover:scale-105"
            >
              Contact Us
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>

            {checkHasRole('admin') && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group dark:text-gray-300 dark:hover:text-blue-400 transform hover:scale-105"
                >
                  Dashboard
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
                <Link
                  to="/admin/create-post"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 relative group dark:text-gray-300 dark:hover:text-blue-400 transform hover:scale-105"
                >
                  Create Post
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </>
            )}

            {/* Theme Toggle Button for Desktop */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transform hover:scale-110 active:scale-95"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {!isAuthenticated ? (
              <Link
                to="/admin/login"
                className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105 active:scale-95 text-sm"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="px-6 py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300 shadow-md transform hover:scale-105 active:scale-95 text-sm"
              >
                Logout ({userRole})
              </button>
            )}
          </div>

          {/* Mobile Navigation - Hamburger Icon & Theme Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="mr-2 p-2 rounded-full text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transform hover:scale-110 active:scale-95"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>

            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-md p-2 transition duration-300 transform hover:scale-110 active:scale-95 dark:text-gray-300 dark:hover:text-blue-400 dark:focus:ring-blue-400/50"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu with enhanced slide-in animation */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-xl dark:shadow-2xl dark:shadow-gray-800/50 py-4 transition-all duration-300 ease-in-out transform ${
            isOpen ? 'scale-y-100 opacity-100 visible' : 'scale-y-0 opacity-0 invisible'
          } origin-top`}
        >
          <div className="flex flex-col items-center space-y-4 px-4">
            {/* Mobile Links with Hover effects */}
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 text-lg font-medium w-full text-center py-3 border-b border-gray-100 last:border-b-0 transition duration-200 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-blue-600 text-lg font-medium w-full text-center py-3 border-b border-gray-100 last:border-b-0 transition duration-200 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 text-lg font-medium w-full text-center py-3 border-b border-gray-100 last:border-b-0 transition duration-200 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>

            {checkHasRole('admin') && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600 text-lg font-medium w-full text-center py-3 border-b border-gray-100 last:border-b-0 transition duration-200 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:border-gray-700 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/create-post"
                  className="text-gray-700 hover:text-blue-600 text-lg font-medium w-full text-center py-3 border-b border-gray-100 last:border-b-0 transition duration-200 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:border-gray-700 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  Create Post
                </Link>
              </>
            )}

            {!isAuthenticated ? (
              <Link
                to="/admin/login"
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 shadow-md w-full text-center mt-4 text-base"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300 shadow-md w-full text-center mt-4 text-base"
              >
                Logout ({userRole})
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer div to push content below the fixed navbar */}
      <div className="pt-16 md:pt-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300"></div>
    </>
  );
}