/**
 * Menu Routes
 * Routes for menu management with role-based access control
 */

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { autoTransform } = require('../utils/responseTransformer');
const { upload } = require('../config/cloudinary');

// Public routes (no authentication required)
// Apply response transformer for public access
router.route('/categories')
    .get(autoTransform('menu'), menuController.getCategories);

router.route('/')
    .get(autoTransform('menu'), menuController.getMenuItems);

router.route('/:id')
    .get(autoTransform('menu'), menuController.getMenuItem);

// Admin routes (authentication required)
// These will be mounted under /admin/menu
const adminRouter = express.Router();

// Admin and Manager can view all menu items (with full details)
adminRouter.route('/')
    .get(protect, authorize('admin', 'manager'), autoTransform('menu'), menuController.getMenuItems)
    .post(protect, authorize('admin', 'manager'), upload.single('image'), menuController.createMenuItem);

// Admin and Manager can update/delete
adminRouter.route('/:id')
    .put(protect, authorize('admin', 'manager'), upload.single('image'), menuController.updateMenuItem)
    .delete(protect, authorize('admin'), menuController.deleteMenuItem);

// Admin and Manager can toggle availability
adminRouter.route('/:id/availability')
    .patch(protect, authorize('admin', 'manager'), menuController.toggleAvailability);

module.exports = {
    publicRouter: router,
    adminRouter: adminRouter,
};
