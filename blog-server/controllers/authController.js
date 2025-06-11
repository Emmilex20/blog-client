// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail'); // Import the email utility
const crypto = require('crypto'); // Make sure this is here for hashing the incoming token

// Helper to generate JWT
const generateToken = (id, username, email, role) => {
    return jwt.sign({ id, username, email, role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// 1. User Signup
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields (username, email, password) are required.' });
    }
    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(409).json({ message: 'User with that email or username already exists.' });
        }
        user = new User({ username, email, password });
        await user.save();
        const token = generateToken(user._id, user.username, user.email, user.role);
        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error('Signup error:', err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// 2. User Login
exports.login = async (req, res) => {
    const { loginIdentifier, password } = req.body;
    if (!loginIdentifier || !password) {
        return res.status(400).json({ message: 'Username/Email and password are required.' });
    }
    try {
        const user = await User.findOne({ $or: [{ username: loginIdentifier }, { email: loginIdentifier }], }).select('+password'); // Ensure password is selected for comparison
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials (username/email not found).' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials (incorrect password).' });
        }
        const token = generateToken(user._id, user.username, user.email, user.role);
        res.json({
            message: 'Logged in successfully!',
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// 3. Update User Role (Admin-only access)
exports.updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided. Must be "user" or "admin".' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (req.user.id.toString() === userId && role === 'user' && req.user.role === 'admin') {
            return res.status(403).json({ message: 'An admin cannot demote themselves via this endpoint.' });
        }
        user.role = role;
        await user.save();
        res.json({ message: `User ${user.username}'s role updated to ${user.role}.`, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Update User Role error:', err.message);
        if (err.name === 'CastError' && err.path === '_id') {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
        res.status(500).json({ message: 'Server error during role update.' });
    }
};

// 4. Get all users (Admin-only access)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error('--- Backend: Get All Users error:', err.message);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
};

// NEW: 5. Delete User (Admin-only access)
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: `User ${result.username} deleted successfully.` });
    } catch (err) {
        console.error('Delete User error:', err.message);
        if (err.name === 'CastError' && err.path === '_id') {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
        res.status(500).json({ message: 'Server error during user deletion.' });
    }
};

// NEW: 6. Forgot Password
// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Basic validation
    if (!email) {
        return res.status(400).json({ message: 'Please provide an email address.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // Always send 200 OK to prevent email enumeration attacks.
            // This message tells the user that if the email is registered, they'll get a link.
            return res.status(200).json({ message: 'If a user with that email exists, a password reset email has been sent.' });
        }

        // Generate the reset token using the method from the User model
        const resetToken = user.getResetPasswordToken();

        // Save the user with the hashed token and expiry date.
        // Use { validateBeforeSave: false } because we're not touching password field,
        // and its validation might prevent save if we're not updating it.
        await user.save({ validateBeforeSave: false });

        // Create the reset URL for the frontend. Ensure FRONTEND_URL is set in your .env
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const message = `
            You are receiving this email because you (or someone else) has requested a password reset for your account.
            
            Please click on the following link to reset your password:
            
            ${resetUrl}
            
            This link is only valid for 10 minutes.
            
            If you did not request this, please ignore this email and your password will remain unchanged.
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'MyBlog - Password Reset Request',
                message: message,
            });

            res.status(200).json({ message: 'If a user with that email exists, a password reset email has been sent.' });
        } catch (emailError) {
            console.error('Error sending password reset email:', emailError);

            // If email sending fails, clear the token from the user document
            // to prevent a valid token existing without an email sent.
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false }); // Save changes

            return res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
        }

    } catch (err) {
        console.error('Forgot password process error:', err.message);
        // Generic server error for unexpected issues during the process
        res.status(500).json({ message: 'Server error during password reset request.' });
    }
};

// NEW: 7. Reset Password
// @desc    Reset User Password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
    // 1. Get token from params and new password from body
    const { token } = req.params;
    const { password } = req.body;

    // Basic validation
    if (!password) {
        return res.status(400).json({ message: 'Please provide a new password.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
        // 2. Hash the incoming token to match the one in the DB
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // 3. Find user by hashed token AND check if token is not expired
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }, // Token must be greater than current time
        }).select('+password'); // Select password explicitly as it's 'select: false' in schema

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        // 4. Set the new password and clear reset fields
        user.password = password; // Mongoose's pre('save') hook will hash this
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save(); // This will trigger the pre('save') hook to hash the new password

        res.status(200).json({ message: 'Password reset successfully!' });

    } catch (err) {
        console.error('Reset password error:', err.message);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};