// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function About() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <Helmet>
                <title>About Us - MyBlog</title>
                <meta name="description" content="Learn about MyBlog, our mission to share knowledge, and the passion behind our content. Discover what drives us to create engaging articles." />
                <meta property="og:title" content="About MyBlog: Our Story and Mission" />
                <meta property="og:description" content="Find out more about the team behind MyBlog, our journey, and commitment to quality content." />
                {/* IMPORTANT: Update this URL to your actual deployed about page URL on Vercel */}
                <meta property="og:url" content="https://blog-client-rust.vercel.app/about" />
            </Helmet>

            {/* Hero Section */}
            <div className="text-center mb-16 pt-8">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 animate-fade-in-down">
                    Unveiling Our Journey
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up">
                    Welcome to MyBlog, where ideas ignite and stories unfold. We're more than just a blog; we're a community passionate about sharing insights, knowledge, and experiences across a diverse range of topics.
                </p>
            </div>

            {/* Main Content Grid - Our Story */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Our Story/Mission Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10 animate-slide-in-left transition-colors duration-300 border border-transparent dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                        Our Story & Mission
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        MyBlog started with a simple vision: to create a platform where curious minds could explore engaging content, from the latest tech trends and insightful coding tutorials to reflections on everyday life. We believe in the power of words to inspire, educate, and entertain. Our mission is to deliver high-quality, well-researched, and thought-provoking articles that resonate with our readers.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Every piece of content is crafted with care, aiming to spark conversations and foster a deeper understanding of the world around us. We are committed to continuous learning and sharing that journey with you.
                    </p>
                </div>

                {/* Image or Illustration (Optional) */}
                <div className="animate-fade-in-right hidden lg:block">
                    {/* REPLACE THIS PLACEHOLDER IMAGE URL with a relevant image or illustration */}
                    <img
                        src="https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=MyBlog+Story"
                        alt="MyBlog Team collaborating or a creative representation of ideas"
                        className="rounded-xl shadow-xl w-full h-auto object-cover border border-transparent dark:border-gray-700"
                    />
                </div>
            </div>

            {/* What We Offer & Why Choose Us Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-12">
                {/* What We Offer Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10 animate-fade-in-up transition-colors duration-300 border border-transparent dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                        What We Offer
                    </h2>
                    <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                        <li>In-depth articles on **Tech** advancements and industry insights.</li>
                        <li>Practical guides and tutorials for **Code** enthusiasts of all levels.</li>
                        <li>Relatable stories and reflections on **Life**, self-improvement, and well-being.</li>
                        <li>Regularly updated content to keep you informed and engaged.</li>
                        <li>A platform for thoughtful discussion and community interaction.</li>
                    </ul>
                </div>

                {/* Why Choose Us Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10 animate-fade-in-up delay-200 transition-colors duration-300 border border-transparent dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                        Why Choose MyBlog?
                    </h2>
                    <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                        <li>**Expert Insights:** Content crafted by passionate writers and subject matter experts.</li>
                        <li>**Diverse Topics:** A broad spectrum of categories ensures there's something for everyone.</li>
                        <li>**Engaging Community:** Join discussions and share your own perspectives.</li>
                        <li>**User-Focused Design:** A clean, intuitive interface for an optimal reading experience.</li>
                        <li>**Commitment to Quality:** We prioritize accuracy, clarity, and depth in every article.</li>
                    </ul>
                </div>
            </div>

            {/* Our Core Values Section */}
            <div className="mt-16 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8 animate-fade-in-down">
                    Our Core Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Value 1 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 animate-fade-in-up transition-colors duration-300 border border-transparent dark:border-gray-700">
                        <svg className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Integrity & Accuracy</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            We are committed to providing information that is accurate, well-researched, and reliable. Trust is the foundation of our relationship with you.
                        </p>
                    </div>
                    {/* Value 2 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 animate-fade-in-up delay-100 transition-colors duration-300 border border-transparent dark:border-gray-700">
                        <svg className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Passion & Innovation</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Driven by genuine curiosity, we constantly explore new ideas and innovative approaches to bring you fresh and exciting content.
                        </p>
                    </div>
                    {/* Value 3 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 animate-fade-in-up delay-200 transition-colors duration-300 border border-transparent dark:border-gray-700">
                        <svg className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.111-1.285.32-1.872m7.84-2.047a4.125 4.125 0 00-6.234 0"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10a2 2 0 100-4 2 2 0 000 4zM12 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        </svg>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Community & Engagement</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            We believe in the power of connection. Your feedback and participation are vital to our growth and the vibrant community we aim to build.
                        </p>
                    </div>
                </div>
            </div>

            {/* Join Our Community Section */}
            {/* Join Our Community Section */}
<div className="mt-16 text-center bg-gray-100 dark:bg-gray-850 p-10 rounded-xl shadow-lg animate-fade-in-up transition-colors duration-300">
    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-700 mb-6">
        Join Our Growing Community!
    </h2>
    <p className="text-lg text-gray-700 dark:text-gray-700 max-w-2xl mx-auto mb-8">
        Don't miss out on our latest articles, insights, and updates. Subscribe to our newsletter or follow us on social media for daily doses of knowledge and inspiration!
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
        {/* Subscribe Button */}
        <a
            href="mailto:aginaemmanuel6@gmail.com?subject=Newsletter%20Subscription%20Request" // Or a dedicated newsletter signup link
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 transform hover:scale-105"
            target="_blank"
            rel="noopener noreferrer"
        >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
            Subscribe to Newsletter
        </a>
        {/* Follow on X Button */}
        <a
            href="https://twitter.com/your-twitter-handle" // REPLACE with your Twitter/X profile link
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition duration-300 transform hover:scale-105"
            target="_blank"
            rel="noopener noreferrer"
        >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.901 1.153h3.68l-8.04 9.197L24 22.846h-7.406l-5.833-6.52L6.15 22.846H.334l8.03-9.194L0 1.153h7.525l4.636 5.923L18.901 1.153zm-1.051 19.34L6.9 3.518H4.638l11.97 16.974h2.232z"></path>
            </svg>
            Follow on X
        </a>
    </div>
</div>

            {/* Future Vision Section */}
            <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10 animate-fade-in-down transition-colors duration-300 border border-transparent dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 text-center">
                    Our Vision for the Future
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
                    We are constantly evolving, and our vision for MyBlog's future is exciting! We aim to expand our content categories, introduce interactive features, host community events, and continue to be a leading source of insightful and inspiring content. Your journey with us is just beginning.
                </p>
            </div>

            {/* Final Call to Action Section */}
            <div className="text-center mt-16 bg-blue-600 dark:bg-blue-700 text-white p-10 rounded-xl shadow-2xl animate-fade-in-up transition-colors duration-300">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                    Ready to Explore?
                </h2>
                <p className="text-lg md:text-xl mb-8">
                    Dive into our latest articles and discover new perspectives.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full shadow-lg text-blue-600 bg-white hover:bg-gray-100 dark:bg-gray-900 dark:text-blue-400 dark:hover:bg-gray-700 transition duration-300 transform hover:scale-105"
                >
                    Start Reading Now
                    <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                </Link>
            </div>
        </div>
    );
}