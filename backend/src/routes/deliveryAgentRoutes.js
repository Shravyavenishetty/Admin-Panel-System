/**
 * Delivery Agent Routes
 * Routes for delivery agent management
 */

const express = require('express');
const router = express.Router();
const agentController = require('../controllers/deliveryAgentController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Delivery agent routes
router.route('/')
    .get(agentController.getAllAgents)
    .post(agentController.createAgent);

router.route('/:id')
    .delete(agentController.deleteAgent);

module.exports = router;
