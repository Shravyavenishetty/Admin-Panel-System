/**
 * JWT Utility Functions
 * Handles JWT token generation and verification
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for admin user
 * @param {string} adminId - Admin user ID
 * @param {string} role - Admin role (admin, manager, user)
 * @returns {string} - JWT token
 */
const generateToken = (adminId, role = 'user') => {
    return jwt.sign(
        {
            id: adminId,
            role: role  // Include role in token payload
        }, // Payload
        process.env.JWT_SECRET, // Secret key
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Options
    );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

module.exports = {
    generateToken,
    verifyToken,
};
