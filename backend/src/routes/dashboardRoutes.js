/**
 * Dashboard Routes
 * Routes for dashboard-specific features
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Dashboard routes (all protected)
router.route('/recent-activity')
    .get(protect, dashboardController.getRecentActivity);

module.exports = router;
