/**
 * Customer Seeder
 * Seeds demo customer accounts
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const connectDB = require('../config/database');

const demoCustomers = [
    {
        name: 'Demo Customer',
        email: 'customer@test.com',
        phone: '9876543210',
        password: 'customer123',
        addresses: [
            {
                label: 'Home',
                address: '123 Main Street, Guntur',
                lat: 16.3067,
                lng: 80.4365,
                isDefault: true,
            },
        ],
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543211',
        password: 'john123',
        addresses: [
            {
                label: 'Home',
                address: '456 Park Avenue, Guntur',
                lat: 16.3100,
                lng: 80.4400,
                isDefault: true,
            },
        ],
    },
];

async function seedCustomers() {
    try {
        await connectDB();

        // Clear existing customers
        await Customer.deleteMany({});
        console.log('Cleared existing customers');

        // Insert demo customers
        const customers = await Customer.insertMany(demoCustomers);
        console.log(`Successfully seeded ${customers.length} demo customers`);

        console.log('\nSeeded Customers:');
        customers.forEach(customer => {
            console.log(`   - ${customer.name} (${customer.email})`);
        });

        console.log('\nLogin Credentials:');
        demoCustomers.forEach(c => {
            console.log(`   ${c.email} / ${c.password}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding customers:', error);
        process.exit(1);
    }
}

// Run seeder
if (require.main === module) {
    seedCustomers();
}

module.exports = seedCustomers;
