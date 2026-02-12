import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import PageLoader from '../shared/components/ui/PageLoader';

// Lazy load components
const Login = React.lazy(() => import('../features/auth/Login'));
const Register = React.lazy(() => import('../features/auth/Register'));
const Dashboard = React.lazy(() => import('../features/dashboard/Dashboard'));
const Audits = React.lazy(() => import('../features/audits/Audits'));
const Pentest = React.lazy(() => import('../features/pentest/Pentest'));
const Feedback = React.lazy(() => import('../features/feedback/Feedback'));
const Landing = React.lazy(() => import('../features/landing/Landing'));
const About = React.lazy(() => import('../features/about/About'));
const Team = React.lazy(() => import('../features/team/Team'));
const Developer = React.lazy(() => import('../features/developer/Developer'));
const Community = React.lazy(() => import('../features/community/Community'));
const StudentDashboard = React.lazy(() => import('../features/student/StudentDashboard'));
const Careers = React.lazy(() => import('../features/careers/Careers'));
const Methodology = React.lazy(() => import('../features/methodology/Methodology'));
const CaseStudies = React.lazy(() => import('../features/case-studies/CaseStudies'));
const Blog = React.lazy(() => import('../features/blog/Blog'));
const NotFound = React.lazy(() => import('../features/notfound/NotFound'));

/**
 * Protected Route
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <PageLoader message="Authenticating session..." />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Role-protected Route
 */
const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const role = user?.role === 'client' ? 'corporate' : user?.role;

  if (isLoading) {
    return (
      <PageLoader message="Preparing your workspace..." />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={role === 'student' ? '/student-dashboard' : '/dashboard'} replace />;
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
      <PageLoader message="Preparing your workspace..." />
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
  <PageLoader message="Loading secure interface..." />
);

/**
 * App Router
 */
const AppRouter = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/feedback"
            element={<Feedback />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/team"
            element={<Team />}
          />

          <Route
            path="/developer"
            element={<Developer />}
          />

          <Route
            path="/community"
            element={<Community />}
          />

          <Route
            path="/careers"
            element={<Careers />}
          />

          <Route
            path="/methodology"
            element={<Methodology />}
          />

          <Route
            path="/case-studies"
            element={<CaseStudies />}
          />

          <Route
            path="/blog"
            element={<Blog />}
          />

          <Route
            path="/student-dashboard"
            element={
              <RoleRoute allowedRoles={['student']}>
                <StudentDashboard />
              </RoleRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <RoleRoute allowedRoles={['corporate']}>
                <Dashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/audits"
            element={
              <RoleRoute allowedRoles={['corporate']}>
                <Audits />
              </RoleRoute>
            }
          />

          <Route
            path="/pentest"
            element={
              <RoleRoute allowedRoles={['corporate']}>
                <Pentest />
              </RoleRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
