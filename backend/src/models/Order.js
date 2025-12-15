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
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
    }],
    // Delivery location
    deliveryAddress: {
        type: String,
        required: [true, 'Delivery address is required'],
    },
    deliveryLocation: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    // Pricing breakdown
    subtotal: {
        type: Number,
        required: true,
        default: 0,
    },
    distanceKm: {
        type: Number,
        default: 0,
    },
    distanceFee: {
        type: Number,
        default: 0,
    },
    zoneModifier: {
        type: Number,
        default: 0,
    },
    zoneName: {
        type: String,
        default: null,
    },
    zoneId: {
        type: String,
        default: null,
    },
    gstAmount: {
        type: Number,
        default: 0,
    },
    gstRate: {
        type: Number,
        default: 0.05,
    },
    finalPrice: {
        type: Number,
        required: true,
    },
    // Legacy field for backward compatibility
    totalAmount: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
        default: 'pending',
    },
    // Delivery agent assignment
    deliveryAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryAgent',
        default: null,
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
