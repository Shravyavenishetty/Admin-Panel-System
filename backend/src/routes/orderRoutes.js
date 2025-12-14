/**
 * Order Routes
 * Routes for order management
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Order routes
router.route('/')
    .get(orderController.getAllOrders);

router.route('/:id/status')
    .patch(orderController.updateOrderStatus);

module.exports = router;
