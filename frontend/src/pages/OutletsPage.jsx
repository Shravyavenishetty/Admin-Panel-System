/**
 * Outlets Management Page - WITH EDIT FUNCTIONALITY
 * Complete CRUD interface for outlet management
 */

import { useState, useEffect } from 'react';
import { getAllOutlets, createOutlet, deleteOutlet, updateOutlet } from '../services/outletService';

const OutletsPage = () => {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        city: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOutlets();
    }, []);

    const fetchOutlets = async () => {
        try {
            setLoading(true);
            const response = await getAllOutlets();
            setOutlets(response.data || []);
        } catch (err) {
            setError('Failed to fetch outlets');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingId) {
                await updateOutlet(editingId, formData);
            } else {
                await createOutlet(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', address: '', phone: '', city: '', managerName: '' });
            fetchOutlets();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || `Failed to ${editingId ? 'update' : 'create'} outlet`;
            setError(errorMessage);
        }
    };

    const handleEdit = (outlet) => {
        setEditingId(outlet._id);
        setFormData({
            name: outlet.name,
            address: outlet.address,
            phone: outlet.phone,
            city: outlet.city || '',
        });
        setShowForm(true);
        setError('');
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', address: '', phone: '', city: '', managerName: '' });
        setError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this outlet?')) return;

        try {
            await deleteOutlet(id);
            fetchOutlets();
        } catch (err) {
            setError('Failed to delete outlet');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Outlets</h1>
                    <p className="text-white/70">Manage your restaurant outlets</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm && editingId) {
                            handleCancelEdit();
                        } else {
                            setShowForm(!showForm);
                            if (!showForm) {
                                setEditingId(null);
                                setFormData({ name: '', address: '', phone: '', city: '' });
                            }
                        }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                    {showForm ? 'Cancel' : '+ Add Outlet'}
                </button>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">{editingId ? 'Edit Outlet' : 'Add New Outlet'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Outlet Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter outlet name"
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
                            <label className="block text-white/90 text-sm font-medium mb-2">Address *</label>
                            <input
                                type="text"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter full address"
                            />
                        </div>
                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">City</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="City name"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                            >
                                {editingId ? 'Update Outlet' : 'Create Outlet'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Outlets Table - Only show when form is hidden */}
            {!showForm && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-white">Loading...</div>
                    ) : outlets.length === 0 ? (
                        <div className="p-8 text-center text-white/70">No outlets found. Add one to get started!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Address</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">City</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {outlets.map((outlet) => (
                                        <tr key={outlet._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{outlet.name}</td>
                                            <td className="px-6 py-4 text-white/80">{outlet.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white/80">{outlet.city || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white/80">{outlet.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(outlet)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(outlet._id)}
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

export default OutletsPage;
