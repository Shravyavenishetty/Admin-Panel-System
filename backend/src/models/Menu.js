/**
 * Menu Model
 * Represents café menu items from TEAS N TREES
 */

const mongoose = require('mongoose');

const menuCategories = [
    'Hot Coffee',
    'Cold Coffee',
    'Clear Teas',
    'Cold Clear Teas',
    'Shakes',
    'Mojitos',
    'Lassi',
    'Real Fruit Mojitos',
    'Almond Gum Special',
    'Cold Pressed Juices',
    'Fruit Bowls',
    'Desserts',
    'Salads & Soups',
    'Garlic Breads & Toasts',
    'Deep Fries',
    'Potato Snacks',
    'Crispy Bites',
    'Tacos & Nachos',
    'Tandoori',
    'Momos',
    'Wraps',
    'Maggi',
    'Sandwiches',
    'Burgers',
    'Pasta',
    'Pizza',
    'Millet Kitchidi',
    'Rice Bowls',
    'Sizzlers',
    'Omelettes'
];

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: menuCategories,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    foodType: {
        type: String,
        enum: ['veg', 'non-veg', 'vegan'],
        default: 'veg',
    },
    image: {
        type: String, // Cloudinary URL
        default: null,
    },
    imagePublicId: {
        type: String, // Cloudinary public ID for deletion
        default: null,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    popularity: {
        type: Number,
        default: 0,
        min: 0,
    },
    isSpecial: {
        type: Boolean,
        default: false, // For items marked with ⭐ or 🔥
    },
    specialType: {
        type: String,
        enum: ['signature', 'hot-seller', 'new', null],
        default: null,
    },
}, {
    timestamps: true,
});

// Indexes for faster queries
menuSchema.index({ name: 'text', description: 'text' });
menuSchema.index({ category: 1 });
menuSchema.index({ availability: 1 });
menuSchema.index({ price: 1 });
menuSchema.index({ popularity: -1 });

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
module.exports.menuCategories = menuCategories;
