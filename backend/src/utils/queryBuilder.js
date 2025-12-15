/**
 * Query Builder Utility
 * Helps build MongoDB queries from request parameters
 */

/**
 * Build search query for text search
 * @param {string} searchTerm - Search term
 * @param {array} fields - Fields to search in
 * @returns {object} MongoDB query object
 */
function buildSearchQuery(searchTerm, fields = []) {
    if (!searchTerm) return {};

    if (fields.length === 0) {
        // Use text index if available
        return { $text: { $search: searchTerm } };
    }

    // Search across multiple fields with regex
    const searchRegex = new RegExp(searchTerm, 'i');
    return {
        $or: fields.map(field => ({ [field]: searchRegex }))
    };
}

/**
 * Build filter query from filter object
 * @param {object} filters - Filter parameters
 * @returns {object} MongoDB query object
 */
function buildFilterQuery(filters) {
    const query = {};

    Object.keys(filters).forEach(key => {
        const value = filters[key];

        if (value === undefined || value === null || value === '') {
            return;
        }

        // Handle boolean strings
        if (value === 'true') {
            query[key] = true;
        } else if (value === 'false') {
            query[key] = false;
        } else {
            query[key] = value;
        }
    });

    return query;
}

/**
 * Build sort query
 * @param {string} sortBy - Sort field (prefix with - for descending)
 * @returns {object} MongoDB sort object
 */
function buildSortQuery(sortBy) {
    if (!sortBy) return { createdAt: -1 }; // Default sort

    if (sortBy.startsWith('-')) {
        const field = sortBy.substring(1);
        return { [field]: -1 };
    }

    return { [sortBy]: 1 };
}

/**
 * Build pagination parameters
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {object} Skip and limit values
 */
function buildPagination(page = 1, limit = 10) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    const skip = (pageNum - 1) * limitNum;

    return {
        skip,
        limit: limitNum,
        page: pageNum,
    };
}

/**
 * Build pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
function buildPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);

    return {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}

/**
 * Build date range query
 * @param {string} dateFrom - Start date
 * @param {string} dateTo - End date
 * @param {string} field - Date field name
 * @returns {object} MongoDB query object
 */
function buildDateRangeQuery(dateFrom, dateTo, field = 'createdAt') {
    const query = {};

    if (dateFrom || dateTo) {
        query[field] = {};

        if (dateFrom) {
            query[field].$gte = new Date(dateFrom);
        }

        if (dateTo) {
            query[field].$lte = new Date(dateTo);
        }
    }

    return query;
}

module.exports = {
    buildSearchQuery,
    buildFilterQuery,
    buildSortQuery,
    buildPagination,
    buildPaginationMeta,
    buildDateRangeQuery,
};
