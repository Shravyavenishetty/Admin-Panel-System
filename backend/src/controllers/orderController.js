/**
 * Order Controller
 * Handles order operations with integrated pricing engine
 */

const Order = require('../models/Order');
const Menu = require('../models/Menu');
const Outlet = require('../models/Outlet');
const { calculateOrderPricing } = require('../services/pricingService');
const {
    buildSearchQuery,
    buildFilterQuery,
    buildSortQuery,
    buildPagination,
    buildPaginationMeta,
    buildDateRangeQuery,
} = require('../utils/queryBuilder');

/**
 * Calculate order pricing (without creating order)
 * POST /api/orders/calculate
 */
exports.calculatePricing = async (req, res) => {
    try {
        const { items, outletId, deliveryAddress } = req.body;

        // Validate required fields
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Items are required',
            });
        }

        if (!outletId || !deliveryAddress || !deliveryAddress.lat || !deliveryAddress.lng) {
            return res.status(400).json({
                success: false,
                message: 'Outlet ID and delivery location (lat, lng) are required',
            });
        }

        // Get outlet location
        const outlet = await Outlet.findById(outletId);
        if (!outlet) {
            return res.status(404).json({
                success: false,
                message: 'Outlet not found',
            });
        }

        // Fetch menu items and calculate prices
        const orderItems = [];
        for (const item of items) {
            const menuItem = await Menu.findById(item.menuItemId);
            if (!menuItem) {
                return res.status(404).json({
                    success: false,
                    message: `Menu item ${item.menuItemId} not found`,
                });
            }

            if (!menuItem.availability) {
                return res.status(400).json({
                    success: false,
                    message: `${menuItem.name} is currently unavailable`,
                });
            }

            orderItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                quantity: item.quantity,
                price: menuItem.price,
            });
        }

        // Assume outlet has location (you may need to add lat/lng to Outlet model)
        const outletLocation = {
            lat: outlet.location?.lat || 12.9716, // Default: Bangalore coords
            lng: outlet.location?.lng || 77.5946,
        };

        const deliveryLocation = {
            lat: deliveryAddress.lat,
            lng: deliveryAddress.lng,
        };

        // Calculate pricing
        const pricing = await calculateOrderPricing(
            { items: orderItems },
            outletLocation,
            deliveryLocation
        );

        res.status(200).json({
            success: true,
            data: pricing,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error calculating order pricing',
            error: error.message,
        });
    }
};

/**
 * Create new order with automatic pricing
 * POST /api/orders
 */
exports.createOrder = async (req, res) => {
    try {
        const { customerName, customerPhone, items, outletId, deliveryAddress } = req.body;

        // Validate required fields
        if (!customerName || !customerPhone || !items || !outletId || !deliveryAddress) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Get outlet
        const outlet = await Outlet.findById(outletId);
        if (!outlet) {
            return res.status(404).json({
                success: false,
                message: 'Outlet not found',
            });
        }

        // Fetch menu items and build order items
        const orderItems = [];
        for (const item of items) {
            const menuItem = await Menu.findById(item.menuItemId);
            if (!menuItem) {
                return res.status(404).json({
                    success: false,
                    message: `Menu item ${item.menuItemId} not found`,
                });
            }

            if (!menuItem.availability) {
                return res.status(400).json({
                    success: false,
                    message: `${menuItem.name} is currently unavailable`,
                });
            }

            orderItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                quantity: item.quantity,
                price: menuItem.price,
            });
        }

        // Calculate pricing
        const outletLocation = {
            lat: outlet.location?.lat || 12.9716,
            lng: outlet.location?.lng || 77.5946,
        };

        const deliveryLocation = {
            lat: deliveryAddress.lat,
            lng: deliveryAddress.lng,
        };

        const pricing = await calculateOrderPricing(
            { items: orderItems },
            outletLocation,
            deliveryLocation
        );

        // Create order
        const order = await Order.create({
            customerName,
            customerPhone,
            outlet: outletId,
            items: orderItems,
            deliveryAddress: deliveryAddress.address,
            deliveryLocation: {
                lat: deliveryAddress.lat,
                lng: deliveryAddress.lng,
            },
            subtotal: pricing.subtotal,
            distanceKm: pricing.distanceKm,
            distanceFee: pricing.distanceFee,
            zoneModifier: pricing.zoneModifier,
            zoneName: pricing.zoneName,
            zoneId: pricing.zoneId,
            gstAmount: pricing.gstAmount,
            gstRate: pricing.gstRate,
            finalPrice: pricing.finalPrice,
            totalAmount: pricing.finalPrice, // Legacy field
        });

        const populatedOrder = await Order.findById(order._id)
            .populate('outlet', 'name address phone')
            .populate('items.menuItem', 'name category');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: populatedOrder,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating order',
            error: error.message,
        });
    }
};

/**
 * Get all orders with advanced filters
 * GET /admin/orders?status=&outlet=&search=&dateFrom=&dateTo=&page=1&limit=10&sort=-createdAt
 */
exports.getAllOrders = async (req, res) => {
    try {
        const {
            status,
            outlet,
            search,
            dateFrom,
            dateTo,
            page = 1,
            limit = 10,
            sort = '-createdAt',
        } = req.query;

        // Build query
        let query = {};

        // Add filters
        if (status) query.status = status;
        if (outlet) query.outlet = outlet;

        // Add search (customer name or phone or order number)
        if (search) {
            const searchQuery = buildSearchQuery(search, ['customerName', 'customerPhone', 'orderNumber']);
            query = { ...query, ...searchQuery };
        }

        // Add date range
        if (dateFrom || dateTo) {
            const dateQuery = buildDateRangeQuery(dateFrom, dateTo, 'createdAt');
            query = { ...query, ...dateQuery };
        }

        // Pagination
        const { skip, limit: limitNum, page: pageNum } = buildPagination(page, limit);

        // Sort
        const sortQuery = buildSortQuery(sort);

        // Execute query
        const orders = await Order.find(query)
            .populate('outlet', 'name address phone')
            .populate('deliveryAgent', 'name phone vehicleType')
            .populate('items.menuItem', 'name category')
            .sort(sortQuery)
            .skip(skip)
            .limit(limitNum);

        // Get total count
        const total = await Order.countDocuments(query);

        // Build pagination metadata
        const pagination = buildPaginationMeta(total, pageNum, limitNum);

        res.status(200).json({
            success: true,
            data: orders,
            pagination,
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
 * Get single order
 * GET /api/orders/:id
 */
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('outlet', 'name address phone')
            .populate('deliveryAgent', 'name phone vehicleType status')
            .populate('items.menuItem', 'name category price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
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
        const { status, note } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required',
            });
        }

        // Find order first to get current status
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Only add to history if status actually changed
        if (order.status !== status) {
            // Append to status history
            order.statusHistory.push({
                status: status,
                changedBy: req.user ? req.user._id : null,
                changedAt: new Date(),
                note: note || ''
            });
        }

        // Update status
        order.status = status;
        await order.save();

        // Populate for response
        await order.populate('outlet', 'name address');
        await order.populate('deliveryAgent', 'name phone');

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

/**
 * Get order timeline (status history)
 * GET /api/orders/:id/timeline
 */
exports.getOrderTimeline = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('statusHistory.changedBy', 'name email')
            .select('orderNumber statusHistory status');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check permissions: user can only see their own orders
        // Admin/Manager can see all
        if (req.user && req.user.role === 'user') {
            // Additional check needed: verify order belongs to user
            // For now, allow if authenticated
        }

        res.status(200).json({
            success: true,
            timeline: order.statusHistory,
            currentStatus: order.status
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching order timeline',
            error: error.message,
        });
    }
};

/**
 * Assign delivery agent to order
 * PATCH /admin/orders/:id/assign-agent
 */
exports.assignDeliveryAgent = async (req, res) => {
    try {
        const { agentId } = req.body;

        if (!agentId) {
            return res.status(400).json({
                success: false,
                message: 'Agent ID is required',
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { deliveryAgent: agentId, status: 'delivering' },
            { new: true }
        )
            .populate('outlet', 'name address')
            .populate('deliveryAgent', 'name phone vehicleType');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Delivery agent assigned successfully',
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error assigning delivery agent',
            error: error.message,
        });
    }
};
