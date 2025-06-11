// src/pages/AllCategoriesPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext'; // Make sure this path is correct

// Re-use SectionContainer for consistency
const SectionContainer = ({ title, children, className = "" }) => (
    <section className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 ${className}`}>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700 text-center">{title}</h2>
        {children}
    </section>
);

export default function AllCategoriesPage() {
    const { authFetch } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch enough posts to get all categories.
                // Consider a dedicated backend endpoint for categories if performance is an issue with many posts.
                const data = await authFetch('/posts?limit=1000'); // Increased limit for more categories
                const fetchedPosts = data.posts || [];

                const counts = {};
                fetchedPosts.forEach(post => {
                    const categoryName = post.category || 'Uncategorized';
                    // Ensure the slug generation matches how you store/expect slugs
                    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
                    if (!counts[slug]) {
                        counts[slug] = { name: categoryName, count: 0, slug: slug };
                    }
                    counts[slug].count++;
                });

                setCategories(Object.values(counts));
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories. Please try again.");
                setLoading(false);
            }
        };
        fetchCategories();
    }, [authFetch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                <p className="text-xl animate-pulse">Loading categories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-160px)] text-red-600 dark:text-red-400 p-4 bg-gray-50 dark:bg-gray-900">
                <p className="text-xl mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <Helmet>
                <title>All Blog Categories - MyBlog</title>
                <meta name="description" content="Browse all categories on MyBlog to find articles on various topics including Technology, Lifestyle, and Coding." />
            </Helmet>

            <SectionContainer title="Explore All Categories">
                {categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {categories.map(cat => (
                            <Link
                                key={cat.slug}
                                to={`/category/${cat.slug}`}
                                className="block p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 text-center text-gray-800 dark:text-gray-100"
                            >
                                <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{cat.count} Articles</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-xl text-gray-600 dark:text-gray-300">No categories found.</p>
                        <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Start adding posts to populate categories!</p>
                        <Link to="/create" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300">
                            Create First Post
                        </Link>
                    </div>
                )}
            </SectionContainer>
        </div>
    );
}