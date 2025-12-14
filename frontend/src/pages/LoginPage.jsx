/**
 * Login Page
 * Modern admin login interface with glassmorphism design
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Login card with glassmorphism */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
                    {/* Logo/Header Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Admin Panel
                        </h1>
                        <p className="text-white/70">
                            Sign in to manage your platform
                        </p>
                    </div>

                    {/* Login Form */}
                    <LoginForm onSubmit={handleLogin} error={error} />

                    {/* Footer text */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-white/60">
                            Protected by enterprise-grade security
                        </p>
                    </div>
                </div>

                {/* Decorative text */}
                <div className="text-center mt-6">
                    <p className="text-white/40 text-xs">
                        © 2024 Admin Panel System. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
