/**
 * Dashboard Page
 * Protected admin dashboard accessible only to authenticated users
 */

import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const DashboardPage = () => {
    const navigate = useNavigate();

    /**
     * Handle user logout
     * Calls logout service and redirects to login page
     */
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header/Navbar */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Card */}
                <div className="card mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Welcome to Admin Panel
                    </h2>
                    <p className="text-gray-600">
                        You have successfully logged in. This is a protected dashboard accessible only to authenticated admins.
                    </p>
                </div>

                {/* Stats Grid - Placeholder for future features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="card">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Staff</h3>
                        <p className="text-3xl font-bold text-primary-600">0</p>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="card">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Agents</h3>
                        <p className="text-3xl font-bold text-primary-600">0</p>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="card">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Active Outlets</h3>
                        <p className="text-3xl font-bold text-primary-600">0</p>
                    </div>
                </div>

                {/* Quick Actions - Placeholder */}
                <div className="card mt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Quick Actions
                    </h2>
                    <p className="text-gray-600">
                        Staff management, delivery agent management, and outlet management features will be added in the next phase.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
