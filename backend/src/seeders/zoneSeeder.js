/**
 * Zone Seeder
 * Seeds pricing zones for Guntur city
 */

const mongoose = require('mongoose');
const Zone = require('../models/Zone');
require('dotenv').config();

const gunturZones = [
    {
        name: 'Guntur Central',
        city: 'Guntur',
        description: 'Main city center and commercial areas',
        coordinates: [
            { lat: 16.3067, lng: 80.4365 },
            { lat: 16.3100, lng: 80.4400 },
            { lat: 16.3050, lng: 80.4450 },
            { lat: 16.3000, lng: 80.4400 },
        ],
        priceModifier: 0, // No extra charge for central areas
        isActive: true,
    },
    {
        name: 'Guntur North',
        city: 'Guntur',
        description: 'Pattabhipuram, Koritepadu, residential areas',
        coordinates: [
            { lat: 16.3200, lng: 80.4300 },
            { lat: 16.3300, lng: 80.4400 },
            { lat: 16.3250, lng: 80.4500 },
            { lat: 16.3150, lng: 80.4450 },
        ],
        priceModifier: 15, // ₹15 extra
        isActive: true,
    },
    {
        name: 'Guntur South',
        city: 'Guntur',
        description: 'Nallapadu, Pedakakani areas',
        coordinates: [
            { lat: 16.2900, lng: 80.4300 },
            { lat: 16.2950, lng: 80.4400 },
            { lat: 16.2850, lng: 80.4450 },
            { lat: 16.2800, lng: 80.4350 },
        ],
        priceModifier: 20, // ₹20 extra
        isActive: true,
    },
    {
        name: 'Guntur East',
        city: 'Guntur',
        description: 'Mangalagiri side, industrial areas',
        coordinates: [
            { lat: 16.3050, lng: 80.4500 },
            { lat: 16.3100, lng: 80.4600 },
            { lat: 16.3000, lng: 80.4650 },
            { lat: 16.2950, lng: 80.4550 },
        ],
        priceModifier: 25, // ₹25 extra
        isActive: true,
    },
    {
        name: 'Guntur West',
        city: 'Guntur',
        description: 'Railway station, Bus stand areas',
        coordinates: [
            { lat: 16.3000, lng: 80.4200 },
            { lat: 16.3100, lng: 80.4250 },
            { lat: 16.3050, lng: 80.4150 },
            { lat: 16.2950, lng: 80.4100 },
        ],
        priceModifier: 10, // ₹10 extra
        isActive: true,
    },
    {
        name: 'Guntur Outer',
        city: 'Guntur',
        description: 'Outer ring areas, Brindavan Gardens',
        coordinates: [
            { lat: 16.3300, lng: 80.4600 },
            { lat: 16.3400, lng: 80.4700 },
            { lat: 16.3200, lng: 80.4800 },
            { lat: 16.3100, lng: 80.4600 },
        ],
        priceModifier: 30, // ₹30 extra
        isActive: true,
    },
];

const seedZones = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing zones
        await Zone.deleteMany({});
        console.log('Cleared existing zones');

        // Insert Guntur zones
        const zones = await Zone.insertMany(gunturZones);
        console.log(`Successfully seeded ${zones.length} zones for Guntur`);

        console.log('\nSeeded Zones:');
        zones.forEach(zone => {
            console.log(`   - ${zone.name}: ₹${zone.priceModifier} extra`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding zones:', error);
        process.exit(1);
    }
};

// Run seeder
seedZones();
