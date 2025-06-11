// src/pages/AllCategoriesPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Import the useAuth hook from your AuthContext
import { useAuth } from '../context/AuthContext'; // <--- CRITICAL CHANGE HERE

// Re-use SectionContainer for consistency
const SectionContainer = ({ title, children, className = "" }) => (
    <section className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${className}`}>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 border-b pb-4 border-gray-200 text-center">{title}</h2>
        {children}
    </section>
);

export default function AllCategoriesPage() {
    // Destructure authFetch from the useAuth hook
    const { authFetch } = useAuth(); // <--- GET authFetch FROM CONTEXT
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                // Use the authFetch from context for the API call
                const data = await authFetch('/posts?limit=100'); // Fetch enough posts to get all categories
                const fetchedPosts = data.posts || [];

                const counts = {};
                fetchedPosts.forEach(post => {
                    const categoryName = post.category || 'Uncategorized';
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
                // The authFetch itself will handle 401 and redirect.
                // For other errors, display a user-friendly message.
                setError("Failed to load categories. Please try again.");
                setLoading(false);
            }
        };
        // Add authFetch to the dependency array, similar to Home.jsx
        fetchCategories();
    }, [authFetch]); // <--- IMPORTANT: Add authFetch to dependency array

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
                <p className="text-xl text-gray-600 animate-pulse">Loading categories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-160px)] text-red-600 p-4">
                <p className="text-xl mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
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
                                className="block p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 text-center"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{cat.name}</h3>
                                <p className="text-gray-600 text-sm">{cat.count} Articles</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-xl text-gray-600">No categories found.</p>
                        <p className="text-md text-gray-500 mt-2">Start adding posts to populate categories!</p>
                        <Link to="/create" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            Create First Post
                        </Link>
                    </div>
                )}
            </SectionContainer>
        </div>
    );
}