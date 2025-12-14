/**
 * Staff Service
 * API calls for staff management
 */

import axios from '../config/axios';

const API_URL = '/admin/staff';

/**
 * Get all staff
 */
export const getAllStaff = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Create new staff
 */
export const createStaff = async (staffData) => {
    const response = await axios.post(API_URL, staffData);
    return response.data;
};

/**
 * Delete staff
 */
export const deleteStaff = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Update a staff member
 */
export const updateStaff = async (id, staffData) => {
    const response = await axios.put(`${API_URL}/${id}`, staffData);
    return response.data;
};
