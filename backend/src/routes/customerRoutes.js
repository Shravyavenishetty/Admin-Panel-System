/**
 * Customer Routes
 * Public routes for customer authentication
 */

const express = require('express');
const router = express.Router();
const customerAuthController = require('../controllers/customerAuthController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', customerAuthController.customerLogin);
router.post('/register', customerAuthController.customerRegister);

// Protected routes
router.get('/me', protect, customerAuthController.getCustomerProfile);

module.exports = router;
