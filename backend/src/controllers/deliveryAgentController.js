/**
 * Delivery Agent Controller
 * Handles delivery agent CRUD operations (Create, Read, Delete)
 */

const DeliveryAgent = require('../models/DeliveryAgent');
const Order = require('../models/Order');
const { getIO } = require('../config/socket');

/**
 * Get all delivery agents
 * GET /admin/agents
 */
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await DeliveryAgent.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: agents.length,
            data: agents,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching delivery agents',
            error: error.message,
        });
    }
};

/**
 * Create new delivery agent
 * POST /admin/agents
 */
exports.createAgent = async (req, res) => {
    try {
        const { name, email, phone, vehicleType } = req.body;

        // Check if email already exists
        const existingAgent = await DeliveryAgent.findOne({ email });
        if (existingAgent) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        }

        const agent = await DeliveryAgent.create({
            name,
            email,
            phone,
            vehicleType,
        });

        // Emit WebSocket event
        const io = getIO();
        io.emit('agentCreated', {
            _id: agent._id,
            name: agent.name,
            status: agent.status
        });

        res.status(201).json({
            success: true,
            message: 'Delivery agent created successfully',
            data: agent,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating delivery agent',
            error: error.message,
        });
    }
};

/**
 * Delete delivery agent
 * DELETE /admin/agents/:id
 */
exports.deleteAgent = async (req, res) => {
    try {
        const agent = await DeliveryAgent.findByIdAndDelete(req.params.id);

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: 'Delivery agent not found',
            });
        }

        // Emit WebSocket event
        const io = getIO();
        io.emit('agentDeleted', {
            id: agent._id,
            name: agent.name
        });

        res.status(200).json({
            success: true,
            message: 'Delivery agent deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting delivery agent',
            error: error.message,
        });
    }
};

/**
 * Update delivery agent status
 * PATCH /admin/delivery-agents/:id/status
 */
exports.updateAgentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        const validStatuses = ['available', 'busy', 'offline'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: available, busy, or offline'
            });
        }

        const agent = await DeliveryAgent.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: 'Delivery agent not found'
            });
        }

        // Emit WebSocket event
        const io = getIO();
        io.emit('agentUpdated', {
            _id: agent._id,
            name: agent.name,
            status: agent.status
        });

        res.status(200).json({
            success: true,
            data: agent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating agent status',
            error: error.message
        });
    }
};

/**
 * Update delivery agent
 * PUT /admin/delivery-agents/:id
 */
exports.updateAgent = async (req, res) => {
    try {
        const { name, email, phone, vehicleType } = req.body;

        // Check if email is being changed and already exists
        if (email) {
            const existing = await DeliveryAgent.findOne({ email, _id: { $ne: req.params.id } });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists',
                });
            }
        }

        const agent = await DeliveryAgent.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, vehicleType },
            { new: true, runValidators: true }
        );

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: 'Delivery agent not found',
            });
        }

        // Emit WebSocket event
        const io = getIO();
        io.emit('agentUpdated', {
            _id: agent._id,
            name: agent.name,
            status: agent.status
        });

        res.status(200).json({
            success: true,
            message: 'Delivery agent updated successfully',
            data: agent,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating delivery agent',
            error: error.message,
        });
    }
};
