/**
 * Zone Pricing Rule Model
 * Defines zone-based pricing modifiers for delivery
 */

const mongoose = require('mongoose');

const zonePricingRuleSchema = new mongoose.Schema({
    zoneId: {
        type: String,
        required: [true, 'Zone ID is required'],
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Zone name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    // Geographic boundaries (simplified - lat/lng center + radius)
    centerLat: {
        type: Number,
        required: true,
    },
    centerLng: {
        type: Number,
        required: true,
    },
    radiusKm: {
        type: Number,
        required: true,
        min: 0.1,
    },
    modifierType: {
        type: String,
        enum: ['percent', 'fixed'],
        required: true,
        default: 'percent',
    },
    value: {
        type: Number,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    priority: {
        type: Number,
        default: 0, // Higher priority zones override lower ones if overlapping
    },
}, {
    timestamps: true,
});

// Index for geospatial queries (optional enhancement)
zonePricingRuleSchema.index({ centerLat: 1, centerLng: 1 });
zonePricingRuleSchema.index({ active: 1 });

const ZonePricingRule = mongoose.model('ZonePricingRule', zonePricingRuleSchema);

module.exports = ZonePricingRule;
