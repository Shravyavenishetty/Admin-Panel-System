/**
 * Axios Configuration
 * Sets up axios instance with interceptors for authentication
 */

import axios from 'axios';
import { getToken } from '../utils/tokenManager';

/**
 * Add request interceptor to include JWT token in Authorization header
 * This ensures all API requests include the authentication token
 */
axios.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = getToken();

        // If token exists, add to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Add response interceptor to handle common errors
 * Particularly useful for handling 401 Unauthorized responses
 */
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If 401 Unauthorized, could redirect to login
        // But we'll let individual components handle this
        return Promise.reject(error);
    }
);

export default axios;
