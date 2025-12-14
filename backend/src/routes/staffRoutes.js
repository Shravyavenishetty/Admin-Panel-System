/**
 * Staff Routes
 * Routes for staff management
 */

const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect } = require('../middleware/auth');

// Staff routes (all protected)
router.route('/')
    .get(protect, staffController.getAllStaff)
    .post(protect, staffController.createStaff);

router.route('/:id')
    .put(protect, staffController.updateStaff)
    .delete(protect, staffController.deleteStaff);

module.exports = router;
