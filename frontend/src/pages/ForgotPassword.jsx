// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom'; // Import Link

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); // Clear previous messages
        setError('');   // Clear previous errors

        if (!email) {
            setError('Please enter your email address.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Backend might send a generic success message even on no user found,
                // but if there's a specific error, handle it here.
                throw new Error(data.message || 'Failed to send reset email.');
            }

            // Even if the email doesn't exist, we show a success message for security reasons
            setMessage(data.message || 'If an account exists for that email, a password reset link has been sent to your inbox.');
            setEmail(''); // Clear the email field

        } catch (err) {
            console.error('Forgot password request error:', err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
            <Helmet>
                <title>Forgot Password - MyBlog</title>
                <meta name="description" content="Request a password reset link for your MyBlog account." />
            </Helmet>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-none w-full max-w-md animate-fade-in-down border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
                    Forgot Your Password?
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                    Enter your email address below and we'll send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700 transition duration-200"
                            placeholder="you@example.com"
                        />
                    </div>
                    {message && <p className="text-green-600 dark:text-green-400 text-sm text-center">{message}</p>}
                    {error && <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>}
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
                                'Send Reset Link'
                            )}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Remembered your password?{' '}
                    <Link to="/admin/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}