/**
 * Outlet Controller
 * Handles outlet CRUD operations (Create, Read, Delete)
 */

const Outlet = require('../models/Outlet');
const { getIO } = require('../config/socket');
const { getZoneCoordinates, isValidZone } = require('../config/gunturZones');

/**
 * Get all outlets
 * GET /admin/outlets
 */
exports.getAllOutlets = async (req, res) => {
    try {
        const outlets = await Outlet.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: outlets.length,
            data: outlets,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching outlets',
            error: error.message,
        });
    }
};

/**
 * Create new outlet
 * POST /admin/outlets
 */
exports.createOutlet = async (req, res) => {
    try {
        const { name, address, phone, city, zone } = req.body;

        // Auto-assign coordinates based on zone
        let location = {};
        if (zone && isValidZone(zone)) {
            const coords = getZoneCoordinates(zone);
            location = coords;
        }

        const outlet = await Outlet.create({
            name,
            address,
            phone,
            city,
            zone,
            location
        });

        // Emit WebSocket event
        const io = getIO();
        io.emit('outletCreated', {
            _id: outlet._id,
            name: outlet.name,
            city: outlet.city,
            zone: outlet.zone
        });

        res.status(201).json({
            success: true,
            message: 'Outlet created successfully',
            data: outlet,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating outlet',
            error: error.message,
        });
    }
};

/**
 * Delete outlet
 * DELETE /admin/outlets/:id
 */
exports.deleteOutlet = async (req, res) => {
    try {
        const outlet = await Outlet.findByIdAndDelete(req.params.id);

        if (!outlet) {
            return res.status(404).json({
                success: false,
                message: 'Outlet not found',
            });
        }

        // Emit WebSocket event
        const io = getIO();
        io.emit('outletDeleted', {
            id: outlet._id,
            name: outlet.name
        });

        res.status(200).json({
            success: true,
            message: 'Outlet deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting outlet',
            error: error.message,
        });
    }
};

/**
 * Update outlet
 * PUT /admin/outlets/:id
 */
exports.updateOutlet = async (req, res) => {
    try {
        const { name, address, phone, city, zone } = req.body;

        // Auto-assign coordinates based on zone
        let updateData = { name, address, phone, city, zone };
        if (zone && isValidZone(zone)) {
            const coords = getZoneCoordinates(zone);
            updateData.location = coords;
        }

        const outlet = await Outlet.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!outlet) {
            return res.status(404).json({
                success: false,
                message: 'Outlet not found',
            });
        }

        // Emit WebSocket event
        const io = getIO();
        io.emit('outletUpdated', {
            _id: outlet._id,
            name: outlet.name,
            city: outlet.city,
            zone: outlet.zone
        });

        res.status(200).json({
            success: true,
            message: 'Outlet updated successfully',
            data: outlet,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating outlet',
            error: error.message,
        });
    }
};

/**
 * Get public outlets (for user app)
 * GET /api/outlets
 * Public endpoint - no authentication required
 */
exports.getPublicOutlets = async (req, res) => {
    try {
        // Get all outlets and select only public fields
        const outlets = await Outlet.find()
            .select('name address city phone location')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: outlets.length,
            data: outlets,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching outlets',
            error: error.message,
        });
    }
};
