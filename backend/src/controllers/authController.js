/**
 * Authentication Controller
 * Handles admin authentication logic (login, logout, verification)
 */

const Admin = require('../models/Admin');
const { generateToken } = require('../utils/jwt');

/**
 * Admin Login
 * POST /api/admin/login
 * @route POST /api/admin/login
 * @access Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Find admin by email and include password field
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check password
        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = generateToken(admin._id);

        // Store session (in-memory)
        req.session.adminId = admin._id.toString();

        // Return success response with token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during login',
        });
    }
};

/**
 * Admin Logout
 * POST /api/admin/logout
 * @route POST /api/admin/logout
 * @access Private
 */
const logout = async (req, res) => {
    try {
        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
            }
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during logout',
        });
    }
};

/**
 * Verify Token
 * GET /api/admin/verify
 * @route GET /api/admin/verify
 * @access Private
 */
const verifyTokenHandler = async (req, res) => {
    // If this handler is reached, it means the auth middleware passed
    // which means the token is valid
    res.status(200).json({
        success: true,
        valid: true,
        admin: req.admin, // Attached by auth middleware
    });
};

/**
 * Get Current Admin
 * GET /api/admin/me
 * @route GET /api/admin/me
 * @access Private
 */
const getCurrentAdmin = async (req, res) => {
    res.status(200).json({
        success: true,
        admin: req.admin, // Attached by auth middleware
    });
};

module.exports = {
    login,
    logout,
    verifyTokenHandler,
    getCurrentAdmin,
};
