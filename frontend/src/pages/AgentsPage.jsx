/**
 * Delivery Agents Management Page - WITH EDIT FUNCTIONALITY
 * Complete CRUD interface for delivery agent management
 */

import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { getAllAgents, createAgent, deleteAgent, updateAgentStatus, updateAgent } from '../services/agentService';

const AgentsPage = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        vehicleType: 'bike',
    });
    const [error, setError] = useState('');

    // Get socket from context
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        fetchAgents();
    }, []);

    // WebSocket listeners
    useEffect(() => {
        if (!socket) return;

        console.log(' AgentsPage: Setting up WebSocket listeners');

        socket.on('agentCreated', (agent) => {
            console.log(' New agent:', agent.name);
            fetchAgents();
        });

        socket.on('agentUpdated', (agent) => {
            console.log(' Agent updated:', agent.name);
            fetchAgents();
        });

        socket.on('agentDeleted', (data) => {
            console.log(' Agent deleted:', data.id);
            fetchAgents();
        });

        return () => {
            socket.off('agentCreated');
            socket.off('agentUpdated');
            socket.off('agentDeleted');
            console.log(' AgentsPage: Cleaned up WebSocket listeners');
        };
    }, [socket]);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const response = await getAllAgents();
            setAgents(response.data || []);
        } catch (err) {
            setError('Failed to fetch delivery agents');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            console.log(editingId ? 'Updating' : 'Creating', 'agent with data:', formData);
            if (editingId) {
                const response = await updateAgent(editingId, formData);
                console.log('Agent updated successfully:', response);
            } else {
                const response = await createAgent(formData);
                console.log('Agent created successfully:', response);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', email: '', phone: '', vehicleType: 'bike' });
            fetchAgents();
        } catch (err) {
            console.error('Error with agent:', err);
            console.error('Error response:', err.response);
            const errorMessage = err.response?.data?.message || err.message || `Failed to ${editingId ? 'update' : 'create'} delivery agent`;
            setError(errorMessage);
        }
    };

    const handleEdit = (agent) => {
        setEditingId(agent._id);
        setFormData({
            name: agent.name,
            email: agent.email,
            phone: agent.phone,
            vehicleType: agent.vehicleType,
        });
        setShowForm(true);
        setError('');
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', email: '', phone: '', vehicleType: 'bike' });
        setError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this delivery agent?')) return;

        try {
            console.log('Deleting agent:', id);
            await deleteAgent(id);
            console.log('Agent deleted successfully');
            fetchAgents();
        } catch (err) {
            console.error('Error deleting agent:', err);
            console.error('Error response:', err.response);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to delete delivery agent';
            setError(errorMessage);
        }
    };

    const handleStatusChange = async (agentId, newStatus) => {
        try {
            console.log('Updating agent status:', agentId, 'to', newStatus);
            await updateAgentStatus(agentId, newStatus);
            console.log('Status updated successfully');
            fetchAgents(); // Refresh the list
        } catch (err) {
            console.error('Error updating agent status:', err);
            console.error('Error response:', err.response);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update agent status';
            setError(errorMessage);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            available: 'bg-green-500/20 text-green-300',
            busy: 'bg-yellow-500/20 text-yellow-300',
            offline: 'bg-gray-500/20 text-gray-300',
        };
        return colors[status] || colors.offline;
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Delivery Agents</h1>
                    <p className="text-white/70">Manage your delivery agents</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm && editingId) {
                            handleCancelEdit();
                        } else {
                            setShowForm(!showForm);
                            if (!showForm) {
                                setEditingId(null);
                                setFormData({ name: '', email: '', phone: '', vehicleType: 'bike' });
                            }
                        }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                    {showForm ? 'Cancel' : '+ Add Agent'}
                </button>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">{editingId ? 'Edit Delivery Agent' : 'Add New Delivery Agent'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter agent name"
                            />
                        </div>
                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="agent@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Phone *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="+1234567890"
                            />
                        </div>
                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Vehicle Type *</label>
                            <select
                                value={formData.vehicleType}
                                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
                            >
                                <option value="bike">Bike</option>
                                <option value="scooter">Scooter</option>
                                <option value="car">Car</option>
                                <option value="van">Van</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                            >
                                {editingId ? 'Update Agent' : 'Create Agent'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Agents Table - Only show when form is hidden */}
            {!showForm && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-white">Loading...</div>
                    ) : agents.length === 0 ? (
                        <div className="p-8 text-center text-white/70">No delivery agents found. Add one to get started!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Vehicle</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {agents.map((agent) => (
                                        <tr key={agent._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-white">{agent.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white/80">{agent.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white/80">{agent.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm capitalize">
                                                    {agent.vehicleType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={agent.status}
                                                    onChange={(e) => handleStatusChange(agent._id, e.target.value)}
                                                    className={`px - 3 py - 1 rounded - full text - sm capitalize cursor - pointer focus: outline - none focus: ring - 2 focus: ring - purple - 500[&> option]: bg - gray - 800[&> option]: text - white ${getStatusColor(agent.status)} `}
                                                >
                                                    <option value="available">Available</option>
                                                    <option value="busy">Busy</option>
                                                    <option value="offline">Offline</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(agent)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(agent._id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AgentsPage;
