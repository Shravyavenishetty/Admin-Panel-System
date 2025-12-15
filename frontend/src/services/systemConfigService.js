/**
 * System Config Service
 * API calls for system configuration
 */

import axios from '../config/axios';

const API_URL = '/admin/config';

/**
 * Get system configuration
 */
export const getSystemConfig = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Update system configuration
 */
export const updateSystemConfig = async (configData) => {
    const response = await axios.put(API_URL, configData);
    return response.data;
};
