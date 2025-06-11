// src/pages/Contact.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from '@formspree/react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [state, handleSubmitFormspree, resetForm] = useForm('mldnjqnw'); // Use only the form ID

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        // The handleSubmitFormspree function already manages state.submitting, state.succeeded, etc.
        await handleSubmitFormspree(formData);
    };

    const formStatus = {
        submitting: state.submitting,
        success: state.succeeded,
        // Safely check state.errors. Formspree returns an array of errors or null/undefined
        error: state.errors && state.errors.length > 0,
    };

    // Corrected useEffect logic:
    useEffect(() => {
        // If the form submission was successful
        if (state.succeeded) {
            // Immediately clear the local form data for the next submission
            setFormData({ name: '', email: '', subject: '', message: '' });

            // After a delay, reset Formspree's internal state (which includes state.succeeded)
            // This allows the success message to be visible for 5 seconds.
            const timer = setTimeout(() => {
                resetForm();
            }, 5000);

            // Cleanup function for useEffect: clear the timeout if the component unmounts
            // or if state.succeeded changes again before the timeout fires.
            return () => clearTimeout(timer);
        }
    }, [state.succeeded, resetForm]); // Dependencies: only re-run when succeeded state changes or resetForm identity changes (which it shouldn't for useForm)

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <Helmet>
                <title>Contact Us - MyBlog</title>
                <meta name="description" content="Have questions or feedback? Contact MyBlog through our form, email, or phone. We'd love to hear from you!" />
                <meta property="og:title" content="Contact MyBlog" />
                <meta property="og:description" content="Reach out to the MyBlog team for inquiries, support, or collaborations." />
                <meta property="og:url" content="http://localhost:5173/contact" />
            </Helmet>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 animate-fade-in-down">
                    Get in Touch
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
                    We'd love to hear from you! Whether you have a question, feedback, or a partnership inquiry,
                    feel free to reach out using the form below or our contact details.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10 animate-slide-in-left transition-colors duration-300 border border-transparent dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">Send Us a Message</h2>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john.doe@example.com"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Regarding a blog post..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2">
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className={`w-full px-6 py-3 rounded-lg text-white font-bold text-lg transition duration-300 transform hover:-translate-y-0.5 shadow-md ${
                                formStatus.submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                            }`}
                            disabled={formStatus.submitting}
                        >
                            {formStatus.submitting ? 'Sending Message...' : 'Send Message'}
                        </button>

                        {formStatus.success && (
                            <p className="text-green-600 dark:text-green-400 font-semibold text-center mt-4 animate-fade-in-up">
                                Your message has been sent successfully! We'll get back to you soon.
                            </p>
                        )}
                        {formStatus.error && (
                            <p className="text-red-600 dark:text-red-400 font-semibold text-center mt-4 animate-fade-in-up">
                                There was an error sending your message. Please try again later.
                            </p>
                        )}
                    </form>
                </div>

                <div className="space-y-8 animate-slide-in-right">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10 transition-colors duration-300 border border-transparent dark:border-gray-700">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Our Details</h2>
                        <div className="space-y-6">
                            <div className="flex items-center animate-fade-in-up delay-100">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">Email Us</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        <a href="mailto:aginaemmanuel6@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-300 transition duration-200">
                                            aginaemmanuel6@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center animate-fade-in-up delay-200">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">Call Us</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        <a href="tel:+2349132062212" className="hover:text-blue-600 dark:hover:text-blue-300 transition duration-200">
                                            +234 913 206 2212
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start animate-fade-in-up delay-300">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">Our Location</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        123 Blog Street, Lekki, Lagos, Nigeria.
                                        <br />
                                        (Open Mon-Fri, 9am-5pm)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden animate-slide-in-right transition-colors duration-300 border border-transparent dark:border-gray-700">
                        <h2 className="sr-only">Our Location on Map</h2>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.673831770932!2d3.5065095!3d6.435773199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf6509214731f%3A0xe54e38e658e3f94e!2sLekki%20Phase%201%20Market!5e0!3m2!1sen!2sng!4v1718015949547!5m2!1sen!2sng"
                            width="100%"
                            height="350"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lekki, Lagos on Google Maps"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}