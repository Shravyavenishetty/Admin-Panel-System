/**
 * Outlet Routes
 * Routes for outlet management
 */

const express = require('express');
const router = express.Router();
const outletController = require('../controllers/outletController');
const { protect } = require('../middleware/auth');

// Outlet routes (all protected)
router.route('/')
    .get(protect, outletController.getAllOutlets)
    .post(protect, outletController.createOutlet);

router.route('/:id')
    .delete(protect, outletController.deleteOutlet);

module.exports = router;
