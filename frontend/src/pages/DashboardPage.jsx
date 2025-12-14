/**
 * Dashboard Page
 * Modern admin dashboard with stats, navigation, and analytics
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, getCurrentAdmin } from '../services/authService';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        // Fetch current admin details
        const fetchAdmin = async () => {
            try {
                const data = await getCurrentAdmin();
                setAdmin(data);
            } catch (error) {
                console.error('Error fetching admin:', error);
            }
        };
        fetchAdmin();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Stats data
    const stats = [
        {
            title: 'Total Users',
            value: '2,543',
            change: '+12%',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'from-purple-500 to-purple-700',
        },
        {
            title: 'Active Orders',
            value: '142',
            change: '+8%',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            color: 'from-blue-500 to-blue-700',
        },
        {
            title: 'Revenue',
            value: '$45,231',
            change: '+23%',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'from-green-500 to-green-700',
        },
        {
            title: 'Pending Tasks',
            value: '28',
            change: '-5%',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            color: 'from-orange-500 to-orange-700',
        },
    ];

    // Quick actions with navigation
    const quickActions = [
        { name: 'Manage Staff', path: '/staff', color: 'purple' },
        { name: 'Delivery Agents', path: '/agents', color: 'blue' },
        { name: 'Manage Outlets', path: '/outlets', color: 'green' },
        { name: 'View Orders', path: '/orders', color: 'orange' },
    ];

    return (
        <div className="p-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {admin?.name || 'Admin'}!
                </h2>
                <p className="text-white/70">
                    Here's what's happening with your platform today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                                {stat.icon}
                            </div>
                            <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-white/70 text-sm mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.path}
                            className="bg-white/10 hover:bg-white/20 rounded-xl p-4 border border-white/20 transition-all duration-200 transform hover:scale-105 block"
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-white text-sm font-medium">{action.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg"></div>
                                    <div>
                                        <p className="text-white font-medium">Activity #{item}</p>
                                        <p className="text-white/60 text-sm">Just now</p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
