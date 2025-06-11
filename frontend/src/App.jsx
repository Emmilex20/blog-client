import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // Assuming you use HelmetProvider
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Contact from './pages/Contact';
import Login from './pages/Login'; // Assuming AdminLogin is handled by this Login component
import Signup from './pages/Signup';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword'; 
import PrivacyPolicy from './pages/PrivacyPolicy';
import ScrollToTop from './components/ScrollToTop'; 
import AboutPage from './pages/About';
import CategoryPage from './pages/Category';
import AllCategoriesPage from './pages/AllCategoriesPage';

// NEW IMPORTS FOR ADMIN DASHBOARD
import AdminDashboard from './pages/AdminDashboard'; // This replaces UserManagement as the main dashboard
import EditPost from './pages/EditPost'; // The component to edit a specific post

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <HelmetProvider> {/* Wrap your application with HelmetProvider */}
      
        <AuthProvider> {/* Wrap your routes with AuthProvider */}
          <div className="flex flex-col min-h-screen">
            <Navbar /> {/* Navbar can now access AuthContext via useAuth() */}
            <ThemeToggle />
            <main className="flex-grow">
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<PostDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin/login" element={<Login />} /> {/* Admin login route */}
                <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/categories" element={<AllCategoriesPage />} /> 

                {/* Protected routes for Admin */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Main dashboard */}
                  <Route path="/admin/create-post" element={<CreatePost />} /> {/* Renamed from /create for clarity */}
                  <Route path="/admin/edit-post/:id" element={<EditPost />} /> {/* Route for editing a specific post */}
                </Route>

                {/* Unauthorized Page */}
                <Route path="/unauthorized" element={
                  <div className="flex justify-center items-center min-h-[calc(100vh-160px)] text-red-600 text-2xl font-bold">
                    You are not authorized to view this page.
                  </div>
                } />

                {/* Catch-all for 404 (optional, but good practice) */}
                <Route path="*" element={
                  <div className="flex flex-col justify-center items-center min-h-[calc(100vh-160px)] text-center p-4">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                    <button onClick={() => window.history.back()} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                      Go Back
                    </button>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
    </HelmetProvider>
  );
}

export default App;