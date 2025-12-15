/**
 * Menu Controller
 * Handles menu CRUD operations with filtering and pagination
 */

const Menu = require('../models/Menu');
const { deleteImage } = require('../config/cloudinary');
const {
    buildSearchQuery,
    buildFilterQuery,
    buildSortQuery,
    buildPagination,
    buildPaginationMeta,
} = require('../utils/queryBuilder');

/**
 * Get all menu items with filters
 * GET /api/menu?category=&available=&search=&foodType=&page=1&limit=10&sort=price
 */
exports.getMenuItems = async (req, res) => {
    try {
        const {
            category,
            available,
            search,
            foodType,
            page = 1,
            limit = 10,
            sort = '-createdAt',
        } = req.query;

        // Build query
        let query = {};

        // Add filters
        if (category) query.category = category;
        if (available !== undefined) query.availability = available === 'true';
        if (foodType) query.foodType = foodType;

        // Add search
        if (search) {
            const searchQuery = buildSearchQuery(search, ['name', 'description', 'tags']);
            query = { ...query, ...searchQuery };
        }

        // Pagination
        const { skip, limit: limitNum, page: pageNum } = buildPagination(page, limit);

        // Sort
        const sortQuery = buildSortQuery(sort);

        // Execute query
        const items = await Menu.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(limitNum);

        // Get total count
        const total = await Menu.countDocuments(query);

        // Build pagination metadata
        const pagination = buildPaginationMeta(total, pageNum, limitNum);

        res.status(200).json({
            success: true,
            data: items,
            pagination,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching menu items',
            error: error.message,
        });
    }
};

/**
 * Get single menu item
 * GET /api/menu/:id
 */
exports.getMenuItem = async (req, res) => {
    try {
        const item = await Menu.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found',
            });
        }

        res.status(200).json({
            success: true,
            data: item,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching menu item',
            error: error.message,
        });
    }
};

/**
 * Create menu item (Admin only)
 * POST /admin/menu
 */
exports.createMenuItem = async (req, res) => {
    try {
        const menuData = { ...req.body };

        // Handle image upload from multer
        if (req.file) {
            menuData.image = req.file.path;
            menuData.imagePublicId = req.file.filename;
        }

        const item = await Menu.create(menuData);

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: item,
        });
    } catch (error) {
        // If error occurs and image was uploaded, delete it
        if (req.file && req.file.filename) {
            await deleteImage(req.file.filename);
        }

        res.status(400).json({
            success: false,
            message: 'Error creating menu item',
            error: error.message,
        });
    }
};

/**
 * Update menu item (Admin only)
 * PUT /admin/menu/:id
 */
exports.updateMenuItem = async (req, res) => {
    try {
        const item = await Menu.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found',
            });
        }

        const updateData = { ...req.body };

        // Handle new image upload
        if (req.file) {
            // Delete old image if exists
            if (item.imagePublicId) {
                await deleteImage(item.imagePublicId);
            }

            updateData.image = req.file.path;
            updateData.imagePublicId = req.file.filename;
        }

        const updatedItem = await Menu.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Menu item updated successfully',
            data: updatedItem,
        });
    } catch (error) {
        // If error occurs and new image was uploaded, delete it
        if (req.file && req.file.filename) {
            await deleteImage(req.file.filename);
        }

        res.status(500).json({
            success: false,
            message: 'Error updating menu item',
            error: error.message,
        });
    }
};

/**
 * Delete menu item (Admin only)
 * DELETE /admin/menu/:id
 */
exports.deleteMenuItem = async (req, res) => {
    try {
        const item = await Menu.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found',
            });
        }

        // Delete image from Cloudinary if exists
        if (item.imagePublicId) {
            await deleteImage(item.imagePublicId);
        }

        await Menu.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting menu item',
            error: error.message,
        });
    }
};

/**
 * Toggle menu item availability (Admin only)
 * PATCH /admin/menu/:id/availability
 */
exports.toggleAvailability = async (req, res) => {
    try {
        const item = await Menu.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found',
            });
        }

        item.availability = !item.availability;
        await item.save();

        res.status(200).json({
            success: true,
            message: `Menu item ${item.availability ? 'enabled' : 'disabled'}`,
            data: item,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling availability',
            error: error.message,
        });
    }
};

/**
 * Get menu categories
 * GET /api/menu/categories
 */
exports.getCategories = async (req, res) => {
    try {
        const { menuCategories } = require('../models/Menu');

        res.status(200).json({
            success: true,
            data: menuCategories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message,
        });
    }
};
