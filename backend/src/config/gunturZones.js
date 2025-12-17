/**
 * Guntur Zones Configuration
 * Maps zone names to coordinates for automatic location assignment
 */

const GUNTUR_ZONES = {
    'Guntur South': {
        lat: 16.2850,
        lng: 80.4350,
        description: 'Southern part of Guntur city'
    },
    'Guntur North': {
        lat: 16.3250,
        lng: 80.4400,
        description: 'Northern part of Guntur city'
    },
    'Guntur Central': {
        lat: 16.3067,
        lng: 80.4365,
        description: 'Central Guntur area'
    },
    'Guntur East': {
        lat: 16.3100,
        lng: 80.4550,
        description: 'Eastern part of Guntur city'
    },
    'Guntur West': {
        lat: 16.3000,
        lng: 80.4200,
        description: 'Western part of Guntur city'
    },
    'Guntur Outer': {
        lat: 16.3200,
        lng: 80.4200,
        description: 'Outer areas of Guntur'
    }
};

/**
 * Get coordinates for a zone
 * @param {string} zoneName - Name of the zone
 * @returns {Object|null} - {lat, lng} or null if zone not found
 */
function getZoneCoordinates(zoneName) {
    const zone = GUNTUR_ZONES[zoneName];
    if (!zone) return null;

    return {
        lat: zone.lat,
        lng: zone.lng
    };
}

/**
 * Get all available zones
 * @returns {Array} - Array of zone names
 */
function getAllZones() {
    return Object.keys(GUNTUR_ZONES);
}

/**
 * Validate if zone exists
 * @param {string} zoneName - Name of the zone
 * @returns {boolean}
 */
function isValidZone(zoneName) {
    return zoneName in GUNTUR_ZONES;
}

module.exports = {
    GUNTUR_ZONES,
    getZoneCoordinates,
    getAllZones,
    isValidZone
};
