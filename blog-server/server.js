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
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your frontend's URL
    credentials: true
}));
app.use(express.json());

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
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }
    res.json({
        error: {
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

// --- Start the server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on http://localhost:${PORT}`));