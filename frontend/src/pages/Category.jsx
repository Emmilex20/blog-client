// src/pages/CategoryPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';

// Import the useAuth hook from your AuthContext
import { useAuth } from '../context/AuthContext';

// --- Reusable Components (ensure these are available or imported from a common place) ---

// Helper for a default image if none is provided
const defaultImage = (text = 'Blog Post Image') => `https://via.placeholder.com/600x400?text=${encodeURIComponent(text)}`;

// Post Card Component (reused from Home.jsx)
const PostCard = ({ post, variant = 'default' }) => {
    let imageHeightClass = "h-52";
    if (variant === 'small') {
        imageHeightClass = "h-32"; // Smaller image for sidebar cards
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-102 transition-transform duration-300 ${variant === 'small' ? 'flex items-start mb-4' : 'block'}`}>
            <Link to={`/blog/${post._id}`} className={variant === 'small' ? 'flex-shrink-0 w-2/5' : 'block'}>
                <img
                    src={post.imageURL || defaultImage(post.title || 'Blog Post')}
                    alt={post.title}
                    className={`w-full object-cover object-center ${imageHeightClass} ${variant === 'small' ? 'rounded-l-xl' : 'rounded-t-xl'}`}
                    loading="lazy"
                />
            </Link>
            <div className={`p-4 ${variant === 'small' ? 'flex-grow w-3/5' : 'p-6'}`}>
                <span className={`text-sm text-gray-500 dark:text-gray-400 mb-2 block font-medium ${variant === 'small' ? 'text-xs' : ''}`}>
                    {post.createdAt ? format(new Date(post.createdAt), 'MMMM dd, yyyy') : 'Date Unknown'}
                </span>
                <h3 className={`font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 ${variant === 'small' ? 'text-md' : 'text-xl'}`}>
                    <Link to={`/blog/${post._id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition duration-200">
                        {post.title}
                    </Link>
                </h3>
                {variant === 'default' && ( // Only show excerpt for default (larger) cards
                    <p className="text-gray-700 dark:text-gray-300 text-base mb-4 line-clamp-3">
                        {post.excerpt || (post.content ? `${post.content.substring(0, 120)}...` : 'A concise summary of the blog post, designed to entice the reader to click through and read the full article.')}
                    </p>
                )}
                <Link
                    to={`/blog/${post._id}`}
                    className={`text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center group ${variant === 'small' ? 'text-sm' : ''}`}
                >
                    Read Article
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                </Link>
            </div>
        </div>
    );
};

// Section Container Component (reused from Home.jsx)
const SectionContainer = ({ title, children, className = "" }) => (
    <section className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 ${className}`}>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700 text-center">{title}</h2>
        {children}
    </section>
);


// CategoryPage Component
export default function CategoryPage() {
    const { categorySlug } = useParams(); // Get the slug from the URL
    const { authFetch } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchCategoryPosts = async () => {
            setLoading(true);
            setError(null);
            setPosts([]); // Clear previous posts

            try {
                // Ensure your backend API can filter by category using a query parameter like `category`
                const data = await authFetch(`/posts?category=${categorySlug}`);
                const fetchedPosts = data.posts || [];

                setPosts(fetchedPosts);

                // Derive the display name from the slug or use the actual category name from a post
                if (fetchedPosts.length > 0 && fetchedPosts[0].category) {
                    setCategoryName(fetchedPosts[0].category); // Use the actual category name from a post if available
                } else {
                    // Fallback: convert slug to a displayable name
                    const name = categorySlug
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    setCategoryName(name);
                }

                setLoading(false);
            } catch (err) {
                console.error(`Failed to fetch posts for category ${categorySlug}:`, err);
                // The authFetch itself will handle 401 and redirect.
                // For other errors, display a user-friendly message.
                setError(`Failed to load posts for "${categorySlug}". Please check your connection or category name.`);
                setLoading(false);
            }
        };

        if (categorySlug) {
            fetchCategoryPosts();
        }
    }, [categorySlug, authFetch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                <p className="text-xl animate-pulse">Loading {categoryName || categorySlug} articles...</p>
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

    // This ensures `displayCategoryTitle` is always correctly formatted even if `categoryName` is empty initially
    const displayCategoryTitle = categoryName || categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');


    return (
        <div className="container mx-auto p-4 max-w-7xl bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <Helmet>
                <title>{displayCategoryTitle} - CodeWhiz Chronicles Categories</title>
                <meta name="description" content={`Explore all articles categorized under ${displayCategoryTitle} on MyBlog.`} />
            </Helmet>

            <SectionContainer title={`${displayCategoryTitle} Articles`}>
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <PostCard key={post._id} post={post} variant="default" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-xl text-gray-600 dark:text-gray-300">No articles found in the "{displayCategoryTitle}" category yet.</p>
                        <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Check back soon or explore other categories!</p>
                        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300">
                            Go to Homepage
                        </Link>
                    </div>
                )}
            </SectionContainer>
        </div>
    );
}