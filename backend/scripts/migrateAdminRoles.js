/**
 * Migration Script: Add Role to Existing Admins
 * 
 * Run this once to update existing admin users with the 'admin' role
 * Usage: node scripts/migrateAdminRoles.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

const migrateAdminRoles = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Update all admin users without a role to have role='admin'
        const result = await Admin.updateMany(
            { role: { $exists: false } }, // Find admins without role field
            { $set: { role: 'admin' } }   // Set role to 'admin'
        );

        console.log(`✅ Updated ${result.modifiedCount} admin users with role='admin'`);

        // Also update any admins with null or empty role
        const result2 = await Admin.updateMany(
            { $or: [{ role: null }, { role: '' }] },
            { $set: { role: 'admin' } }
        );

        console.log(`✅ Updated ${result2.modifiedCount} admins with null/empty role`);

        // Show all admins with their roles
        const admins = await Admin.find({}, 'email name role');
        console.log('\n📋 Current admin users:');
        admins.forEach(admin => {
            console.log(`   - ${admin.email} (${admin.name || 'N/A'}) - Role: ${admin.role}`);
        });

        mongoose.connection.close();
        console.log('\n✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

// Run migration
migrateAdminRoles();
