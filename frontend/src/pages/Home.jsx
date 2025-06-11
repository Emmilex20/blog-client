import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import the useAuth hook from your AuthContext
import { useAuth } from '../context/AuthContext';
// Import the useTheme hook from your ThemeContext
import { useTheme } from '../context/ThemeContext'; // <--- Import useTheme

// --- Reusable Components for better organization ---

// Helper for a default image if none is provided
const defaultImage = (text = 'Blog Post Image') => `https://via.placeholder.com/600x400?text=${encodeURIComponent(text)}`;

// Post Card Component
const PostCard = ({ post, variant = 'default' }) => {
    let imageHeightClass = "h-52";
    if (variant === 'small') {
        imageHeightClass = "h-32"; // Smaller image for sidebar cards
    }

    return (
        // Added dark:bg-gray-700, dark:shadow-xl, dark:border-gray-600
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-102 transition-transform duration-300
                       dark:bg-gray-800 dark:shadow-xl dark:border dark:border-gray-700
                       ${variant === 'small' ? 'flex items-start mb-4' : 'block'}`}>
            <Link to={`/blog/${post._id}`} className={variant === 'small' ? 'flex-shrink-0 w-2/5' : 'block'}>
                <img
                    src={post.imageURL || defaultImage(post.title || 'Blog Post')}
                    alt={post.title}
                    className={`w-full object-cover object-center ${imageHeightClass} ${variant === 'small' ? 'rounded-l-xl' : 'rounded-t-xl'}`}
                    loading="lazy"
                />
            </Link>
            <div className={`p-4 ${variant === 'small' ? 'flex-grow w-3/5' : 'p-6'}`}>
                {/* Added dark:text-gray-400 */}
                <span className={`text-sm text-gray-500 mb-2 block font-medium ${variant === 'small' ? 'text-xs' : ''} dark:text-gray-400`}>
                    {post.createdAt ? format(new Date(post.createdAt), 'MMMM dd,yyyy') : 'Date Unknown'}
                </span>
                {/* Added dark:text-gray-100 and dark:hover:text-blue-400 */}
                <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${variant === 'small' ? 'text-md' : 'text-xl'} dark:text-gray-100`}>
                    <Link to={`/blog/${post._id}`} className="hover:text-blue-600 transition duration-200 dark:hover:text-blue-400">
                        {post.title}
                    </Link>
                </h3>
                {variant === 'default' && ( // Only show excerpt for default (larger) cards
                    // Added dark:text-gray-300
                    <p className="text-gray-700 text-base mb-4 line-clamp-3 dark:text-gray-300">
                        {post.excerpt || (post.content ? `${post.content.substring(0, 120)}...` : 'A concise summary of the blog post, designed to entice the reader to click through and read the full article.')}
                    </p>
                )}
                {/* Added dark:text-blue-400 */}
                <Link
                    to={`/blog/${post._id}`}
                    className={`text-blue-600 hover:underline font-semibold flex items-center group ${variant === 'small' ? 'text-sm' : ''} dark:text-blue-400`}
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

// Section Container Component (reused for general sections in main and sidebar)
const SectionContainer = ({ title, children, className = "" }) => (
    // Added dark:bg-gray-800, dark:shadow-xl, dark:text-gray-100, dark:border-gray-700
    <section className={`bg-white rounded-xl shadow-lg p-6 mb-8
                       dark:bg-gray-800 dark:shadow-xl dark:border dark:border-gray-700
                       ${className}`}>
        {/* Added dark:text-gray-100, dark:border-gray-700 */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 border-b pb-4 border-gray-200 text-center
                       dark:text-gray-100 dark:border-gray-700">{title}</h2>
        {children}
    </section>
);


// Newsletter Signup Component
const NewsletterSignup = () => (
    <SectionContainer title="Stay Connected" className="animate-slide-in-right">
        {/* Added dark:text-gray-300 */}
        <p className="text-gray-700 text-sm mb-4 dark:text-gray-300">
            Get the latest articles and updates delivered straight to your inbox.
        </p>
        <form className="space-y-4">
            <input
                type="email"
                placeholder="Your email address"
                // Added dark:bg-gray-700, dark:border-gray-600, dark:text-gray-100
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200
                           dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
            />
            <button
                type="submit"
                // Added dark:bg-blue-700, dark:hover:bg-blue-800
                className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md
                           dark:bg-blue-700 dark:hover:bg-blue-800"
            >
                Subscribe
            </button>
        </form>
    </SectionContainer>
);

// About Me/Blog Component (Placeholder)
const AboutMe = () => (
    <SectionContainer title="About MyBlog" className="animate-slide-in-right delay-100">
        <img
            src="/profilepic.png"
            alt="About Me"
            // Added dark:border-gray-600
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200 dark:border-gray-600"
        />
        {/* Added dark:text-gray-300 */}
        <p className="text-gray-700 text-center text-sm mb-4 dark:text-gray-300">
            Hello! I'm the voice behind MyBlog, sharing insights on tech, life, and code. Join me on this journey of learning and discovery.
        </p>
        {/* Added dark:text-blue-400 */}
        <Link to="/about" className="block text-center text-blue-600 hover:underline text-sm font-semibold dark:text-blue-400">
            Learn More
        </Link>
    </SectionContainer>
);

// Categories Component (Now receives dynamic categories as props)
const CategoriesSection = ({ categoriesData }) => (
    <SectionContainer title="Categories" className="animate-slide-in-right delay-200">
        <ul className="space-y-3">
            {categoriesData.map(cat => (
                // Added dark:border-gray-700
                <li key={cat.slug} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700">
                    {/* Added dark:text-gray-300, dark:hover:text-blue-400 */}
                    <Link to={`/category/${cat.slug}`} className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 dark:text-gray-300 dark:hover:text-blue-400">
                        {cat.name}
                    </Link>
                    {/* Added dark:bg-gray-700, dark:text-gray-300 */}
                    <span className="text-gray-500 text-sm bg-gray-100 px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{cat.count}</span>
                </li>
            ))}
        </ul>
    </SectionContainer>
);

// Main Home Component
export default function Home() {
    const { authFetch } = useAuth();
    // const { theme } = useTheme(); // You can uncomment and use this if you need to conditionally render based on theme
    const [posts, setPosts] = useState([]); // This will hold all fetched posts
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryCounts, setCategoryCounts] = useState([]);

    // States for distributed posts (these will be rendered)
    const [mainCarouselPosts, setMainCarouselPosts] = useState([]);
    const [sidebarPopularPosts, setSidebarPopularPosts] = useState([]);
    const [editorsPicks, setEditorsPicks] = useState([]);
    const [deepDivePosts, setDeepDivePosts] = useState([]);
    const [latestArticles, setLatestArticles] = useState([]);

    const deepDiveCategory = 'Technology'; // You can make this dynamic or based on a prop


    useEffect(() => {
        console.log("Home component useEffect is running!"); // DIAGNOSTIC LOG
        const fetchAllPosts = async () => {
            console.log("Attempting to fetch posts..."); // DIAGNOSTIC LOG
            try {
                // Ensure authFetch is available and a function
                if (typeof authFetch !== 'function') {
                    console.error("authFetch is not a function. Check AuthContext setup.");
                    setError("Authentication setup error. Please contact support.");
                    setLoading(false);
                    return;
                }

                const data = await authFetch('/api/posts?limit=50');
                const fetchedPosts = data.posts || [];
                console.log("Fetched posts data (raw from API):", fetchedPosts, "Length:", fetchedPosts.length); // DIAGNOSTIC LOG: Raw fetched data

                setPosts(fetchedPosts); // Update the main posts state

                // --- Calculate Category Counts ---
                const counts = {};
                fetchedPosts.forEach(post => {
                    const categoryName = post.category || 'Uncategorized';
                    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');

                    if (!counts[slug]) {
                        counts[slug] = { name: categoryName, count: 0, slug: slug };
                    }
                    counts[slug].count++;
                });
                const calculatedCategories = Object.values(counts);
                setCategoryCounts(calculatedCategories);

                // --- Distribute Posts into different sections ---
                // Create a mutable copy for distribution. This copy will be modified (spliced).
                let availablePostsCopy = [...fetchedPosts];

                // 1. Main Carousel Posts (up to 3, prefer images)
                // Filter posts with and without images for carousel prioritization
                const tempCarouselPostsWithImages = availablePostsCopy.filter(post => post.imageURL);
                const tempCarouselPostsWithoutImages = availablePostsCopy.filter(post => !post.imageURL);

                let currentMainCarouselPosts = [];
                // Take up to 3 posts with images first
                currentMainCarouselPosts = tempCarouselPostsWithImages.splice(0, Math.min(tempCarouselPostsWithImages.length, 3));
                // If fewer than 3 image posts, fill with non-image posts
                if (currentMainCarouselPosts.length < 3) {
                    currentMainCarouselPosts = [...currentMainCarouselPosts, ...tempCarouselPostsWithoutImages.splice(0, 3 - currentMainCarouselPosts.length)];
                }
                setMainCarouselPosts(currentMainCarouselPosts);

                // Update availablePostsCopy by removing carousel posts that were chosen
                availablePostsCopy = availablePostsCopy.filter(fp => !currentMainCarouselPosts.some(cp => cp._id === fp._id));
                // At this point, availablePostsCopy has: total posts - (number of posts in carousel)

                // 2. Sidebar Popular Posts (up to 4)
                // Take the next 4 posts from what's remaining
                const currentSidebarPopularPosts = availablePostsCopy.splice(0, Math.min(availablePostsCopy.length, 4));
                setSidebarPopularPosts(currentSidebarPopularPosts);
                // At this point, availablePostsCopy has: (previous remaining) - (number of popular posts)

                // 3. Editor's Picks (up to 4)
                // Take the next 4 posts from what's remaining
                const currentEditorsPicks = availablePostsCopy.splice(0, Math.min(availablePostsCopy.length, 4));
                setEditorsPicks(currentEditorsPicks);
                // At this point, availablePostsCopy has: (previous remaining) - (number of editor's picks)

                // 4. Deep Dives (e.g., specific category, up to 4)
                // Filter from what's currently remaining in availablePostsCopy.
                // Note: If previous sections took all posts (e.g., with 11 posts),
                // this section might be empty unless there are more posts or fewer taken above.
                const deepDiveCandidates = availablePostsCopy.filter(post => post.category === deepDiveCategory);
                const currentDeepDivePosts = deepDiveCandidates.splice(0, Math.min(deepDiveCandidates.length, 4));
                setDeepDivePosts(currentDeepDivePosts);

                // Update availablePostsCopy again to remove deep dive posts (if any were found)
                availablePostsCopy = availablePostsCopy.filter(p => !currentDeepDivePosts.some(ddp => ddp._id === p._id));


                // 5. Latest Articles (all remaining posts)
                // This section receives whatever is left after all previous sections have taken their share.
                // With 11 posts, this array will likely be empty if the top 3 sections take 3+4+4 = 11 posts.
                setLatestArticles(availablePostsCopy);


                // --- DIAGNOSTIC LOGS: Post Counts in each section ---
                // Check your browser's console after refreshing to see these outputs.
                console.log("--- Post Distribution Summary ---");
                console.log("Total Posts Fetched from API:", fetchedPosts.length);
                console.log("Main Carousel Posts Count:", currentMainCarouselPosts.length, currentMainCarouselPosts.map(p => p.title));
                console.log("Sidebar Popular Posts Count:", currentSidebarPopularPosts.length, currentSidebarPopularPosts.map(p => p.title));
                console.log("Editor's Picks Count:", currentEditorsPicks.length, currentEditorsPicks.map(p => p.title));
                console.log("Deep Dive Posts Count:", currentDeepDivePosts.length, currentDeepDivePosts.map(p => p.title));
                console.log("Latest Articles Count (Remaining):", availablePostsCopy.length, availablePostsCopy.map(p => p.title));
                console.log("-------------------------------");

                setLoading(false);
            } catch (err) {
                console.error("Error during fetch or post distribution:", err); // DIAGNOSTIC LOG
                setError("Failed to load blog posts. Please check your connection and try again.");
                setLoading(false);
            }
        };

        // Call the fetch function
        fetchAllPosts();

        // Add authFetch to the dependency array. It should be stable via useCallback in AuthContext.
    }, [authFetch]);

    if (loading) {
        return (
            // Added dark:text-gray-300
            <div className="flex justify-center items-center min-h-[calc(100vh-160px)] dark:bg-gray-900">
                <p className="text-xl text-gray-600 animate-pulse dark:text-gray-300">Gathering the latest stories for you...</p>
            </div>
        );
    }

    if (error) {
        return (
            // Added dark:bg-gray-900, dark:text-red-500, dark:border-gray-700
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-160px)] text-red-600 p-4 dark:bg-gray-900 dark:text-red-500">
                <p className="text-xl mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    // Added dark:bg-blue-700, dark:hover:bg-blue-800
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300
                               dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // You now render based on the individual section state variables
    return (
        // The outer container will inherit background from html, but specifying for safety/consistency
        // Also added dark:bg-gray-900 for safety, though html.dark should handle it
        <div className="container mx-auto p-4 max-w-7xl dark:bg-gray-900">
            <Helmet>
                <title>MyBlog – Home</title>
                <meta name="description" content="Welcome to MyBlog – your source for insights on tech, life, and code. Discover new articles and stories." />
                <meta property="og:title" content="MyBlog Home" />
                <meta property="og:description" content="Explore the latest articles on technology, lifestyle, and coding." />
                <meta property="og:image" content={mainCarouselPosts[0]?.imageURL || 'https://via.placeholder.com/1200x630?text=MyBlog+Home'} />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            {/* --- Hero Section: Featured Carousel (Full Width Above Columns) --- */}
            {mainCarouselPosts.length > 0 ? (
                <section className="relative rounded-lg shadow-xl overflow-hidden mb-16 animate-fade-in-down">
                    {/* Updated professional text here */}
                    {/* Added dark:from-blue-800, dark:to-purple-900 */}
                    <div className="text-center py-6 md:py-8 lg:py-10 bg-gradient-to-r from-blue-700 to-purple-800 text-white
                                    dark:from-blue-800 dark:to-purple-900">
                        <p className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight px-4 sm:px-6 lg:px-8">
                            Dive into our curated collection of <span className="text-yellow-300">insightful</span> articles and stay ahead with the <span className="text-cyan-300">latest</span> trends.
                        </p>
                    </div>
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper h-[400px] md:h-[500px] lg:h-[600px]"
                    >
                        {mainCarouselPosts.map(post => (
                            <SwiperSlide key={post._id}>
                                <div className="relative w-full h-full flex items-end">
                                    <img
                                        src={post.imageURL || defaultImage(post.title || 'Featured Post')}
                                        alt={post.title}
                                        className="w-full h-full object-cover object-center absolute inset-0"
                                        loading="eager"
                                    />
                                    {/* Adjusted dark overlay color for contrast */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent dark:from-black/80 dark:via-black/60 dark:to-transparent"></div>
                                    <div className="relative z-10 p-6 md:p-10 lg:p-12 w-full text-white">
                                        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full uppercase font-semibold tracking-wide mb-3 inline-block">
                                            {post.category || 'Uncategorized'}
                                        </span>
                                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 drop-shadow-lg">
                                            <Link to={`/blog/${post._id}`} className="hover:underline">
                                                {post.title}
                                            </Link>
                                        </h1>
                                        {/* Added dark:text-gray-300 */}
                                        <p className="text-gray-300 text-sm md:text-base lg:text-lg mb-5 line-clamp-3 dark:text-gray-300">
                                            {post.excerpt || (post.content ? `${post.content.substring(0, 150)}...` : 'Discover a new perspective on current trends and timeless wisdom.')}
                                        </p>
                                        <Link
                                            to={`/blog/${post._id}`}
                                            // Adjusted dark:bg-gray-100, dark:text-gray-900, dark:hover:bg-gray-200
                                            className="inline-flex items-center px-7 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-200 transition duration-300 shadow-xl group
                                                       dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                                        >
                                            Read Full Article
                                            <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
            ) : (
                // Added dark:bg-gray-800, dark:shadow-inner, dark:text-gray-300
                <div className="text-center py-12 bg-gray-50 rounded-lg shadow-inner mb-16 animate-fade-in-down
                                dark:bg-gray-800 dark:shadow-inner dark:text-gray-300">
                    <p className="text-xl text-gray-600 dark:text-gray-300">Stay tuned! Exciting new content is coming soon.</p>
                </div>
            )}

            {/* --- Main Content and Sidebar Layout --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Main Content Area (Left/Larger Column) */}
                <main className="lg:col-span-2">
                    {/* Latest Articles Section */}
                    {latestArticles.length > 0 ? (
                        <SectionContainer title="Latest Articles" className="animate-slide-in-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {latestArticles.map(post => (
                                    <PostCard key={post._id} post={post} variant="default" />
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <Link
                                    to="/blog"
                                    // Added dark:bg-gray-700, dark:text-gray-100, dark:hover:bg-gray-600
                                    className="inline-flex items-center px-8 py-4 bg-gray-200 text-gray-800 font-bold text-lg rounded-full hover:bg-gray-300 transition duration-300 shadow-md group
                                               dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                >
                                    View All Posts
                                    <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </Link>
                            </div>
                        </SectionContainer>
                    ) : (
                        // Added dark:bg-gray-800, dark:shadow-inner, dark:text-gray-300
                        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-inner mb-8 animate-slide-in-left
                                        dark:bg-gray-800 dark:shadow-inner dark:text-gray-300">
                            <p className="text-xl text-gray-600 dark:text-gray-300">No new articles to display at the moment. Check back soon!</p>
                        </div>
                    )}

                    {/* --- New Section: Editor's Picks --- */}
                    {editorsPicks.length > 0 ? (
                        <SectionContainer title="Editor's Picks" className="mt-8 animate-slide-in-left delay-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {editorsPicks.map(post => (
                                    <PostCard key={post._id} post={post} variant="default" />
                                ))}
                            </div>
                        </SectionContainer>
                    ) : (
                        // Added dark:bg-gray-800, dark:shadow-inner, dark:text-gray-300
                        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-inner mb-8 animate-slide-in-left delay-100
                                        dark:bg-gray-800 dark:shadow-inner dark:text-gray-300">
                            <p className="text-xl text-gray-600 dark:text-gray-300">Our editors are curating exciting content. Stay tuned for their picks!</p>
                        </div>
                    )}

                    {/* --- New Section: Deep Dives (e.g., Technology) --- */}
                    {deepDivePosts.length > 0 ? (
                        <SectionContainer title={`Deep Dives: ${deepDiveCategory}`} className="mt-8 animate-slide-in-left delay-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {deepDivePosts.map(post => (
                                    <PostCard key={post._id} post={post} variant="default" />
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <Link
                                    to={`/category/${deepDiveCategory.toLowerCase()}`}
                                    // Added dark:bg-gray-700, dark:text-gray-100, dark:hover:bg-gray-600
                                    className="inline-flex items-center px-8 py-4 bg-gray-200 text-gray-800 font-bold text-lg rounded-full hover:bg-gray-300 transition duration-300 shadow-md group
                                               dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                >
                                    More {deepDiveCategory} Articles
                                    <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </Link>
                            </div>
                        </SectionContainer>
                    ) : (
                        // Added dark:bg-gray-800, dark:shadow-inner, dark:text-gray-300
                        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-inner mb-8 animate-slide-in-left delay-200
                                        dark:bg-gray-800 dark:shadow-inner dark:text-gray-300">
                            <p className="text-xl text-gray-600 dark:text-gray-300">No deep dives in {deepDiveCategory} available right now. Check back soon!</p>
                        </div>
                    )}

                </main>

                {/* Sidebar Area (Right/Smaller Column) */}
                <aside className="lg:col-span-1">
                    {/* Popular Posts */}
                    {sidebarPopularPosts.length > 0 && (
                        <SectionContainer title="Popular Articles" className="animate-slide-in-right">
                            <div className="space-y-6">
                                {sidebarPopularPosts.map(post => (
                                    <PostCard key={post._id} post={post} variant="small" />
                                ))}
                            </div>
                        </SectionContainer>
                    )}

                    {/* Categories - Now passes dynamic counts */}
                    {categoryCounts.length > 0 && <CategoriesSection categoriesData={categoryCounts} />}


                    {/* About Me */}
                    <AboutMe />

                    {/* Newsletter Signup */}
                    <NewsletterSignup />

                    {/* Optional: Social Media Links */}
                    <SectionContainer title="Follow Us" className="animate-slide-in-right delay-300">
                        {/* Added dark:text-gray-300, dark:hover:text-blue-400 for icons */}
                        <div className="flex justify-center space-x-4">
                            {/* Remember to include Font Awesome in your project for these icons */}
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition duration-200 dark:text-gray-300 dark:hover:text-blue-400">
                                <i className="fab fa-facebook-f text-2xl"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition duration-200 dark:text-gray-300 dark:hover:text-blue-400">
                                <i className="fab fa-twitter text-2xl"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition duration-200 dark:text-gray-300 dark:hover:text-blue-400">
                                <i className="fab fa-instagram text-2xl"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition duration-200 dark:text-gray-300 dark:hover:text-blue-400">
                                <i className="fab fa-linkedin-in text-2xl"></i>
                            </a>
                        </div>
                    </SectionContainer>
                </aside>
            </div>

            {/* --- Final Call to Action (Full Width) --- */}
            {/* Added dark:from-blue-700, dark:to-indigo-800 */}
            <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-2xl mt-16 animate-fade-in-up
                               dark:from-blue-700 dark:to-indigo-800">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-5">Don't Miss Out!</h2>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
                    Join our growing community and receive exclusive content, updates, and more directly to your inbox.
                </p>
                <Link
                    to="/subscribe"
                    // Adjusted dark:bg-gray-100, dark:text-blue-800, dark:hover:bg-gray-200
                    className="inline-flex items-center px-10 py-4 bg-white text-blue-700 font-bold text-lg rounded-full hover:bg-gray-100 transition duration-300 shadow-lg transform hover:scale-105
                               dark:bg-gray-100 dark:text-blue-800 dark:hover:bg-gray-200"
                >
                    Subscribe Today
                    <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17l-3 3m0 0l-3-3m3 3V5"></path>
                    </svg>
                </Link>
            </section>
        </div>
    );
}