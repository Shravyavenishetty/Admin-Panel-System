/**
 * Staff Management Page
 * Complete CRUD interface for staff management
 */

import { useState, useEffect } from 'react';
import { getAllStaff, createStaff, deleteStaff } from '../services/staffService';

const StaffPage = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'server',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch staff on component mount
    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await getAllStaff();
            setStaff(response.data || []);
            setError(''); // Clear any errors on successful fetch
        } catch (err) {
            setError('Failed to fetch staff');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setSuccess('');

        try {
            await createStaff(formData);
            setSuccess('Staff member added successfully!');
            setShowForm(false);
            setFormData({ name: '', email: '', phone: '', role: 'server' });
            fetchStaff();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to create staff. Please check your connection and try again.';
            setError(errorMsg);
            console.error('Create staff error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;

        setError('');
        setSuccess('');

        try {
            await deleteStaff(id);
            setSuccess('Staff member deleted successfully!');
            fetchStaff();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete staff');
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
        setError(''); // Clear errors when toggling form
        setSuccess('');
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Staff Management</h1>
                    <p className="text-white/70">Manage your staff members</p>
                </div>
                <button
                    onClick={toggleForm}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                    {showForm ? 'Cancel' : '+ Add Staff'}
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-white px-4 py-3 rounded-xl mb-6">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Add Staff Form */}
            {showForm && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Add New Staff</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter staff name"
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
                                placeholder="staff@example.com"
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
                            <label className="block text-white/90 text-sm font-medium mb-2">Role *</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
                            >
                                <option value="manager">Manager</option>
                                <option value="cashier">Cashier</option>
                                <option value="cook">Cook</option>
                                <option value="server">Server</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                            >
                                Create Staff
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Staff Table - Only show when form is hidden */}
            {!showForm && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-white">Loading...</div>
                    ) : staff.length === 0 ? (
                        <div className="p-8 text-center text-white/70">No staff members found. Add one to get started!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {staff.map((member) => (
                                        <tr key={member._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-white">{member.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white/80">{member.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white/80">{member.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm capitalize">
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDelete(member._id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
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

export default StaffPage;
