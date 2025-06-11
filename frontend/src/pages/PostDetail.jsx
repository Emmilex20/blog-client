import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Comments from '../components/Comments';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authFetch } = useAuth();

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPost = useCallback(async () => {
        if (!id) {
            setError("No post ID provided in the URL.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await authFetch(`/api/posts/${id}`);
            setPost(data);
        } catch (err) {
            console.error("Failed to fetch post details:", err);
            let errorMessage = "Oops! We couldn't load the post content.";
            if (err.message.includes("404")) {
                errorMessage = "The post you're looking for doesn't exist or has been removed.";
            } else if (err.message.includes("Network error")) {
                errorMessage = "Network error: Couldn't connect to the server. Please check your internet connection.";
            } else if (err.message) {
                errorMessage = `Error: ${err.message}. Please try again later.`;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [id, authFetch]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <p className="text-xl text-gray-600 dark:text-gray-300 animate-pulse">Loading post content...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong!</h2>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg">{error}</p>
                <button
                    onClick={() => navigate('/blog')}
                    className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 transform hover:scale-105 active:scale-95"
                >
                    Go back to Blog
                </button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <p className="text-xl text-gray-600 dark:text-gray-300">Post not found. It might have been deleted.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8 md:py-12">
            <Helmet>
                <title>{post.title} – MyBlog</title>
                <meta name="description" content={post.excerpt || (post.content || '').slice(0, 150)} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt || (post.content || '').slice(0, 150)} />
                {post.imageURL && <meta property="og:image" content={post.imageURL} />}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt || (post.content || '').slice(0, 150)} />
                {post.imageURL && <meta name="twitter:image" content={post.imageURL} />}
            </Helmet>

            <div className="container mx-auto px-4 max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                {/* Featured Image */}
                {post.imageURL && (
                    <div className="relative mb-8 overflow-hidden animate-fade-in">
                        <img
                            src={post.imageURL}
                            alt={post.title}
                            className="w-full h-64 md:h-96 object-cover object-center transform transition duration-500 ease-in-out hover:scale-105"
                            loading="eager" // Load featured image eagerly for better UX
                        />
                        {/* Optional: Add a subtle overlay to the image for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>
                )}

                <div className="p-6 md:p-10 lg:p-12"> {/* Inner padding for the content */}
                    {/* Post Header */}
                    <header className="mb-8 text-center animate-slide-in-up">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 tracking-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center text-gray-600 dark:text-gray-400 text-sm md:text-base space-x-2 md:space-x-3">
                            {post.category && (
                                <span className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-medium text-xs md:text-sm whitespace-nowrap">
                                    {post.category}
                                </span>
                            )}
                            {/* Only show separator if category exists */}
                            {post.category && <span>•</span>}
                            <time dateTime={post.createdAt} className="whitespace-nowrap">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                            {/* Display author if available in post data */}
                            {post.author && (
                                <>
                                    <span>•</span>
                                    <span className="font-medium whitespace-nowrap">By {post.author}</span>
                                </>
                            )}
                        </div>
                    </header>

                    <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />

                    {/* Post Content */}
                    <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 leading-relaxed mb-12 animate-fade-in-up dark:prose-invert
                                        selection:bg-blue-200 dark:selection:bg-blue-700 selection:text-blue-900 dark:selection:text-blue-100">
                        {/*
                            The 'prose' class from Tailwind CSS Typography plugin
                            is excellent for styling markdown content beautifully.
                            Ensure you have '@tailwindcss/typography' installed and configured in tailwind.config.js
                        */}
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </article>

                    <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />

                    {/* Comments Section */}
                    <section className="mt-10 animate-fade-in-up delay-200">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">Comments</h2>
                        <Comments postId={post._id} postTitle={post.title} />
                    </section>
                </div>
            </div>
        </div>
    );
}