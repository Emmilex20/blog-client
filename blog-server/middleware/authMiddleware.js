const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model to fetch user from DB
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken'); // Import specific JWT errors

// Protect routes - checks for valid token
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check for Authorization header with Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find user by ID from decoded token
            const user = await User.findById(decoded.id).select('-password'); // Exclude password

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            // Attach the full user object from the DB to the request for subsequent middleware/controllers
            // This ensures the most up-to-date role from the DB is used.
            req.user = user;
            next(); // Proceed to the next middleware/route handler

        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return res.status(401).json({ message: 'Not authorized, token has expired. Please log in again.' });
            } else if (error instanceof JsonWebTokenError) {
                return res.status(401).json({ message: 'Not authorized, token is invalid. Please log in again.' });
            } else {
                // Catch any other unexpected errors during token verification or user lookup
                return res.status(500).json({ message: 'An unexpected authentication error occurred.' });
            }
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};

// Authorize roles - checks if user has one of the allowed roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // req.user should be populated by the 'protect' middleware that runs before 'authorize'
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Not authorized, user role is missing.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role "${req.user.role}" is not authorized to access this resource.` });
        }

        next(); // User is authorized, proceed
    };
};