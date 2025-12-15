/**
 * Main Application Component
 * Sets up routing and application structure with CRUD pages
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StaffPage from './pages/StaffPage';
import AgentsPage from './pages/AgentsPage';
import OutletsPage from './pages/OutletsPage';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public route - Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes - Wrapped in Layout with Sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <Layout>
                <StaffPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <Layout>
                <AgentsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/outlets"
          element={
            <ProtectedRoute>
              <Layout>
                <OutletsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Layout>
                <OrdersPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Menu Management */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Layout>
                <MenuPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
