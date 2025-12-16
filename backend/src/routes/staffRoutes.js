/**
 * Staff Routes
 * Routes for staff management (Admin only)
 */

const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { autoTransform } = require('../utils/responseTransformer');

// All staff routes require admin role
router.route('/')
    .get(protect, authorize('admin'), autoTransform('staff'), staffController.getAllStaff)
    .post(protect, authorize('admin'), staffController.createStaff);

router.route('/:id')
    .put(protect, authorize('admin'), staffController.updateStaff)
    .delete(protect, authorize('admin'), staffController.deleteStaff);

module.exports = router;
