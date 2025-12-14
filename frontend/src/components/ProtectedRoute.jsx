/**
 * Protected Route Component
 * Wrapper component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 */

import { Navigate } from 'react-router-dom';
import { hasToken } from '../utils/tokenManager';

const ProtectedRoute = ({ children }) => {
    // Check if user has authentication token
    const isAuthenticated = hasToken();

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the protected component
    return children;
};

export default ProtectedRoute;
