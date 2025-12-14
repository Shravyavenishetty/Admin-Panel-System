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
