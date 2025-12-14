/**
 * Outlet Service
 * API calls for outlet management
 */

import axios from '../config/axios';

const API_URL = '/admin/outlets';

/**
 * Get all outlets
 */
export const getAllOutlets = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Create new outlet
 */
export const createOutlet = async (outletData) => {
    const response = await axios.post(API_URL, outletData);
    return response.data;
};

/**
 * Delete outlet
 */
export const deleteOutlet = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
