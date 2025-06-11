import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import 'simplemde/dist/simplemde.min.css';
import { useAuth } from '../context/AuthContext';
import UploadWidget from '../components/UploadWidget';
import { Helmet } from 'react-helmet-async';

export default function CreatePost() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const { user, authFetch } = useAuth();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [submitError, setSubmitError] = useState(null);

    const categories = ['Tech', 'Life', 'Code', 'Travel', 'Food', 'Business'];

    // --- Client-side role check and initial post loading ---
    useEffect(() => {
        const checkPermissionsAndLoadPost = async () => {
            if (!user || user.role !== 'admin') {
                alert('You must be an admin to create or edit posts. Redirecting to home.');
                navigate('/');
                return;
            }

            if (isEditing) {
                try {
                    // FIX: Ensure API prefix is included for fetching a single post for editing
                    const data = await authFetch(`/api/posts/${id}`);
                    setTitle(data.title);
                    setCategory(data.category || '');
                    setContent(data.content);
                    setImageURL(data.imageURL);
                } catch (err) {
                    console.error("Error loading post:", err);
                    let errorMessage = "Failed to load post.";
                    if (err.message) {
                        errorMessage = err.message;
                    }
                    alert(`Error: ${errorMessage}. Redirecting to blog list.`);
                    navigate('/blog');
                }
            }
            setIsLoading(false);
        };

        if (user !== null) {
            checkPermissionsAndLoadPost();
        }
    }, [user, authFetch, navigate, id, isEditing]);

    // Submit new post or update existing post
    const submitPost = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        const body = { title, category, content, imageURL };
        const method = isEditing ? 'PUT' : 'POST';
        
        // FIX: Ensure API prefix is included for both POST and PUT requests
        const url = isEditing ? `/api/posts/${id}` : '/api/posts';

        if (!title || !category || !content || !imageURL) {
            setSubmitError('All fields (Title, Category, Content, Image) are required.');
            return;
        }

        try {
            await authFetch(url, {
                method,
                body: JSON.stringify(body),
            });

            navigate('/blog');

        } catch (err) {
            console.error('Post submission error:', err);
            setSubmitError(err.message || 'An unexpected error occurred during submission.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-160px)] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <p className="text-xl text-gray-600 dark:text-gray-300">Loading editor and checking permissions...</p>
            </div>
        );
    }
    
    if (!user || user.role !== 'admin') {
        return null; // This case is already handled by the useEffect, but good for explicit rendering control
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-80px)] transition-colors duration-300">
            <Helmet>
                <title>{isEditing ? 'Edit Post' : 'Create New Post'} | MyBlog</title>
                <meta name="description" content={isEditing ? `Edit existing blog post: ${title}` : "Create a new blog post for MyBlog."} />
            </Helmet>

            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
                {isEditing ? 'Edit Blog Post' : 'Create New Post'}
            </h1>

            <form onSubmit={submitPost} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl space-y-7 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                {submitError && (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Oops! </strong>
                        <span className="block sm:inline">{submitError}</span>
                    </div>
                )}

                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-gray-800 dark:text-gray-200 text-lg font-semibold mb-2">
                        Post Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Enter your compelling post title here..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 transition duration-200 shadow-sm"
                        required
                        aria-label="Post Title"
                    />
                </div>

                {/* Category Dropdown */}
                <div>
                    <label htmlFor="category" className="block text-gray-800 dark:text-gray-200 text-lg font-semibold mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 px-5 py-3 rounded-lg bg-white dark:bg-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-100 transition duration-200 shadow-sm cursor-pointer"
                        required
                        aria-label="Select Post Category"
                    >
                        <option value="" disabled className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-gray-800 dark:text-gray-200 text-lg font-semibold mb-2">
                        Featured Image <span className="text-red-500">*</span>
                    </label>
                    {/* The UploadWidget component itself would need to handle its internal dark mode styling if it renders UI */}
                    <UploadWidget onUpload={setImageURL} />
                    {imageURL && (
                        <div className="mt-5 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-md transition-colors duration-300">
                            <img src={imageURL} alt="Featured Post Visual" className="w-full h-64 object-cover" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                                Image URL: <span className="font-mono text-xs break-all">{imageURL}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Content Editor */}
                <div>
                    <label htmlFor="content" className="block text-gray-800 dark:text-gray-200 text-lg font-semibold mb-2">
                        Post Content <span className="text-red-500">*</span>
                    </label>
                    <SimpleMDE
                        id="content"
                        value={content}
                        onChange={setContent}
                        options={{
                            minHeight: '350px',
                            spellChecker: false,
                            toolbar: [
                                "bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|",
                                "link", "image", "table", "|", "preview", "guide",
                                {
                                    name: "horizontal-rule",
                                    action: SimpleMDE.toggleCodeBlock, // This was the original action, which inserts a horizontal rule.
                                    className: "fa fa-minus",
                                    title: "Horizontal Line",
                                }
                            ]
                        }}
                        // NOTE: SimpleMDE's theme needs to be handled via CSS overrides for dark mode
                        // You'll likely need to add a custom CSS file that targets SimpleMDE classes
                        // and applies dark mode styles, potentially based on a parent dark class.
                        // Example:
                        // .dark .CodeMirror, .dark .CodeMirror-scroll { background-color: #333; color: #eee; }
                        // .dark .editor-toolbar { background-color: #222; border-color: #555; }
                        // etc.
                        className="shadow-sm border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-colors duration-300"
                        aria-label="Post Content Editor"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                    {isEditing ? 'Update Post' : 'Publish Post'}
                </button>
            </form>
        </div>
    );
}