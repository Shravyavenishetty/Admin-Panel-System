/**
 * Order Routes
 * Routes for order management with role-based access control
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { autoTransform } = require('../utils/responseTransformer');

// Public/User routes
// Anyone can calculate pricing
router.route('/calculate')
    .post(orderController.calculatePricing);

// Authenticated users can create orders
router.route('/')
    .post(protect, autoTransform('order'), orderController.createOrder);

// Get single order - users can only see their own, admin/manager see all
router.route('/:id')
    .get(protect, autoTransform('order'), orderController.getOrder);

// Get order timeline (status history)
router.route('/:id/timeline')
    .get(protect, orderController.getOrderTimeline);

// Admin and Manager routes
// View all orders
router.route('/admin/all')
    .get(protect, authorize('admin', 'manager'), autoTransform('order'), orderController.getAllOrders);

// Update order status (Admin and Manager)
router.route('/:id/status')
    .patch(protect, authorize('admin', 'manager'), orderController.updateOrderStatus);

// Assign delivery agent (Admin only)
router.route('/:id/assign-agent')
    .patch(protect, authorize('admin'), orderController.assignDeliveryAgent);

module.exports = router;
