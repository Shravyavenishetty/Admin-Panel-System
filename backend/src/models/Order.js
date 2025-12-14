/**
 * Order Model
 * Represents customer orders from outlets
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true,
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
    },
    customerPhone: {
        type: String,
        required: [true, 'Customer phone is required'],
        trim: true,
    },
    outlet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outlet',
        required: [true, 'Outlet is required'],
    },
    items: [{
        name: String,
        quantity: Number,
        price: Number,
    }],
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending',
    },
    // Notification placeholder
    notificationSent: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Auto-generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Indexes for faster queries
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ outlet: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
