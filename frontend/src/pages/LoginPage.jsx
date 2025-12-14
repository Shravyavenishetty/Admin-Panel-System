/**
 * Login Page
 * Admin login interface with authentication
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { login } from '../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    /**
     * Handle login form submission
     * @param {string} email - User email
     * @param {string} password - User password
     */
    const handleLogin = async (email, password) => {
        try {
            setError(''); // Clear any previous errors
            await login(email, password);
            // On successful login, redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            // Display error message to user
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
            <div className="card max-w-md w-full">
                {/* Logo/Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Admin Panel
                    </h1>
                    <p className="text-gray-600">
                        Sign in to access your dashboard
                    </p>
                </div>

                {/* Login Form */}
                <LoginForm onSubmit={handleLogin} error={error} />
            </div>
        </div>
    );
};

export default LoginPage;
