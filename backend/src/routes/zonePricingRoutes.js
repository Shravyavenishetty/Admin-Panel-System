/**
 * Zone Pricing Routes
 * Routes for zone pricing management (Admin only)
 */

const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zonePricingController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, zoneController.getAllZones)
    .post(protect, zoneController.createZone);

router.route('/:id')
    .get(protect, zoneController.getZone)
    .put(protect, zoneController.updateZone)
    .delete(protect, zoneController.deleteZone);

router.route('/:id/toggle')
    .patch(protect, zoneController.toggleZoneStatus);

module.exports = router;
