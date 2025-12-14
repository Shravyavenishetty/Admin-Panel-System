/**
 * Dashboard Page
 * Modern admin dashboard with stats, navigation, and analytics
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        {/* Quick Actions - Placeholder */ }
        <div className="card mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
            </h2>
            <p className="text-gray-600">
                Staff management, delivery agent management, and outlet management features will be added in the next phase.
            </p>
        </div>
            </main >
        </div >
    );
};

export default DashboardPage;
