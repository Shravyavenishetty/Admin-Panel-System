/**
 * Order Service
 * API calls for order management
 */

import axios from '../config/axios';

const API_URL = '/admin/orders';

/**
 * Get all orders with optional filters
 */
export const getAllOrders = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.outlet) params.append('outlet', filters.outlet);

    const response = await axios.get(`${API_URL}/admin/all?${params.toString()}`);
    return response.data;
};

/**
 * Update order status
 */
export const updateOrderStatus = async (id, status) => {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
};
