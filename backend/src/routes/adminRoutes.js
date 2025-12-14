/**
 * Admin Routes
 * Defines all admin-related API endpoints
 */

const express = require('express');
const router = express.Router();
const {
    login,
    logout,
    verifyTokenHandler,
    getCurrentAdmin,
} = require('../controllers/authController');
const authenticateAdmin = require('../middleware/auth');

/**
 * Public Routes (No authentication required)
 */

// POST /api/admin/login - Admin login
router.post('/login', login);

/**
 * Protected Routes (Authentication required)
 */

// POST /api/admin/logout - Admin logout
router.post('/logout', logout);

// GET /api/admin/verify - Verify JWT token
router.get('/verify', authenticateAdmin, verifyTokenHandler);

// GET /api/admin/me - Get current admin details
router.get('/me', authenticateAdmin, getCurrentAdmin);

module.exports = router;
