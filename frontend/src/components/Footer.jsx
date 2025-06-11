import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react'; // Import icons for a cleaner look

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-950 to-gray-800 text-gray-300 py-12 md:py-16 mt-20 shadow-2xl dark:shadow-inner">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-8 border-b border-gray-700/50 pb-10 mb-8">

          {/* About Section */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <h3 className="text-3xl font-extrabold text-blue-400 mb-5 tracking-wide">
              CodeWhiz Chronicles
            </h3>
            <p className="text-base leading-relaxed mb-4 text-gray-300">
              Your go-to source for insightful articles on <strong>tech</strong>, <strong>life</strong>, and <strong>code</strong>, curated from the vibrant heart of <strong>Lekki, Lagos</strong>. We're dedicated to bringing you fresh perspectives and practical advice to fuel your curiosity and growth.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-base font-semibold transition duration-300 ease-in-out transform hover:translate-x-1 hover:underline"
            >
              Learn More
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Link>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out relative group">
                  Home
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out relative group">
                  Blog
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out relative group">
                  Contact
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out relative group">
                  Privacy Policy
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social Media Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5 tracking-wide">Connect With Us</h3>
            <div className="space-y-3 mb-5">
              <p className="flex items-center text-base">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                Lekki, Lagos, Nigeria
              </p>
              <p className="flex items-center text-base">
                <Mail className="w-5 h-5 mr-2 text-blue-400" />
                <a href="mailto:aginaemmanuel6@gmail.com" className="text-blue-400 hover:text-blue-300 transition duration-300 ease-in-out hover:underline">
                  aginaemmanuel6@gmail.com
                </a>
              </p>
            </div>
            {/* Social Media Links with Icons */}
            <div className="flex space-x-5 mt-4">
              <a href="https://twitter.com/yourblog" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                <Twitter className="h-7 w-7" />
              </a>
              <a href="https://linkedin.com/in/yourblog" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                <Linkedin className="h-7 w-7" />
              </a>
              <a href="https://instagram.com/yourblog" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                <Instagram className="h-7 w-7" />
              </a>
              <a href="https://facebook.com/yourblog" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                <Facebook className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Info */}
        <div className="text-center text-sm pt-4 border-t border-gray-700/50 mt-4">
          &copy; {currentYear} CodeWhiz Chronicles. All rights reserved. Crafted with <span className="text-red-500 animate-pulse">❤️</span> in Lekki, Lagos.
        </div>
      </div>
    </footer>
  );
}