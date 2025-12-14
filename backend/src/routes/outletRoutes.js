/**
 * Outlet Routes
 * Routes for outlet management
 */

const express = require('express');
const router = express.Router();
const outletController = require('../controllers/outletController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Outlet routes
router.route('/')
    .get(outletController.getAllOutlets)
    .post(outletController.createOutlet);

router.route('/:id')
    .delete(outletController.deleteOutlet);

module.exports = router;
