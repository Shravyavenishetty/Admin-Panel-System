
/**
 * Authentication Middleware
 * Protects routes by verifying JWT token
 */

const { verifyToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer'); // Added Customer model import

/**
 * Middleware to authenticate users (admin or customer)
 * Checks for JWT token in Authorization header
 * Attaches user to request object if valid
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Access denied.',
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Load user based on role from token
        let user;
        if (decoded.role === 'customer') {
            user = await Customer.findById(decoded.id).select('-password'); // Exclude password
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Customer user not found. Access denied.',
                });
            }
        } else {
            // Default to Admin if role is not customer or not specified
            user = await Admin.findById(decoded.id).select('-password'); // Exclude password
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Admin user not found. Access denied.',
                });
            }
        }

        // Attach user to request
        req.user = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: decoded.role || user.role, // Use role from token, fallback to user object
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Access denied.',
            error: error.message, // Include error message for debugging
        });
    }
};

// Export as 'protect' for consistency with route imports
module.exports = protect;
module.exports.protect = protect;
