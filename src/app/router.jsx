import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';

// Lazy load components
const Login = React.lazy(() => import('../features/auth/Login'));
const Dashboard = React.lazy(() => import('../features/dashboard/Dashboard'));
const Audits = React.lazy(() => import('../features/audits/Audits'));
const Pentest = React.lazy(() => import('../features/pentest/Pentest'));
const Feedback = React.lazy(() => import('../features/feedback/Feedback'));
const Landing = React.lazy(() => import('../features/landing/Landing'));

/**
 * Protected Route
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Public Route
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/**
 * Loading fallback
 */
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner" />
    <p>Loading...</p>
  </div>
);

/**
 * App Router
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>

          {/* Default Route - Landing Page */}
          <Route 
            path="/" 
            element={<Landing />} 
          />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/feedback"
            element={<Feedback />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/audits"
            element={
              <ProtectedRoute>
                <Audits />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pentest"
            element={
              <ProtectedRoute>
                <Pentest />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h1>404</h1>
                <p>Page not found</p>
                <a href="/">Go home</a>
              </div>
            }
          />

        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
