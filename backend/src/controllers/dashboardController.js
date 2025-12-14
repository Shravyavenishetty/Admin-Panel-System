/**
 * Dashboard Controller
 * Handles dashboard-specific endpoints like recent activity
 */

const Staff = require('../models/Staff');
const DeliveryAgent = require('../models/DeliveryAgent');
const Outlet = require('../models/Outlet');
const Order = require('../models/Order');

/**
 * Get recent activity across all entities
 * GET /admin/dashboard/recent-activity
 */
exports.getRecentActivity = async (req, res) => {
    try {
        const limit = 10; // Show last 10 activities

        // Fetch recent items from each collection
        const [recentStaff, recentAgents, recentOutlets, recentOrders] = await Promise.all([
            Staff.find().sort({ createdAt: -1 }).limit(3).select('name createdAt'),
            DeliveryAgent.find().sort({ createdAt: -1 }).limit(3).select('name createdAt'),
            Outlet.find().sort({ createdAt: -1 }).limit(3).select('name createdAt'),
            Order.find().sort({ createdAt: -1 }).limit(3).select('orderNumber customerName createdAt status').populate('outlet', 'name'),
        ]);

        // Combine and format activities
        const activities = [];

        recentStaff.forEach(staff => {
            activities.push({
                type: 'staff',
                title: `New staff member: ${staff.name}`,
                timestamp: staff.createdAt,
                icon: 'user',
            });
        });

        recentAgents.forEach(agent => {
            activities.push({
                type: 'agent',
                title: `New delivery agent: ${agent.name}`,
                timestamp: agent.createdAt,
                icon: 'truck',
            });
        });

        recentOutlets.forEach(outlet => {
            activities.push({
                type: 'outlet',
                title: `New outlet: ${outlet.name}`,
                timestamp: outlet.createdAt,
                icon: 'building',
            });
        });

        recentOrders.forEach(order => {
            activities.push({
                type: 'order',
                title: `Order ${order.orderNumber} - ${order.customerName}`,
                subtitle: order.outlet?.name,
                timestamp: order.createdAt,
                icon: 'receipt',
                status: order.status,
            });
        });

        // Sort by timestamp (most recent first) and limit
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentActivities = activities.slice(0, limit);

        res.status(200).json({
            success: true,
            count: recentActivities.length,
            data: recentActivities,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recent activity',
            error: error.message,
        });
    }
};
/**
 * Get dashboard statistics
 * GET /admin/dashboard/stats
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // Get counts for all entities
        const [staffCount, agentCount, outletCount, totalOrders] = await Promise.all([
            Staff.countDocuments(),
            DeliveryAgent.countDocuments(),
            Outlet.countDocuments(),
            Order.countDocuments(),
        ]);

        // Get order counts by status
        const orderStatusCounts = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Convert to object for easier access
        const statusCounts = {};
        orderStatusCounts.forEach(item => {
            statusCounts[item._id] = item.count;
        });

        // Get active orders (pending + preparing + ready)
        const activeOrders = (statusCounts.pending || 0) +
            (statusCounts.preparing || 0) +
            (statusCounts.ready || 0);

        // Calculate total revenue (for delivered orders)
        const revenueResult = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get pending tasks (orders that are pending)
        const pendingTasks = statusCounts.pending || 0;

        res.status(200).json({
            success: true,
            data: {
                totalStaff: staffCount,
                totalAgents: agentCount,
                totalOutlets: outletCount,
                totalOrders: totalOrders,
                activeOrders: activeOrders,
                totalRevenue: totalRevenue,
                pendingTasks: pendingTasks,
                ordersByStatus: statusCounts,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats',
            error: error.message,
        });
    }
};
