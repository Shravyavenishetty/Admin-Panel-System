/**
 * Sample Zone Pricing Rules Seeder
 * Creates sample zone pricing rules for testing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ZonePricingRule = require('../models/ZonePricingRule');
const connectDB = require('../config/database');

const sampleZones = [
    {
        zoneId: 'ZONE001',
        name: 'Downtown High-Traffic Zone',
        description: 'City center with high traffic and order volume',
        centerLat: 12.9716, // Bangalore MG Road area
        centerLng: 77.5946,
        radiusKm: 2.5,
        modifierType: 'percent',
        value: 10, // +10% surcharge
        active: true,
        priority: 10,
    },
    {
        zoneId: 'ZONE002',
        name: 'Quick Delivery Zone',
        description: 'Nearby areas with fast delivery promise',
        centerLat: 12.9352, // Bangalore Indiranagar
        centerLng: 77.6406,
        radiusKm: 3,
        modifierType: 'percent',
        value: -5, // -5% discount
        active: true,
        priority: 5,
    },
    {
        zoneId: 'ZONE003',
        name: 'Surge Pricing Zone',
        description: 'High demand area during peak hours',
        centerLat: 12.9698, // Bangalore Koramangala
        centerLng: 77.6400,
        radiusKm: 2,
        modifierType: 'fixed',
        value: 25, // +₹25 fixed fee
        active: true,
        priority: 8,
    },
    {
        zoneId: 'ZONE004',
        name: 'Suburban Normal Zone',
        description: 'Regular suburban areas with standard pricing',
        centerLat: 13.0358, // Bangalore Yelahanka
        centerLng: 77.5970,
        radiusKm: 5,
        modifierType: 'percent',
        value: 0, // No modifier
        active: true,
        priority: 1,
    },
];

async function seedZones() {
    try {
        await connectDB();

        // Clear existing zones
        await ZonePricingRule.deleteMany({});
        console.log('Cleared existing zone pricing rules');

        // Insert sample zones
        const zones = await ZonePricingRule.insertMany(sampleZones);
        console.log(`✅ Created ${zones.length} sample zone pricing rules`);

        zones.forEach(zone => {
            console.log(`  - ${zone.name} (${zone.zoneId}): ${zone.modifierType === 'percent' ? zone.value + '%' : '₹' + zone.value}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding zones:', error);
        process.exit(1);
    }
}

// Run seeder
if (require.main === module) {
    seedZones();
}

module.exports = seedZones;
