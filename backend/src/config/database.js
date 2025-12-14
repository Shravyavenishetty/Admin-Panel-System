/**
 * Database Configuration
 * Handles MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Mongoose 6+ no longer requires these options, but they're here for compatibility
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        // Exit process with failure if database connection fails
        process.exit(1);
    }
};

module.exports = connectDB;
