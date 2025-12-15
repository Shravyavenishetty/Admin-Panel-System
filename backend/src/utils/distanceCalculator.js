/**
 * Distance Calculator Utility
 * Implements Haversine formula for calculating distance between two coordinates
 */

/**
 * Convert degrees to radians
 */
function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    // Round to 2 decimal places
    return Math.round(distance * 100) / 100;
}

/**
 * Check if a point is within a zone
 * @param {number} pointLat - Point latitude
 * @param {number} pointLng - Point longitude
 * @param {number} zoneLat - Zone center latitude
 * @param {number} zoneLng - Zone center longitude
 * @param {number} radiusKm - Zone radius in km
 * @returns {boolean} True if point is within zone
 */
function isPointInZone(pointLat, pointLng, zoneLat, zoneLng, radiusKm) {
    const distance = calculateDistance(pointLat, pointLng, zoneLat, zoneLng);
    return distance <= radiusKm;
}

module.exports = {
    calculateDistance,
    isPointInZone,
    toRad,
};
