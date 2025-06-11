const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required.'], // Make title mandatory
    trim: true, // Remove whitespace from both ends
    minlength: [3, 'Title must be at least 3 characters long.'], // Minimum length for a meaningful title
    maxlength: [120, 'Title cannot exceed 120 characters.'], // Max length for display/SEO
  },
  category: {
    type: String,
    required: [true, 'Post category is required.'], // Make category mandatory
    trim: true,
    lowercase: true, // Store categories in lowercase for consistent querying
    // You could add an enum here if you have fixed categories:
    // enum: ['tech', 'life', 'code', 'travel', 'food', 'news']
  },
  content: {
    type: String,
    required: [true, 'Post content is required.'], // Make content mandatory
    minlength: [100, 'Content must be at least 100 characters long.'], // Ensure meaningful content
  },
  excerpt: { // <--- NEW FIELD: Short summary for listings
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters.'],
    default: function() { // Auto-generate if not provided
      // Take the first 150-250 characters of content as a default excerpt
      return this.content.substring(0, 250) + (this.content.length > 250 ? '...' : '');
    }
  },
  imageURL: {
    type: String,
    required: [true, 'Image URL is required.'], // Make image mandatory for featured/grid display
    trim: true,
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/, 'Please enter a valid image URL.'], // Basic URL validation
  },
  // We can let Mongoose handle createdAt and updatedAt automatically
}, {
  timestamps: true, // <--- NEW OPTION: Mongoose automatically adds createdAt and updatedAt
  collection: 'posts' // <--- NEW OPTION: Explicitly name the collection
});

module.exports = mongoose.model('Post', postSchema);