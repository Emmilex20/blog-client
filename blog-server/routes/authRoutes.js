// routes/authRoutes.js
const express = require('express');
const { signup, login, updateUserRole, getAllUsers, deleteUser, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Admin-only route to update user roles
router.put('/users/:userId/role', protect, authorize('admin'), updateUserRole);

// Admin-only route to get all users (for user management UI)
router.get('/users', protect, authorize('admin'), getAllUsers);

router.delete('/users/:userId', protect, authorize('admin'), deleteUser);

module.exports = router;