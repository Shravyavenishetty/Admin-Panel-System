/**
 * Menu Management Page
 * Complete CRUD interface for menu items with image upload
 */

import { useState, useEffect } from 'react';
import {
    getMenuItems,
    getMenuCategories,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuAvailability,
} from '../services/menuService';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        foodType: 'veg',
        tags: '',
        availability: true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Filters
    const [filters, setFilters] = useState({
        category: '',
        available: '',
        search: '',
        page: 1,
        limit: 10,
    });
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchMenuItems();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const response = await getMenuCategories();
            setCategories(response.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            console.log('Fetching menu items with filters:', filters);
            console.log('Filter details:', JSON.stringify(filters, null, 2));
            const response = await getMenuItems(filters);
            console.log('API Response:', response);
            console.log('Menu items data:', response.data);
            console.log('Menu items length:', response.data?.length);
            setMenuItems(response.data || []);
            setPagination(response.pagination);
        } catch (err) {
            setError('Failed to fetch menu items');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('foodType', formData.foodType);
            formDataToSend.append('availability', formData.availability);

            if (formData.tags) {
                const tagsArray = formData.tags.split(',').map(tag => tag.trim());
                tagsArray.forEach(tag => formDataToSend.append('tags[]', tag));
            }

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            if (editingId) {
                await updateMenuItem(editingId, formDataToSend);
                setSuccess('Menu item updated successfully!');
            } else {
                await createMenuItem(formDataToSend);
                setSuccess('Menu item created successfully!');
            }

            setShowForm(false);
            setEditingId(null);
            resetForm();
            fetchMenuItems();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} menu item`);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category,
            foodType: item.foodType,
            tags: item.tags ? item.tags.join(', ') : '',
            availability: item.availability,
        });
        setImagePreview(item.image);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) return;

        try {
            await deleteMenuItem(id);
            setSuccess('Menu item deleted successfully!');
            fetchMenuItems();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete menu item');
        }
    };

    const handleToggleAvailability = async (id) => {
        try {
            await toggleMenuAvailability(id);
            fetchMenuItems();
        } catch (err) {
            setError('Failed to toggle availability');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            foodType: 'veg',
            tags: '',
            availability: true,
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingId(null);
        resetForm();
        setError('');
        setSuccess('');
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1, // Reset to page 1 when filtering
        }));
    };

    const getFoodTypeColor = (type) => {
        const colors = {
            veg: 'bg-green-500/20 text-green-300',
            'non-veg': 'bg-red-500/20 text-red-300',
            vegan: 'bg-purple-500/20 text-purple-300',
        };
        return colors[type] || colors.veg;
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Menu Management</h1>
                    <p className="text-white/70">Manage your café menu items</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm && editingId) {
                            handleCancelEdit();
                        } else {
                            setShowForm(!showForm);
                            if (!showForm) {
                                setEditingId(null);
                                resetForm();
                            }
                        }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                    {showForm ? 'Cancel' : '+ Add Menu Item'}
                </button>
            </div>

            {/* Success/Error Messages */}
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-white px-4 py-3 rounded-xl mb-6">
                    {success}
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">
                        {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Item Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Classic Filter Coffee"
                            />
                        </div>

                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Price (₹) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="99"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-white/90 text-sm font-medium mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Brief description of the item"
                                rows="3"
                            />
                        </div>

                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Category *</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Food Type *</label>
                            <select
                                value={formData.foodType}
                                onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
                            >
                                <option value="veg">Vegetarian</option>
                                <option value="non-veg">Non-Vegetarian</option>
                                <option value="vegan">Vegan</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="hot, coffee, signature"
                            />
                        </div>

                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                                />
                            )}
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.availability}
                                    onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                                    className="mr-2 w-5 h-5"
                                />
                                <span className="text-white/90">Available for order</span>
                            </label>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                            >
                                {editingId ? 'Update Menu Item' : 'Create Menu Item'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            {!showForm && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Search menu items..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={filters.available}
                                onChange={(e) => handleFilterChange('available', e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
                            >
                                <option value="">All Items</option>
                                <option value="true">Available Only</option>
                                <option value="false">Unavailable Only</option>
                            </select>
                        </div>
                        <div>
                            <button
                                onClick={() => setFilters({ category: '', available: '', search: '', page: 1, limit: 10 })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Items Table */}
            {!showForm && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-white">Loading...</div>
                    ) : menuItems.length === 0 ? (
                        <div className="p-8 text-center text-white/70">No menu items found. Add one to get started!</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {menuItems.map((item) => (
                                            <tr key={item._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center text-white/50">
                                                            No Image
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-white font-medium">{item.name}</div>
                                                    {item.description && (
                                                        <div className="text-white/60 text-sm mt-1">{item.description.substring(0, 50)}...</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-white/80">{item.category}</td>
                                                <td className="px-6 py-4 text-white font-semibold">₹{item.price}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm capitalize ${getFoodTypeColor(item.foodType)}`}>
                                                        {item.foodType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleToggleAvailability(item._id)}
                                                        className={`px-3 py-1 rounded-full text-sm ${item.availability
                                                            ? 'bg-green-500/20 text-green-300'
                                                            : 'bg-red-500/20 text-red-300'
                                                            }`}
                                                    >
                                                        {item.availability ? 'Available' : 'Unavailable'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
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

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="p-4 flex justify-between items-center border-t border-white/10">
                                    <div className="text-white/70 text-sm">
                                        Showing {menuItems.length} of {pagination.totalItems} items
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                            disabled={!pagination.hasPrev}
                                            className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-4 py-2 text-white">
                                            Page {pagination.currentPage} of {pagination.totalPages}
                                        </span>
                                        <button
                                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                            disabled={!pagination.hasNext}
                                            className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default MenuPage;
