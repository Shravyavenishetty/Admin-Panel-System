/**
 * System Config Routes
 * Routes for system configuration management (Admin only)
 */

const express = require('express');
const router = express.Router();
const configController = require('../controllers/systemConfigController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, configController.getConfig)
    .put(protect, configController.updateConfig);

module.exports = router;
