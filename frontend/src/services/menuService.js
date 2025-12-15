/**
 * Menu Service
 * API calls for menu management
 */

import axios from '../config/axios';

const API_URL = '/api/menu';
const ADMIN_API_URL = '/admin/menu';

/**
 * Get all menu items with filters
 */
export const getMenuItems = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.available !== undefined && filters.available !== '') params.append('available', filters.available);
    if (filters.search) params.append('search', filters.search);
    if (filters.foodType) params.append('foodType', filters.foodType);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.sort) params.append('sort', filters.sort);

    console.log('Menu API URL:', `${API_URL}?${params.toString()}`);
    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
};

/**
 * Get single menu item
 */
export const getMenuItem = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Get menu categories
 */
export const getMenuCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
};

/**
 * Create menu item (Admin only)
 */
export const createMenuItem = async (formData) => {
    const response = await axios.post(ADMIN_API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Update menu item (Admin only)
 */
export const updateMenuItem = async (id, formData) => {
    const response = await axios.put(`${ADMIN_API_URL}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Delete menu item (Admin only)
 */
export const deleteMenuItem = async (id) => {
    const response = await axios.delete(`${ADMIN_API_URL}/${id}`);
    return response.data;
};

/**
 * Toggle menu item availability (Admin only)
 */
export const toggleMenuAvailability = async (id) => {
    const response = await axios.patch(`${ADMIN_API_URL}/${id}/availability`);
    return response.data;
};
