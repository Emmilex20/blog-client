import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Simple Skeleton Loader Component
const PostCardSkeleton = () => (
  <div className="block bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden animate-pulse transition-colors duration-300">
    <div className="w-full h-48 bg-gray-300 dark:bg-gray-600"></div> {/* Image placeholder */}
    <div className="p-5">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div> {/* Category placeholder */}
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div> {/* Title line 1 */}
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-5/6 mb-4"></div> {/* Title line 2 */}
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div> {/* Description line 1 */}
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1 w-11/12"></div> {/* Description line 2 */}
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div> {/* Description line 3 */}
      <div className="flex justify-between items-center text-sm">
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div> {/* Date placeholder */}
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/5"></div> {/* Read More placeholder */}
      </div>
    </div>
  </div>
);

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page') || 1);
  const category = params.get('category') || '';
  const limit = 6;

  // Function to fetch posts, wrapped in useCallback for stability
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts?page=${page}&limit=${limit}&category=${category}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPosts(data.posts);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, category, limit]);

  // Function to fetch categories
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCategories(data.categories || data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategoriesError("Failed to load categories.");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Effect hook for fetching posts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Effect hook for fetching categories (runs only once on mount)
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(params);
    newParams.set('page', newPage);
    setParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (e) => {
    const newParams = new URLSearchParams(params);
    newParams.set('category', e.target.value);
    newParams.set('page', 1);
    setParams(newParams);
  };

  const handleRetry = () => {
    if (error) {
      fetchPosts();
    }
    if (categoriesError) {
      fetchCategories();
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>MyBlog – Latest Posts | Lekki, Lagos</title>
        <meta name="description" content="Browse the latest blog posts from MyBlog. Dive into articles on tech, life, and code, tailored for our community in Lekki, Lagos and beyond." />
      </Helmet>

      {/* Hero Section / Page Header */}
      <header className="text-center mb-12 py-8 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white rounded-lg shadow-xl transition-colors duration-300">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Explore Our Blog</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
          Your insights on tech, life, and code. Discover compelling stories and practical advice from Lekki, Lagos.
        </p>
      </header>

      {/* Category Filter and Search (if you add search later) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Recent Articles</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="category-select" className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">Filter by Category:</label>
          {categoriesLoading ? (
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse transition-colors duration-300"></div>
          ) : categoriesError ? (
            <div className="text-red-500 dark:text-red-400 text-sm">
              Categories failed to load.
            </div>
          ) : (
            <select
              id="category-select"
              value={category}
              onChange={handleCategoryChange}
              className="block w-full sm:w-auto py-2 px-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Loading, Error, or Empty States for Posts */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
          {[...Array(limit)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-lg text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-10 text-lg text-gray-600 dark:text-gray-300">
          No posts found for the selected criteria.
        </div>
      )}

      {/* Blog Posts Grid */}
      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link
              key={post._id}
              to={`/blog/${post._id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden border border-transparent dark:border-gray-700"
            >
              {/* Post Image (Conditional) */}
              {post.imageURL && (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={post.imageURL}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500 ease-in-out"
                    loading="lazy"
                  />
                </div>
              )}
              {/* Post Content */}
              <div className="p-5">
                {post.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 transition-colors duration-300">
                    {post.category}
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.content ? post.content.substring(0, 120) + '...' : 'No description available.'}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Read More &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-3">
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200"
          >
            &larr; Previous
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200
                ${pageNum === page
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}