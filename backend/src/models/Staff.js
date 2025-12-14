/**
 * Staff Model
 * Represents staff/employees working at outlets
 */

const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Staff name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['manager', 'cashier', 'cook', 'server'],
        default: 'server',
    },
}, {
    timestamps: true,
});

// Index for faster queries
staffSchema.index({ email: 1 });

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
