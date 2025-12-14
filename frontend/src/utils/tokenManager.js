/**
 * Token Manager Utility
 * Handles JWT token storage and retrieval in localStorage
 */

const TOKEN_KEY = 'admin_token';

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token to store
 */
export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve JWT token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from localStorage (used during logout)
 */
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user has a valid token (basic check - just presence)
 * @returns {boolean} - true if token exists, false otherwise
 */
export const hasToken = () => {
    return !!getToken();
};
