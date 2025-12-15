/**
 * Pricing Service
 * Handles all pricing calculations including distance fees, GST, and zone modifiers
 */

const SystemConfig = require('../models/SystemConfig');
const ZonePricingRule = require('../models/ZonePricingRule');
const { calculateDistance, isPointInZone } = require('../utils/distanceCalculator');

/**
 * Get system configuration (cached)
 */
let cachedConfig = null;
let configLastFetch = null;
const CONFIG_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

async function getSystemConfig() {
    const now = Date.now();

    if (cachedConfig && configLastFetch && (now - configLastFetch < CONFIG_CACHE_TIME)) {
        return cachedConfig;
    }

    let config = await SystemConfig.findById('system-config');

    // Create default config if doesn't exist
    if (!config) {
        config = await SystemConfig.create({
            _id: 'system-config',
            gstRate: 0.05,
            baseDeliveryFee: 20,
            perKmRate: 10,
            freeDeliveryThreshold: 500,
            maxDeliveryDistance: 15,
        });
    }

    cachedConfig = config;
    configLastFetch = now;

    return config;
}

/**
 * Calculate subtotal from order items
 * @param {Array} items - Array of {menuItem, quantity, price}
 * @returns {number} Subtotal amount
 */
function calculateSubtotal(items) {
    if (!items || items.length === 0) return 0;

    return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

/**
 * Calculate distance-based delivery fee
 * @param {number} distanceKm - Distance in kilometers
 * @param {object} config - System configuration
 * @returns {number} Delivery fee
 */
function calculateDistanceFee(distanceKm, config) {
    if (distanceKm <= 0) return 0;

    const { baseDeliveryFee, perKmRate } = config;

    return baseDeliveryFee + (perKmRate * distanceKm);
}

/**
 * Calculate GST amount
 * @param {number} subtotal - Subtotal amount
 * @param {number} gstRate - GST rate (e.g., 0.05 for 5%)
 * @returns {number} GST amount
 */
function calculateGST(subtotal, gstRate) {
    return subtotal * gstRate;
}

/**
 * Find applicable zone for given coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {object|null} Zone pricing rule or null
 */
async function findApplicableZone(lat, lng) {
    const zones = await ZonePricingRule.find({ active: true }).sort({ priority: -1 });

    for (const zone of zones) {
        if (isPointInZone(lat, lng, zone.centerLat, zone.centerLng, zone.radiusKm)) {
            return zone;
        }
    }

    return null;
}

/**
 * Apply zone modifier to amount
 * @param {number} amount - Base amount
 * @param {object} zone - Zone pricing rule
 * @returns {number} Modifier amount (can be positive or negative)
 */
function applyZoneModifier(amount, zone) {
    if (!zone) return 0;

    if (zone.modifierType === 'percent') {
        return (amount * zone.value) / 100;
    }

    // Fixed modifier
    return zone.value;
}

/**
 * Calculate complete order pricing
 * @param {object} orderData - Order data including items, outlet, delivery address
 * @param {object} outletLocation - Outlet coordinates {lat, lng}
 * @param {object} deliveryLocation - Delivery coordinates {lat, lng}
 * @returns {object} Complete pricing breakdown
 */
async function calculateOrderPricing(orderData, outletLocation, deliveryLocation) {
    const config = await getSystemConfig();

    // 1. Calculate subtotal
    const subtotal = calculateSubtotal(orderData.items);

    // 2. Calculate distance
    const distanceKm = calculateDistance(
        outletLocation.lat,
        outletLocation.lng,
        deliveryLocation.lat,
        deliveryLocation.lng
    );

    // Check if distance exceeds max delivery distance
    if (distanceKm > config.maxDeliveryDistance) {
        throw new Error(`Delivery distance (${distanceKm} km) exceeds maximum allowed distance (${config.maxDeliveryDistance} km)`);
    }

    // 3. Calculate distance fee (waived if subtotal exceeds threshold)
    let distanceFee = 0;
    if (subtotal < config.freeDeliveryThreshold) {
        distanceFee = calculateDistanceFee(distanceKm, config);
    }

    // 4. Find applicable zone
    const zone = await findApplicableZone(deliveryLocation.lat, deliveryLocation.lng);

    // 5. Apply zone modifier
    const baseAmount = subtotal + distanceFee;
    const zoneModifier = applyZoneModifier(baseAmount, zone);

    // 6. Calculate GST
    const taxableAmount = baseAmount + zoneModifier;
    const gstAmount = calculateGST(taxableAmount, config.gstRate);

    // 7. Calculate final price
    const finalPrice = taxableAmount + gstAmount;

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        distanceKm: Math.round(distanceKm * 100) / 100,
        distanceFee: Math.round(distanceFee * 100) / 100,
        zoneModifier: Math.round(zoneModifier * 100) / 100,
        zoneName: zone ? zone.name : null,
        zoneId: zone ? zone.zoneId : null,
        gstAmount: Math.round(gstAmount * 100) / 100,
        gstRate: config.gstRate,
        finalPrice: Math.round(finalPrice * 100) / 100,
        freeDelivery: subtotal >= config.freeDeliveryThreshold,
        breakdown: {
            itemsTotal: subtotal,
            deliveryFee: distanceFee,
            zoneCharge: zoneModifier,
            tax: gstAmount,
            total: finalPrice,
        },
    };
}

module.exports = {
    getSystemConfig,
    calculateSubtotal,
    calculateDistanceFee,
    calculateGST,
    findApplicableZone,
    applyZoneModifier,
    calculateOrderPricing,
};
