/**
 * Dashboard Service
 * API calls for dashboard features
 */

import axios from '../config/axios';

const API_URL = '/admin/dashboard';

/**
 * Get recent activity
 */
export const getRecentActivity = async () => {
    const response = await axios.get(`${API_URL}/recent-activity`);
    return response.data;
};
