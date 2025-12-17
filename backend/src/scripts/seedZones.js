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
        zoneId: 'GNT001',
        name: 'Guntur Central',
        description: 'Main city center - Arundelpet, Lakshmipuram, Brodipet',
        centerLat: 16.3067,
        centerLng: 80.4365,
        radiusKm: 2,
        modifierType: 'fixed',
        value: 0, // No extra charge
        active: true,
        priority: 10,
    },
    {
        zoneId: 'GNT002',
        name: 'Guntur North',
        description: 'Pattabhipuram, Koritepadu, Santhipuram',
        centerLat: 16.3250,
        centerLng: 80.4350,
        radiusKm: 3,
        modifierType: 'fixed',
        value: 15, // ₹15 extra
        active: true,
        priority: 8,
    },
    {
        zoneId: 'GNT003',
        name: 'Guntur South',
        description: 'Nallapadu, Pedakakani, Etukuru areas',
        centerLat: 16.2850,
        centerLng: 80.4400,
        radiusKm: 3.5,
        modifierType: 'fixed',
        value: 20, // ₹20 extra
        active: true,
        priority: 7,
    },
    {
        zoneId: 'GNT004',
        name: 'Guntur East - Mangalagiri Side',
        description: 'Mangalagiri approach, industrial areas',
        centerLat: 16.3050,
        centerLng: 80.4600,
        radiusKm: 2.5,
        modifierType: 'fixed',
        value: 25, // ₹25 extra
        active: true,
        priority: 6,
    },
    {
        zoneId: 'GNT005',
        name: 'Guntur West - Transport Hub',
        description: 'Railway station, Bus stand, Gorantla',
        centerLat: 16.3000,
        centerLng: 80.4200,
        radiusKm: 2,
        modifierType: 'fixed',
        value: 10, // ₹10 extra
        active: true,
        priority: 9,
    },
    {
        zoneId: 'GNT006',
        name: 'Guntur Outer - Ring Road',
        description: 'Outer ring areas, Brindavan Gardens, Collector office side',
        centerLat: 16.3300,
        centerLng: 80.4650,
        radiusKm: 4,
        modifierType: 'fixed',
        value: 30, // ₹30 extra
        active: true,
        priority: 5,
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
