/**
 * Update Outlets with Guntur Coordinates
 * Adds location data to existing outlets
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Outlet = require('../models/Outlet');
const connectDB = require('../config/database');

// Guntur coordinates
const GUNTUR_COORDS = {
    lat: 16.3067,
    lng: 80.4365
};

async function updateOutletLocations() {
    try {
        await connectDB();

        // Update all outlets without location data
        const result = await Outlet.updateMany(
            {
                $or: [
                    { 'location.lat': { $exists: false } },
                    { 'location.lng': { $exists: false } },
                    { 'location.lat': null },
                    { 'location.lng': null }
                ]
            },
            {
                $set: {
                    'location.lat': GUNTUR_COORDS.lat,
                    'location.lng': GUNTUR_COORDS.lng
                }
            }
        );

        console.log(`✅ Updated ${result.modifiedCount} outlets with Guntur coordinates`);
        console.log(`   Coordinates: ${GUNTUR_COORDS.lat}, ${GUNTUR_COORDS.lng}`);

        // Show updated outlets
        const outlets = await Outlet.find({});
        console.log('\n📍 All Outlets:');
        outlets.forEach(outlet => {
            console.log(`   - ${outlet.name} (${outlet.city})`);
            console.log(`     Location: ${outlet.location?.lat || 'N/A'}, ${outlet.location?.lng || 'N/A'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating outlets:', error);
        process.exit(1);
    }
}

// Run updater
if (require.main === module) {
    updateOutletLocations();
}

module.exports = updateOutletLocations;
