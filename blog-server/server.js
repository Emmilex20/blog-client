// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env file!');
    console.error('Please ensure your .env file is correctly configured with MONGODB_URI.');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully!'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        console.error('Please check your MONGODB_URI in .env and ensure MongoDB server is running.');
        process.exit(1);
    });

// --- Import your route modules ---
const authRoutes = require('./routes/authRoutes');
const postsRouter = require('./routes/posts'); // Your existing posts router
const usersRouter = require('./routes/users'); // NEW: Import the new users router
const { protect, authorize } = require('./middleware/authMiddleware'); // Used in the routers


// --- Middleware ---

// *** CORS CONFIGURATION ***
// Define allowed origins
const allowedOrigins = [
    'http://localhost:5173',                  // For local development
    'https://blog-client-rust.vercel.app'    // Your deployed frontend on Vercel
];

// Configure CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests, or same-origin requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow common HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],    // Explicitly allow common headers, especially for auth
    credentials: true                                     // Essential if you're sending cookies or authorization headers (like JWT in `Authorization` header)
}));

app.use(express.json()); // To parse JSON request bodies


// --- Mount your API Routes ---

// Mount the main authentication routes under /api/auth
app.use('/api/auth', authRoutes);

// Mount posts routes
app.use('/api/posts', postsRouter);

// NEW: Mount users routes under /api/users
app.use('/api/users', usersRouter);

// ADD THIS NEW ROUTE HERE for categories
app.get('/api/categories', (req, res) => {
    // In a real application, you might fetch categories from a database.
    // For now, this array matches the frontend's expected categories.
    res.json(["Tech", "Life", "Code"]);
});


// --- Error Handling ---
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// General error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack); // Log stack trace in development
    }
    res.json({
        error: {
            message: err.message,
            // Include stack trace in development only
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

// --- Start the server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on http://localhost:${PORT}`));