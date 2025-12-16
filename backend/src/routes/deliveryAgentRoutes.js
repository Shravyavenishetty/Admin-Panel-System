/**
 * Delivery Agent Routes
 * Routes for delivery agent management
 */

const express = require('express');
const router = express.Router();
const deliveryAgentController = require('../controllers/deliveryAgentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { autoTransform } = require('../utils/responseTransformer');

// Admin and Manager can view agents
router.route('/')
    .get(protect, authorize('admin', 'manager'), autoTransform('deliveryAgent'), deliveryAgentController.getAllAgents)
    .post(protect, authorize('admin'), deliveryAgentController.createAgent); // Only admin can create

router.route('/:id')
    .put(protect, authorize('admin', 'manager'), deliveryAgentController.updateAgent) // Admin and Manager can update
    .delete(protect, authorize('admin'), deliveryAgentController.deleteAgent); // Only admin can delete

// Update agent status (Admin and Manager)
router.route('/:id/status')
    .patch(protect, authorize('admin', 'manager'), deliveryAgentController.updateAgentStatus);

module.exports = router;
