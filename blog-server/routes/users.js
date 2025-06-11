// routes/users.js
const router = require('express').Router();
const User = require('../models/User'); // Assuming you have a User model
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all users (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    // Select all users, but exclude the password field for security
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users due to a server error.' });
  }
});

// Get a single user by ID (Admin only) - Useful for a future edit user page
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching single user:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    res.status(500).json({ message: 'Failed to fetch user due to a server error.' });
  }
});

// Update a user (Admin only) - Be careful with role changes!
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { username, email, role } = req.body; // Allow updating these fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role }, // You might want to restrict 'role' updates
      { new: true, runValidators: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update user due to a server error.' });
  }
});


// Delete a user (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Prevent admin from deleting themselves if logged in as that admin
    // This assumes `req.user` is populated by `protect` middleware
    if (req.user && req.user.id === req.params.id) {
        return res.status(403).json({ message: 'You cannot delete your own account via this endpoint.' });
    }

    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(204).end(); // 204 No Content for successful deletion
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    res.status(500).json({ message: 'Failed to delete user due to a server error.' });
  }
});

module.exports = router;