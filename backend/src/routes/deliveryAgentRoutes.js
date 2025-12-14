/**
 * Delivery Agent Routes
 * Routes for delivery agent management
 */

const express = require('express');
const router = express.Router();
const agentController = require('../controllers/deliveryAgentController');
const { protect } = require('../middleware/auth');

// Delivery agent routes (all protected)
router.route('/')
    .get(protect, agentController.getAllAgents)
    .post(protect, agentController.createAgent);

router.route('/:id')
    .delete(protect, agentController.deleteAgent);

module.exports = router;
