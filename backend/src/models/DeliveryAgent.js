/**
 * Delivery Agent Model
 * Represents delivery agents for order fulfillment
 */

const mongoose = require('mongoose');

const deliveryAgentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Agent name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    vehicleType: {
        type: String,
        enum: ['bike', 'car', 'bicycle'],
        default: 'bike',
    },
    status: {
        type: String,
        enum: ['available', 'busy', 'offline'],
        default: 'available',
    },
}, {
    timestamps: true,
});

// Index for faster queries
deliveryAgentSchema.index({ email: 1 });
deliveryAgentSchema.index({ status: 1 });

const DeliveryAgent = mongoose.model('DeliveryAgent', deliveryAgentSchema);

module.exports = DeliveryAgent;
