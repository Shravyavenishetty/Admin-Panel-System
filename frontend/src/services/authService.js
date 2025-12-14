/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import axios from 'axios';
import { setToken, removeToken } from '../utils/tokenManager';

// Base API URL - will use Vite proxy in development
const API_URL = '/api/admin';

/**
 * Login admin user
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object>} - Response data with token and user info
 */
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
        });

        // Store token in localStorage
        if (response.data.token) {
            setToken(response.data.token);
        }

        return response.data;
    } catch (error) {
        // Handle error and throw meaningful message
        const message = error.response?.data?.message || 'Login failed. Please try again.';
        throw new Error(message);
    }
};

/**
 * Logout admin user
 * Calls logout endpoint and removes token from localStorage
 * @returns {Promise<void>}
 */
export const logout = async () => {
    try {
        // Call logout endpoint (optional - for session cleanup)
        await axios.post(`${API_URL}/logout`);
    } catch (error) {
        // Even if logout endpoint fails, we still remove the token
        console.error('Logout error:', error);
    } finally {
        // Always remove token from localStorage
        removeToken();
    }
};

/**
 * Verify if current token is valid
 * @returns {Promise<boolean>} - true if token is valid, false otherwise
 */
export const verifyToken = async () => {
    try {
        const response = await axios.get(`${API_URL}/verify`);
        return response.data.valid;
    } catch (error) {
        return false;
    }
};
