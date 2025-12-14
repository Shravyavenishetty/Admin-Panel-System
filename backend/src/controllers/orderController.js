/**
 * Order Controller
 * Handles order operations (Read, Update Status)
 */

const Order = require('../models/Order');

/**
 * Get all orders with filters
 * GET /admin/orders?status=X&outlet=Y
 */
exports.getAllOrders = async (req, res) => {
    try {
        const { status, outlet } = req.query;

        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (outlet) filter.outlet = outlet;

        const orders = await Order.find(filter)
            .populate('outlet', 'name address')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message,
        });
    }
};

/**
 * Update order status
 * PATCH /admin/orders/:id/status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required',
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('outlet', 'name address');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating order status',
            error: error.message,
        });
    }
};
