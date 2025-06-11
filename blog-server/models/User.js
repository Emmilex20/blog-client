const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Import crypto for generating random tokens

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false // Ensure password is not returned in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // --- New fields for password reset ---
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true // This will automatically manage `createdAt` and `updatedAt`
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash the token and set to resetPasswordToken field
    // Store the hashed token in the database for security
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set token expire time (e.g., 10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Return the unhashed token to the user via email
    return resetToken;
};


module.exports = mongoose.model('User', userSchema);