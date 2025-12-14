/**
 * Outlet Model
 * Represents restaurant/store outlets
 */

const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Outlet name is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Index for faster queries
outletSchema.index({ name: 1 });

const Outlet = mongoose.model('Outlet', outletSchema);

module.exports = Outlet;
