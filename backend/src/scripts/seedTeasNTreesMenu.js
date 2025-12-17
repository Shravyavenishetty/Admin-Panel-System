/**
 * TEAS N TREES Menu Seeder
 * Seeds complete menu with beverages, desserts, and food items
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Menu = require('../models/Menu');
const connectDB = require('../config/database');

const menuItems = [
    // HOT COFFEE
    { name: 'Classic Filter Coffee', price: 99, category: 'Hot Coffee', foodType: 'veg', availability: true, description: 'Traditional South Indian filter coffee' },
    { name: 'Espresso', price: 89, category: 'Hot Coffee', foodType: 'veg', availability: true },
    { name: 'Café Americano', price: 99, category: 'Hot Coffee', foodType: 'veg', availability: true },
    { name: 'Affogato', price: 99, category: 'Hot Coffee', foodType: 'veg', availability: true },
    { name: 'Caffe Latte', price: 99, category: 'Hot Coffee', foodType: 'veg', availability: true },
    { name: 'Cappuccino', price: 109, category: 'Hot Coffee', foodType: 'veg', availability: true },
    { name: 'Hot Chocolate', price: 109, category: 'Hot Coffee', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Hot Nutella', price: 109, category: 'Hot Coffee', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Café Mocha', price: 109, category: 'Hot Coffee', foodType: 'veg', availability: true },
    { name: 'Nutella Café Mocha', price: 109, category: 'Hot Coffee', foodType: 'veg', availability: true },

    // COLD COFFEE
    { name: 'TNT Frappe', price: 199, category: 'Cold Coffee', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Caramel Frappe', price: 249, category: 'Cold Coffee', foodType: 'veg', availability: true },
    { name: 'Choco Frappe', price: 249, category: 'Cold Coffee', foodType: 'veg', availability: true },
    { name: 'Cookie Frappe', price: 249, category: 'Cold Coffee', foodType: 'veg', availability: true },
    { name: 'Brownie Frappe', price: 289, category: 'Cold Coffee', foodType: 'veg', availability: true, tags: ['trending'] },

    // CLEAR TEAS
    { name: 'Hibiscus Tea', price: 99, category: 'Clear Teas', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Honey Lemon Tea', price: 89, category: 'Clear Teas', foodType: 'veg', availability: true },
    { name: 'Detox Tea', price: 99, category: 'Clear Teas', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Tulasi Sleep Tea', price: 99, category: 'Clear Teas', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Mint Chamomile Tea', price: 99, category: 'Clear Teas', foodType: 'veg', availability: true },
    { name: 'Cinnamon Orange', price: 109, category: 'Clear Teas', foodType: 'veg', availability: true },
    { name: 'Cinnamon Ashwagandha', price: 109, category: 'Clear Teas', foodType: 'veg', availability: true },
    { name: 'Roots Tea', price: 109, category: 'Clear Teas', foodType: 'veg', availability: true },
    { name: 'Slimming Tea', price: 109, category: 'Clear Teas', foodType: 'veg', availability: true },
    { name: 'Krishna Tulsi Tea', price: 109, category: 'Clear Teas', foodType: 'veg', availability: true },
    { name: 'Flora Tea', price: 599, category: 'Clear Teas', foodType: 'veg', availability: true },

    // COLD CLEAR TEAS
    { name: 'Hibiscus Iced Tea', price: 129, category: 'Cold Clear Teas', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Lemon Iced Tea', price: 129, category: 'Cold Clear Teas', foodType: 'veg', availability: true },
    { name: 'Peach Iced Tea', price: 129, category: 'Cold Clear Teas', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Lemon Grass Iced Tea', price: 179, category: 'Cold Clear Teas', foodType: 'veg', availability: true },

    // SHAKES
    { name: 'Butterscotch Shake', price: 249, category: 'Shakes', foodType: 'veg', availability: true },
    { name: 'Kitkat Shake', price: 269, category: 'Shakes', foodType: 'veg', availability: true },
    { name: 'Oreo Shake', price: 269, category: 'Shakes', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Chocolate Shake', price: 279, category: 'Shakes', foodType: 'veg', availability: true },
    { name: 'Tropical Trio Shake', price: 289, category: 'Shakes', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'American Bourbon Shake', price: 289, category: 'Shakes', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Salted Caramel Shake', price: 289, category: 'Shakes', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Saffron Pistachio Shake', price: 289, category: 'Shakes', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Belgium Chocolate Shake', price: 309, category: 'Shakes', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Ferrero Rocher Shake', price: 309, category: 'Shakes', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Very Berry Shake', price: 349, category: 'Shakes', foodType: 'veg', availability: true },
    { name: 'Nutella Brownie Shake', price: 369, category: 'Shakes', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Avocado Treat Shake', price: 369, category: 'Shakes', foodType: 'veg', availability: true },

    // MOJITOS
    { name: 'Lemonade', price: 89, category: 'Mojitos', foodType: 'veg', availability: true },
    { name: 'Guntur Spicy Mojito', price: 109, category: 'Mojitos', foodType: 'veg', availability: true, tags: ['trending'], description: 'Spicy twist on classic mojito' },
    { name: 'Mint Mojito', price: 159, category: 'Mojitos', foodType: 'veg', availability: true },
    { name: 'Blue Lagoon Mojito', price: 169, category: 'Mojitos', foodType: 'veg', availability: true },
    { name: 'Green Apple Mojito', price: 169, category: 'Mojitos', foodType: 'veg', availability: true },
    { name: 'Kiwi Mojito', price: 169, category: 'Mojitos', foodType: 'veg', availability: true },
    { name: 'Cranberry Mojito', price: 169, category: 'Mojitos', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Raspberry Mojito', price: 169, category: 'Mojitos', foodType: 'veg', availability: true },
    { name: 'Berry Apricot Mojito', price: 179, category: 'Mojitos', foodType: 'veg', availability: true },
    { name: 'Lemon Grass Mojito', price: 179, category: 'Mojitos', foodType: 'veg', availability: true },
    { name: 'Apple Mint Mojito', price: 179, category: 'Mojitos', foodType: 'veg', availability: true },
    { name: 'Yuzu Basil Lemonade', price: 179, category: 'Mojitos', foodType: 'veg', availability: true },

    // LASSI
    { name: 'Sweet & Salt Lassi', price: 99, category: 'Lassi', foodType: 'veg', availability: true },
    { name: 'Dry Fruit Lassi', price: 149, category: 'Lassi', foodType: 'veg', availability: true },
    { name: 'Kiwi Lassi', price: 129, category: 'Lassi', foodType: 'veg', availability: true },
    { name: 'Caramel Lassi', price: 149, category: 'Lassi', foodType: 'veg', availability: true },

    // REAL FRUIT MOJITOS
    { name: 'Pomegranate Real Fruit Mojito', price: 199, category: 'Real Fruit Mojitos', foodType: 'veg', availability: true },
    { name: 'Green Grapes Real Fruit Mojito', price: 199, category: 'Real Fruit Mojitos', foodType: 'veg', availability: true },
    { name: 'Musk Melon Real Fruit Mojito', price: 199, category: 'Real Fruit Mojitos', foodType: 'veg', availability: true },
    { name: 'Kiwi Real Fruit Mojito', price: 199, category: 'Real Fruit Mojitos', foodType: 'veg', availability: true },
    { name: 'Watermelon Real Fruit Mojito', price: 199, category: 'Real Fruit Mojitos', foodType: 'veg', availability: true },

    // ALMOND GUM SPECIAL
    { name: 'Almond Gum Lemonade', price: 199, category: 'Almond Gum Special', foodType: 'veg', availability: true },
    { name: 'Almond Gum Raspberry Mojito', price: 199, category: 'Almond Gum Special', foodType: 'veg', availability: true },
    { name: 'Almond Gum Cranberry Mojito', price: 199, category: 'Almond Gum Special', foodType: 'veg', availability: true },
    { name: 'Almond Gum Green Apple Mojito', price: 199, category: 'Almond Gum Special', foodType: 'veg', availability: true },
    { name: 'Almond Gum Strawberry Mojito', price: 199, category: 'Almond Gum Special', foodType: 'veg', availability: true },

    // COLD PRESSED JUICES
    { name: 'Watermelon Juice', price: 109, category: 'Cold Pressed Juices', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Watermelon Lemon Mint Juice', price: 139, category: 'Cold Pressed Juices', foodType: 'veg', availability: true },
    { name: 'Grape Juice', price: 189, category: 'Cold Pressed Juices', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Muskmelon Juice', price: 159, category: 'Cold Pressed Juices', foodType: 'veg', availability: true },
    { name: 'Beetroot Carrot Juice', price: 189, category: 'Cold Pressed Juices', foodType: 'veg', availability: true },
    { name: 'Apple Beetroot Carrot Juice', price: 229, category: 'Cold Pressed Juices', foodType: 'veg', availability: true, tags: ['trending'] },

    // FRUIT BOWLS
    { name: 'Watermelon Salad', price: 129, category: 'Fruit Bowls', foodType: 'veg', availability: true },
    { name: 'Mix Fruit Salad', price: 199, category: 'Fruit Bowls', foodType: 'veg', availability: true },
    { name: 'Choco Banana Smoothie Bowl', price: 259, category: 'Fruit Bowls', foodType: 'veg', availability: true },
    { name: 'Berry Smoothie Bowl', price: 299, category: 'Fruit Bowls', foodType: 'veg', availability: true },

    // DESSERTS
    { name: 'Walnut Brownie', price: 119, category: 'Desserts', foodType: 'veg', availability: true },
    { name: 'Brownie + Vanilla Scoop', price: 169, category: 'Desserts', foodType: 'veg', availability: true },
    { name: 'Brownie + Chocolate Scoop', price: 189, category: 'Desserts', foodType: 'veg', availability: true },
    { name: 'Sizzling Brownie with Vanilla', price: 289, category: 'Desserts', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Sizzling Brownie with Chocolate', price: 299, category: 'Desserts', foodType: 'veg', availability: true },
    { name: 'Cheese Kunafa', price: 349, category: 'Desserts', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Chocolate Kunafa', price: 349, category: 'Desserts', foodType: 'veg', availability: true },
    { name: 'Dry Fruit Custard', price: 169, category: 'Desserts', foodType: 'veg', availability: true },
    { name: 'Fresh Fruit Custard', price: 149, category: 'Desserts', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Jigarthanda Plain', price: 199, category: 'Desserts', foodType: 'veg', availability: true },
    { name: 'Jigarthanda Dry Fruit', price: 199, category: 'Desserts', foodType: 'veg', availability: true },
    { name: 'Dry Fruit Loaded Jigarthanda', price: 249, category: 'Desserts', foodType: 'veg', availability: true },

    // ICE CREAM SCOOPS
    { name: 'Vanilla Scoop', price: 69, category: 'Ice Cream Scoops', foodType: 'veg', availability: true, tags: ['popular'] },
    { name: 'Butterscotch Scoop', price: 89, category: 'Ice Cream Scoops', foodType: 'veg', availability: true },
    { name: 'Chocolate Scoop', price: 89, category: 'Ice Cream Scoops', foodType: 'veg', availability: true, tags: ['trending'] },
    { name: 'Strawberry Scoop', price: 89, category: 'Ice Cream Scoops', foodType: 'veg', availability: true },
    { name: 'Dark Chocolate Scoop', price: 99, category: 'Ice Cream Scoops', foodType: 'veg', availability: true },
];

async function seedMenu() {
    try {
        await connectDB();
        console.log('Connected to database');

        // Delete all existing menu items
        const deleteResult = await Menu.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing menu items`);

        // Insert new menu items
        const inserted = await Menu.insertMany(menuItems);
        console.log(`Inserted ${inserted.length} new menu items`);

        console.log('\nMenu Items by Category:');
        const categories = [...new Set(menuItems.map(item => item.category))];
        categories.forEach(category => {
            const count = menuItems.filter(item => item.category === category).length;
            console.log(`   ${category}: ${count} items`);
        });

        console.log('\nMenu seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding menu:', error);
        process.exit(1);
    }
}

seedMenu();
