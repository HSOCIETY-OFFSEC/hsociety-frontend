// src/app/routes.jsx

/**
 * Application Routes Configuration
 * Centralized routing with protection logic
 */

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../modules/auth/components/ProtectedRoute';
import PublicRoute from '../modules/auth/components/PublicRoute';

// Page imports
import Landing from '../shared/pages/Landing';
import Login from '../modules/auth/pages/Login';
import Signup from '../modules/auth/pages/Signup';
import Dashboard from '../modules/dashboard/pages/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      
      {/* Auth Routes - redirect if already logged in */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } 
      />
      
      {/* Protected Routes - require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* TODO: Add more protected routes for modules */}
      {/* 
      <Route path="/pentests/*" element={<ProtectedRoute><PentestRoutes /></ProtectedRoute>} />
      <Route path="/tasks/*" element={<ProtectedRoute><TaskRoutes /></ProtectedRoute>} />
      <Route path="/audits/*" element={<ProtectedRoute><AuditRoutes /></ProtectedRoute>} />
      */}
    </Routes>
  );
};

export default AppRoutes;