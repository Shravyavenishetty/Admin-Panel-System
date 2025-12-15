/**
 * Zone Pricing Service
 * API calls for zone pricing management
 */

import axios from '../config/axios';

const API_URL = '/admin/zones';

/**
 * Get all zone pricing rules
 */
export const getAllZones = async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

/**
 * Get single zone pricing rule
 */
export const getZone = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Create zone pricing rule
 */
export const createZone = async (zoneData) => {
    const response = await axios.post(API_URL, zoneData);
    return response.data;
};

/**
 * Update zone pricing rule
 */
export const updateZone = async (id, zoneData) => {
    const response = await axios.put(`${API_URL}/${id}`, zoneData);
    return response.data;
};

/**
 * Delete zone pricing rule
 */
export const deleteZone = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Toggle zone status
 */
export const toggleZoneStatus = async (id) => {
    const response = await axios.patch(`${API_URL}/${id}/toggle`);
    return response.data;
};
