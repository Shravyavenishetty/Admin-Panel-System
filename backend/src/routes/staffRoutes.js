/**
 * Staff Routes
 * Routes for staff management
 */

const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Staff routes
router.route('/')
    .get(staffController.getAllStaff)
    .post(staffController.createStaff);

router.route('/:id')
    .delete(staffController.deleteStaff);

module.exports = router;
