/**
 * System Config Controller
 * Handles system configuration management
 */

const SystemConfig = require('../models/SystemConfig');

/**
 * Get system configuration
 * GET /admin/config
 */
exports.getConfig = async (req, res) => {
    try {
        let config = await SystemConfig.findById('system-config');

        // Create default config if doesn't exist
        if (!config) {
            config = await SystemConfig.create({
                _id: 'system-config',
                gstRate: 0.05,
                baseDeliveryFee: 20,
                perKmRate: 10,
                freeDeliveryThreshold: 500,
                maxDeliveryDistance: 15,
            });
        }

        res.status(200).json({
            success: true,
            data: config,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching system configuration',
            error: error.message,
        });
    }
};

/**
 * Update system configuration
 * PUT /admin/config
 */
exports.updateConfig = async (req, res) => {
    try {
        // Upsert: update if exists, create if doesn't
        const config = await SystemConfig.findOneAndUpdate(
            { _id: 'system-config' },
            req.body,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'System configuration updated successfully',
            data: config,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating system configuration',
            error: error.message,
        });
    }
};
