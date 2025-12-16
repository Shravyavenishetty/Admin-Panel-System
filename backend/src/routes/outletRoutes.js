/**
 * Outlet Routes
 * Routes for outlet management with role-based access control
 */

const express = require('express');
const router = express.Router();
const publicRouter = express.Router();
const outletController = require('../controllers/outletController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { autoTransform } = require('../utils/responseTransformer');

// Public route - for user app to see available outlets
publicRouter.route('/')
    .get(outletController.getPublicOutlets);

// Admin routes (protected)
// Admin and Manager can view
router.route('/')
    .get(protect, authorize('admin', 'manager'), autoTransform('outlet'), outletController.getAllOutlets)
    .post(protect, authorize('admin'), outletController.createOutlet); // Only admin can create

router.route('/:id')
    .put(protect, authorize('admin'), outletController.updateOutlet) // Only admin can update
    .delete(protect, authorize('admin'), outletController.deleteOutlet); // Only admin can delete

module.exports = {
    adminRouter: router,
    publicRouter: publicRouter,
};
