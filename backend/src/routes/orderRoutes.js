/**
 * Order Routes
 * Routes for order management
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Order routes (all protected)
router.route('/')
    .get(protect, orderController.getAllOrders);

router.route('/:id/status')
    .patch(protect, orderController.updateOrderStatus);

module.exports = router;
