import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function Login() {
    const [formData, setFormData] = useState({
        username: '', // This state holds the value from the input field
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth(); // Get login function from context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Frontend validation (good practice to have this)
        if (!formData.username || !formData.password) {
            setError('Username/Email and password are required.');
            setLoading(false);
            return; // Stop execution if validation fails
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // The backend's authController expects 'loginIdentifier'
                    // We map the 'username' from our formData to 'loginIdentifier' for the API request.
                    loginIdentifier: formData.username,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If the backend sends an error response (e.g., 400, 401),
                // the 'message' field from the backend will be used.
                throw new Error(data.message || 'Login failed. Please try again.');
            }

            // Use the login function from AuthContext
            login(data.token, data.user);
            navigate('/'); // Redirect to homepage or dashboard after successful login

        } catch (err) {
            // Catch network errors or errors thrown from the response.ok check
            setError(err.message || 'An unexpected error occurred during login. Check your network.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
            <Helmet>
                <title>Login - MyBlog</title>
                <meta name="description" content="Log in to your MyBlog account to manage your blog content." />
            </Helmet>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-none w-full max-w-md animate-fade-in-down border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
                    Log In to Your Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username" // Keep name as 'username' for handleChange
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 transition duration-200"
                            placeholder="Enter your username or email" // Update placeholder
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            {/* Forgot Password Link */}
                            <Link
                                to="/forgot-password" // This route needs to be defined in your router
                                className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition duration-300"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 transition duration-200"
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <p className="text-red-600 dark:text-red-400 text-sm text-center mt-4">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
}