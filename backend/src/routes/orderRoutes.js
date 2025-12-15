/**
 * Order Routes
 * Routes for order management
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Public/User routes
router.route('/calculate')
    .post(orderController.calculatePricing);

router.route('/')
    .post(orderController.createOrder);

router.route('/:id')
    .get(orderController.getOrder);

// Admin routes
router.route('/admin/all')
    .get(protect, orderController.getAllOrders);

router.route('/:id/status')
    .patch(protect, orderController.updateOrderStatus);

router.route('/:id/assign-agent')
    .patch(protect, orderController.assignDeliveryAgent);

module.exports = router;
