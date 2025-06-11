// src/main.jsx (or src/index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // This is the ONLY place for BrowserRouter
import { HelmetProvider } from 'react-helmet-async'; // Imported for Helmet
import { AuthProvider } from './context/AuthContext'; // Import your AuthProvider
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* The single BrowserRouter instance */}
      <HelmetProvider> {/* HelmetProvider should wrap your entire app */}
        <AuthProvider> {/* AuthProvider should also wrap your entire app */}
           <ThemeProvider>
          <App />
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
);