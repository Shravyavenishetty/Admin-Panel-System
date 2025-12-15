/**
 * Menu Routes
 * Routes for menu management
 */

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public routes (no authentication required)
router.route('/categories')
    .get(menuController.getCategories);

router.route('/')
    .get(menuController.getMenuItems);

router.route('/:id')
    .get(menuController.getMenuItem);

// Admin routes (authentication required)
// These will be mounted under /admin/menu
const adminRouter = express.Router();

adminRouter.route('/')
    .post(protect, upload.single('image'), menuController.createMenuItem);

adminRouter.route('/:id')
    .put(protect, upload.single('image'), menuController.updateMenuItem)
    .delete(protect, menuController.deleteMenuItem);

adminRouter.route('/:id/availability')
    .patch(protect, menuController.toggleAvailability);

module.exports = {
    publicRouter: router,
    adminRouter: adminRouter,
};
