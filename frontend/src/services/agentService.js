/**
 * Delivery Agent Service
 * API calls for delivery agent management
 */

import axios from '../config/axios';

const API_URL = '/admin/agents';

/**
 * Get all delivery agents
 */
export const getAllAgents = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Create new delivery agent
 */
export const createAgent = async (agentData) => {
    const response = await axios.post(API_URL, agentData);
    return response.data;
};

/**
 * Delete a delivery agent
 */
export const deleteAgent = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Update delivery agent status
 */
export const updateAgentStatus = async (id, status) => {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
};
