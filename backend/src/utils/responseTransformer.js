/**
 * Response Transformer
 * Filters response data based on user role
 */

/**
 * Define field visibility by role for each model
 */
const fieldVisibility = {
    menu: {
        public: ['_id', 'name', 'description', 'price', 'category', 'image', 'availability', 'foodType', 'tags'],
        customer: ['_id', 'name', 'description', 'price', 'category', 'image', 'availability', 'foodType', 'tags'],
        user: ['_id', 'name', 'description', 'price', 'category', 'image', 'availability', 'foodType', 'tags'],
        manager: ['_id', 'name', 'description', 'price', 'category', 'image', 'availability', 'foodType', 'tags', 'popularity', 'createdAt', 'updatedAt'],
        admin: 'all', // All fields
    },
    order: {
        public: [],
        customer: ['_id', 'orderNumber', 'customerName', 'customerPhone', 'items', 'deliveryAddress', 'status', 'finalPrice', 'subtotal', 'distanceFee', 'zoneModifier', 'gstAmount', 'createdAt'],
        user: ['_id', 'orderNumber', 'customerName', 'customerPhone', 'items', 'deliveryAddress', 'status', 'finalPrice', 'createdAt'],
        manager: ['_id', 'orderNumber', 'customerName', 'customerPhone', 'items', 'deliveryAddress', 'outlet', 'deliveryAgent', 'status', 'subtotal', 'distanceFee', 'gstAmount', 'finalPrice', 'createdAt', 'updatedAt'],
        admin: 'all',
    },
    staff: {
        public: [],
        user: [],
        manager: ['_id', 'name', 'position', 'email', 'phone', 'outlet', 'createdAt'],
        admin: 'all',
    },
    deliveryAgent: {
        public: [],
        user: [],
        manager: ['_id', 'name', 'phone', 'vehicleType', 'vehicleNumber', 'currentStatus', 'outlet', 'createdAt'],
        admin: 'all',
    },
    outlet: {
        public: ['_id', 'name', 'address', 'city', 'location'],
        user: ['_id', 'name', 'address', 'city', 'location'],
        manager: ['_id', 'name', 'address', 'city', 'phone', 'location', 'createdAt', 'updatedAt'],
        admin: 'all',
    },
};

/**
 * Transform response data based on user role
 * @param {Object|Array} data - Data to transform
 * @param {String} modelName - Model name (menu, order, staff, etc.)
 * @param {String} userRole - User role (admin, manager, user, public)
 * @returns {Object|Array} Transformed data
 */
const transformResponse = (data, modelName, userRole = 'public') => {
    if (!data) return data;

    const visibility = fieldVisibility[modelName];
    if (!visibility) return data; // No transformation rules defined

    const allowedFields = visibility[userRole] || visibility.public;

    // If role has access to all fields, return as-is
    if (allowedFields === 'all') return data;

    // Transform single object
    if (!Array.isArray(data)) {
        return filterFields(data, allowedFields);
    }

    // Transform array of objects
    return data.map(item => filterFields(item, allowedFields));
};

/**
 * Filter object to only include allowed fields
 * @param {Object} obj - Object to filter
 * @param {Array} allowedFields - Array of allowed field names
 * @returns {Object} Filtered object
 */
const filterFields = (obj, allowedFields) => {
    if (!obj || typeof obj !== 'object') return obj;

    // Convert Mongoose document to plain object
    const plainObj = obj.toObject ? obj.toObject() : obj;

    const filtered = {};
    allowedFields.forEach(field => {
        if (plainObj.hasOwnProperty(field)) {
            filtered[field] = plainObj[field];
        }
    });

    return filtered;
};

/**
 * Middleware to automatically transform response
 * @param {String} modelName - Model name
 */
const autoTransform = (modelName) => {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);

        res.json = function (data) {
            try {
                const userRole = req.user?.role || 'public';

                // Only transform if we have transformation rules for this model
                if (!fieldVisibility[modelName]) {
                    return originalJson(data);
                }

                // Transform data if it exists in response
                if (data && data.data) {
                    data.data = transformResponse(data.data, modelName, userRole);
                } else if (data && Array.isArray(data)) {
                    // Handle direct array responses (like categories)
                    data = transformResponse(data, modelName, userRole);
                } else if (data && typeof data === 'object' && !data.success && !data.message && !data.error) {
                    // Single object response (not wrapped)
                    data = transformResponse(data, modelName, userRole);
                }

                return originalJson(data);
            } catch (error) {
                console.error('Transform error:', error);
                // If transformation fails, return original data
                return originalJson(data);
            }
        };

        next();
    };
};

module.exports = {
    transformResponse,
    autoTransform,
    fieldVisibility,
};
