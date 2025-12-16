/**
 * Admin Model
 * Mongoose schema for admin users with password hashing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin Schema Definition
 */
const adminSchema = new mongoose.Schema(
    {
        // Admin email - must be unique
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
            index: true,
        },

        // Admin password - will be hashed before saving
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false, // Don't include password in queries by default
        },

        // Admin name
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },

        // Admin role - supports admin, manager, user
        role: {
            type: String,
            enum: ['admin', 'manager', 'user'],
            default: 'user',
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

/**
 * Pre-save middleware to hash password before saving to database
 * Only hashes password if it has been modified
 */
adminSchema.pre('save', async function (next) {
    // Only hash password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Method to compare entered password with hashed password in database
 * @param {string} enteredPassword - Password to compare
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
adminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
