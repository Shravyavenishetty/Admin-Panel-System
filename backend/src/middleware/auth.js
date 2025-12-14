/**
 * Authentication Middleware
 * Protects routes by verifying JWT token
 */

const { verifyToken } = require('../utils/jwt');
const Admin = require('../models/Admin');

/**
 * Middleware to authenticate admin users
 * Checks for JWT token in Authorization header
 * Attaches admin user to request object if valid
 */
const authenticateAdmin = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Access denied.',
            });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyToken(token);

        // Find admin user by ID from token
        const admin = await Admin.findById(decoded.id).select('-password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin user not found. Access denied.',
            });
        }

        // Attach admin to request object for use in route handlers
        req.admin = admin;

        // Continue to next middleware/route handler
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Access denied.',
        });
    }
};

module.exports = authenticateAdmin;
