// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { token } = useParams(); // Get the reset token from the URL
    const navigate = useNavigate();

    useEffect(() => {
        // Basic check if the token exists in the URL
        if (!token) {
            setErrorMessage('Invalid reset link: No token provided.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        if (!token) {
            setErrorMessage('Invalid reset link: Token is missing.');
            setLoading(false);
            return;
        }

        if (!password || !confirmPassword) {
            setErrorMessage('Please enter and confirm your new password.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setPassword(''); // Clear fields for security
            setConfirmPassword('');
            setLoading(false);
            return;
        }

        // Add client-side password strength validation if desired (e.g., min length)
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/auth/reset-password/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If the backend sends an error, use its message
                throw new Error(data.message || 'Failed to reset password. The link may be invalid or expired.');
            }

            setSuccessMessage(data.message || 'Your password has been reset successfully! Redirecting to login...');
            setPassword(''); // Clear inputs on success
            setConfirmPassword('');

            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/admin/login'); // Or wherever your login page is
            }, 3000); // Redirect after 3 seconds

        } catch (err) {
            console.error('Password reset error:', err);
            setErrorMessage(err.message || 'An unexpected error occurred during password reset. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Render a different message if the token is initially missing
    if (errorMessage && errorMessage.includes('No token provided')) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
                <Helmet>
                    <title>Invalid Link - MyBlog</title>
                </Helmet>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-none w-full max-w-md text-center border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <h2 className="text-3xl font-extrabold text-red-600 dark:text-red-400 mb-6">Invalid Reset Link</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{errorMessage}</p>
                    <Link to="/admin/login" className="mt-4 inline-block font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
            <Helmet>
                <title>Reset Password - MyBlog</title>
                <meta name="description" content="Reset your MyBlog account password." />
            </Helmet>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-none w-full max-w-md animate-fade-in-up border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
                    Reset Your Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700 transition duration-200"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700 transition duration-200"
                            placeholder="Confirm new password"
                        />
                    </div>
                    {successMessage && <p className="text-green-600 dark:text-green-400 text-sm text-center">{successMessage}</p>}
                    {errorMessage && <p className="text-red-600 dark:text-red-400 text-sm text-center">{errorMessage}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={loading || !!errorMessage.includes('No token provided')} // Disable if token missing
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Remembered your password?{' '}
                    <Link to="/admin/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}