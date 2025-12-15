/**
 * Zone Pricing Controller
 * Handles zone pricing rules management
 */

const ZonePricingRule = require('../models/ZonePricingRule');
const { buildPagination, buildPaginationMeta } = require('../utils/queryBuilder');

/**
 * Get all zone pricing rules
 * GET /admin/zones

 */
exports.getAllZones = async (req, res) => {
    try {
        const { page = 1, limit = 10, active } = req.query;

        let query = {};
        if (active !== undefined) {
            query.active = active === 'true';
        }

        const { skip, limit: limitNum, page: pageNum } = buildPagination(page, limit);

        const zones = await ZonePricingRule.find(query)
            .sort({ priority: -1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await ZonePricingRule.countDocuments(query);
        const pagination = buildPaginationMeta(total, pageNum, limitNum);

        res.status(200).json({
            success: true,
            data: zones,
            pagination,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching zone pricing rules',
            error: error.message,
        });
    }
};

/**
 * Get single zone pricing rule
 * GET /admin/zones/:id
 */
exports.getZone = async (req, res) => {
    try {
        const zone = await ZonePricingRule.findById(req.params.id);

        if (!zone) {
            return res.status(404).json({
                success: false,
                message: 'Zone pricing rule not found',
            });
        }

        res.status(200).json({
            success: true,
            data: zone,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching zone pricing rule',
            error: error.message,
        });
    }
};

/**
 * Create zone pricing rule
 * POST /admin/zones
 */
exports.createZone = async (req, res) => {
    try {
        const zone = await ZonePricingRule.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Zone pricing rule created successfully',
            data: zone,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating zone pricing rule',
            error: error.message,
        });
    }
};

/**
 * Update zone pricing rule
 * PUT /admin/zones/:id
 */
exports.updateZone = async (req, res) => {
    try {
        const zone = await ZonePricingRule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!zone) {
            return res.status(404).json({
                success: false,
                message: 'Zone pricing rule not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Zone pricing rule updated successfully',
            data: zone,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating zone pricing rule',
            error: error.message,
        });
    }
};

/**
 * Delete zone pricing rule
 * DELETE /admin/zones/:id
 */
exports.deleteZone = async (req, res) => {
    try {
        const zone = await ZonePricingRule.findByIdAndDelete(req.params.id);

        if (!zone) {
            return res.status(404).json({
                success: false,
                message: 'Zone pricing rule not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Zone pricing rule deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting zone pricing rule',
            error: error.message,
        });
    }
};

/**
 * Toggle zone active status
 * PATCH /admin/zones/:id/toggle
 */
exports.toggleZoneStatus = async (req, res) => {
    try {
        const zone = await ZonePricingRule.findById(req.params.id);

        if (!zone) {
            return res.status(404).json({
                success: false,
                message: 'Zone pricing rule not found',
            });
        }

        zone.active = !zone.active;
        await zone.save();

        res.status(200).json({
            success: true,
            message: `Zone ${zone.active ? 'activated' : 'deactivated'}`,
            data: zone,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling zone status',
            error: error.message,
        });
    }
};
