const router = require('express').Router();
const Post = require('../models/Post');
// Corrected: Import protect and authorize from your authMiddleware.js
const { protect, authorize } = require('../middleware/authMiddleware'); // Go up one level (..) to blog-server, then into middleware folder

// --- PUBLIC ROUTES ---

// Get all posts with pagination and optional category filter
router.get('/', async (req, res) => {
  const { page = 1, limit = 5, category } = req.query;
  const filter = category ? { category } : {}; // Build filter based on category

  try {
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip((page - 1) * limit) // Skip posts for pagination
      .limit(parseInt(limit)); // Ensure limit is parsed as an integer

    const total = await Post.countDocuments(filter); // Get total count for pagination info

    res.json({
      posts,
      total,
      page: parseInt(page), // Return current page as integer
      limit: parseInt(limit), // Return limit as integer
      totalPages: Math.ceil(total / parseInt(limit)) // Calculate total pages
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts due to a server error.' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching single post:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }
    res.status(500).json({ message: 'Failed to fetch post due to a server error.' });
  }
});

// --- ADMIN ONLY ROUTES ---
// Apply `protect` first to ensure a token is present and valid,
// then `authorize('admin')` to ensure the user has the 'admin' role.

// Create post
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    // Optionally, associate the post with the admin user creating it
    // req.body.author = req.user.id; // Assuming req.user is populated by `protect` middleware
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create post due to a server error.' });
  }
});

// Edit post
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true // Run schema validators on update
    });
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update post due to a server error.' });
  }
});

// Delete post
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.status(204).end(); // 204 No Content for successful deletion
  } catch (error) {
    console.error('Error deleting post:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }
    res.status(500).json({ message: 'Failed to delete post due to a server error.' });
  }
});

module.exports = router;