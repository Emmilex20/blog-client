import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // Import Helmet for meta tags

export default function AdminLogin() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const navigate = useNavigate();

  function login(e) {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    })
    .then(res => {
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    })
    .then(data => {
      localStorage.setItem('token', data.token);
      navigate('/admin-dashboard'); // Redirect to admin dashboard after successful login
    })
    .catch(err => alert(err.message));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Helmet>
        <title>Admin Login – MyBlog</title>
        <meta name="description" content="Admin login page for MyBlog dashboard." />
      </Helmet>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Admin Login</h1>
        <form onSubmit={login} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={u}
              onChange={e => setU(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={p}
              onChange={e => setP(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}