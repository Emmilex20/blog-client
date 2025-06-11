import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function EditPost() {
  const { id } = useParams(); // Post ID from URL
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    imageURL: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Fetch existing post data
  const fetchPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authFetch(`/api/posts/${id}`);
      setFormData({
        title: data.title || '',
        content: data.content || '',
        category: data.category || '',
        imageURL: data.imageURL || '',
      });
    } catch (err) {
      console.error('Error fetching post for edit:', err);
      setError('Failed to load post for editing: ' + (err.message || ''));
    } finally {
      setIsLoading(false);
    }
  }, [id, authFetch]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      await authFetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      alert('Post updated successfully!');
      navigate('/admin/dashboard'); // Redirect to dashboard after successful edit
    } catch (err) {
      console.error('Error updating post:', err);
      setSaveError('Failed to update post: ' + (err.message || ''));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen-minus-header bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <p className="text-xl text-gray-600 dark:text-gray-300 animate-pulse">Loading post data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen-minus-header text-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Post!</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{error}</p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-80px)] transition-colors duration-300">
      <Helmet>
        <title>Edit Post – MyBlog</title>
      </Helmet>

      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Edit Post</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl space-y-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div>
          <label htmlFor="title" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
            Content (Markdown):
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
            Category:
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
          />
        </div>

        <div>
          <label htmlFor="imageURL" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
            Image URL:
          </label>
          <input
            type="text"
            id="imageURL"
            name="imageURL"
            value={formData.imageURL}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
          />
          {formData.imageURL && (
            <div className="mt-4 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden transition-colors duration-300">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 px-4 py-2 bg-gray-50 dark:bg-gray-700">Image Preview:</p>
              <img src={formData.imageURL} alt="Preview" className="w-full h-48 object-cover rounded-b-lg shadow-sm" />
            </div>
          )}
        </div>

        {saveError && <p className="text-red-600 dark:text-red-400 text-sm">{saveError}</p>}

        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold rounded-lg shadow-md hover:bg-gray-400 dark:hover:bg-gray-700 transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}