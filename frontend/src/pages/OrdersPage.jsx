/**
 * Orders Management Page
 * View orders with filters and status management
 */

import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { getAllOutlets } from '../services/outletService';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        outlet: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
        fetchOutlets();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getAllOrders(filters);
            setOrders(response.data || []);
        } catch (err) {
            setError('Failed to fetch orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOutlets = async () => {
        try {
            const response = await getAllOutlets();
            setOutlets(response.data || []);
        } catch (err) {
            console.error('Failed to fetch outlets', err);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    const handleApplyFilters = () => {
        fetchOrders();
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders(); // Refresh orders
        } catch (err) {
            setError('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-300',
            preparing: 'bg-blue-500/20 text-blue-300',
            ready: 'bg-purple-500/20 text-purple-300',
            delivered: 'bg-green-500/20 text-green-300',
            cancelled: 'bg-red-500/20 text-red-300',
        };
        return colors[status] || colors.pending;
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
                <p className="text-white/70">View and manage all orders</p>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">Outlet</label>
                        <select
                            value={filters.outlet}
                            onChange={(e) => handleFilterChange('outlet', e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">All Outlets</option>
                            {outlets.map((outlet) => (
                                <option key={outlet._id} value={outlet._id}>
                                    {outlet.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleApplyFilters}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-white">Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center text-white/70">No orders found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Order #</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Outlet</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-white font-mono">{order.orderNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-white">{order.customerName}</div>
                                            <div className="text-white/60 text-sm">{order.customerPhone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-white/80">
                                            {order.outlet?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">
                                            ${order.totalAmount?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-sm capitalize cursor-pointer border-0 focus:ring-2 focus:ring-purple-500 ${getStatusColor(order.status)}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="ready">Ready</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-white/80 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
