/**
 * System Configuration Model
 * Stores global system settings for pricing, taxes, etc.
 */

const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
    // There should only be one config document
    _id: {
        type: String,
        default: 'system-config',
    },

    // GST Configuration
    gstRate: {
        type: Number,
        required: true,
        default: 0.05, // 5%
        min: 0,
        max: 1,
    },

    // Distance-based delivery pricing
    baseDeliveryFee: {
        type: Number,
        required: true,
        default: 20, // ₹20 base fee
        min: 0,
    },
    perKmRate: {
        type: Number,
        required: true,
        default: 10, // ₹10 per km
        min: 0,
    },
    freeDeliveryThreshold: {
        type: Number,
        default: 500, // Free delivery above ₹500
        min: 0,
    },
    maxDeliveryDistance: {
        type: Number,
        default: 15, // Maximum 15 km
        min: 1,
    },

    // Other settings
    currency: {
        type: String,
        default: 'INR',
    },
    currencySymbol: {
        type: String,
        default: '₹',
    },

    // Operational hours
    operatingHours: {
        start: {
            type: String,
            default: '09:00',
        },
        end: {
            type: String,
            default: '23:00',
        },
    },
}, {
    timestamps: true,
});

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);

module.exports = SystemConfig;
