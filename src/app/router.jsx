import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import PageLoader from '../shared/components/ui/PageLoader';
import AppLayout from '../shared/components/layout/AppLayout';
import AuthLayout from '../shared/components/layout/AuthLayout';
import LandingLayout from '../shared/components/layout/LandingLayout';
import PublicLayout from '../shared/components/layout/PublicLayout';

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
const StudentLearning = React.lazy(() => import('../features/student/StudentLearning'));
const StudentLesson = React.lazy(() => import('../features/student/StudentLesson'));
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
  if (isLoading) return <PageLoader message="Authenticating session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

/**
 * Role-protected Route
 */
const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const role = user?.role === 'client' ? 'corporate' : user?.role;

  if (isLoading) return <PageLoader message="Preparing your workspace..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={role === 'student' ? '/student-dashboard' : '/dashboard'} replace />;
  }
  return children;
};

/**
 * Public Route (redirects auth users to dashboard)
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader message="Preparing your workspace..." />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const LoadingFallback = () => <PageLoader message="Loading secure interface..." />;

/**
 * App Router with nested layouts
 */
const AppRouter = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Landing - full-width marketing layout */}
          <Route element={<LandingLayout />}>
            <Route index element={<Landing />} />
          </Route>

          {/* Auth pages - login, register */}
          <Route element={<AuthLayout />}>
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
          </Route>

          {/* App pages - dashboard, audits, pentest, student */}
          <Route element={<AppLayout />}>
            <Route
              path="dashboard"
              element={
                <RoleRoute allowedRoles={['corporate']}>
                  <Dashboard />
                </RoleRoute>
              }
            />
            <Route
              path="audits"
              element={
                <RoleRoute allowedRoles={['corporate']}>
                  <Audits />
                </RoleRoute>
              }
            />
            <Route
              path="pentest"
              element={
                <RoleRoute allowedRoles={['corporate']}>
                  <Pentest />
                </RoleRoute>
              }
            />
            <Route
              path="student-dashboard"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="student-learning"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentLearning />
                </RoleRoute>
              }
            />
            <Route
              path="student-learning/module/:moduleId/room/:roomId"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentLesson />
                </RoleRoute>
              }
            />
          </Route>

          {/* Public pages - about, team, blog, etc. */}
          <Route element={<PublicLayout />}>
            <Route path="feedback" element={<Feedback />} />
            <Route path="about" element={<About />} />
            <Route path="team" element={<Team />} />
            <Route path="developer" element={<Developer />} />
            <Route path="community" element={<Community />} />
            <Route path="careers" element={<Careers />} />
            <Route path="methodology" element={<Methodology />} />
            <Route path="case-studies" element={<CaseStudies />} />
            <Route path="blog" element={<Blog />} />
          </Route>

          {/* 404 - minimal layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
