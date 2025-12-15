/**
 * Express Server Configuration
 * Main entry point for the backend application
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/database');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const staffRoutes = require('./routes/staffRoutes');
const agentRoutes = require('./routes/deliveryAgentRoutes');
const outletRoutes = require('./routes/outletRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { publicRouter: menuPublicRoutes, adminRouter: menuAdminRoutes } = require('./routes/menuRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

/**
 * Middleware Configuration
 */

// CORS - Allow cross-origin requests from frontend
app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true, // Allow cookies
}));

// Body parser - Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware - In-memory session storage
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'fallback_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            httpOnly: true, // Prevent client-side JS access
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        },
    })
);

/**
 * Routes
 */

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// Admin routes
app.use('/api/admin', adminRoutes);

// CRUD routes (Task 2)
app.use('/admin/staff', staffRoutes);
app.use('/admin/agents', agentRoutes);
app.use('/admin/outlets', outletRoutes);
app.use('/admin/orders', orderRoutes);
app.use('/admin/dashboard', dashboardRoutes);

// Menu routes (Task 3)
app.use('/api/menu', menuPublicRoutes); // Public menu access
app.use('/admin/menu', menuAdminRoutes); // Admin menu management


// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

/**
 * Start Server
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
