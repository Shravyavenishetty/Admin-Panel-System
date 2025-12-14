/**
 * Staff Controller
 * Handles staff CRUD operations (Create, Read, Delete)
 */

const Staff = require('../models/Staff');

/**
 * Get all staff
 * GET /admin/staff
 */
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: staff.length,
            data: staff,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching staff',
            error: error.message,
        });
    }
};

/**
 * Create new staff
 * POST /admin/staff
 */
exports.createStaff = async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;

        // Check if email already exists
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        }

        const staff = await Staff.create({
            name,
            email,
            phone,
            role,
        });

        res.status(201).json({
            success: true,
            message: 'Staff created successfully',
            data: staff,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating staff',
            error: error.message,
        });
    }
};

/**
 * Delete staff
 * DELETE /admin/staff/:id
 */
exports.deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Staff deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting staff',
            error: error.message,
        });
    }
};
