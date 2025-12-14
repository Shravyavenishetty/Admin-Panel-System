/**
 * Admin Seeding Script
 * Creates an initial admin user in the database for testing
 * Run with: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

/**
 * Seed admin user
 */
const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@admin.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            return;
        }

        // Create new admin user
        const admin = await Admin.create({
            name: 'Admin User',
            email: 'admin@admin.com',
            password: 'admin123', // Will be hashed automatically by the model
            role: 'admin',
        });

        console.log('✅ Admin user created successfully:');
        console.log('   Email:', admin.email);
        console.log('   Password: admin123');
        console.log('   Name:', admin.name);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
    }
};

/**
 * Run the seeding process
 */
const runSeed = async () => {
    await connectDB();
    await seedAdmin();

    // Close database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
};

// Execute seeding
runSeed();
