import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import PageLoader from '../shared/components/ui/PageLoader';
import WorkspaceLayout from '../shared/components/layout/WorkspaceLayout';
import AuthLayout from '../shared/components/layout/AuthLayout';
import LandingLayout from '../shared/components/layout/LandingLayout';
import PublicLayout from '../shared/components/layout/PublicLayout';
import RouteEffects from '../shared/components/layout/RouteEffects';

// Lazy load components
const Login = React.lazy(() => import('../features/auth/Login'));
const Register = React.lazy(() => import('../features/auth/Register'));
const Dashboard = React.lazy(() => import('../features/corporate/dashboard/Dashboard'));
const Pentest = React.lazy(() => import('../features/corporate/pentest/Pentest'));
const Engagements = React.lazy(() => import('../features/corporate/engagements/Engagements'));
const Reports = React.lazy(() => import('../features/corporate/reports/Reports'));
const Remediation = React.lazy(() => import('../features/corporate/remediation/Remediation'));
const Assets = React.lazy(() => import('../features/corporate/assets/Assets'));
const Billing = React.lazy(() => import('../features/corporate/billing/Billing'));
const Landing = React.lazy(() => import('../features/landing/Landing'));
const About = React.lazy(() => import('../features/about/About'));
const Team = React.lazy(() => import('../features/team/Team'));
const Developer = React.lazy(() => import('../features/developer/Developer'));
const StudentDashboard = React.lazy(() => import('../features/student/StudentDashboard'));
const StudentLearning = React.lazy(() => import('../features/student/StudentLearning'));
const StudentLesson = React.lazy(() => import('../features/student/StudentLesson'));
const AdminDashboard = React.lazy(() => import('../features/admin/AdminDashboard'));
const PentesterDashboard = React.lazy(() => import('../features/pentester/PentesterDashboard'));
const AccountSettings = React.lazy(() => import('../features/account/AccountSettings'));
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
  if (isLoading) return <PageLoader message="Authenticating session..." durationMs={0} />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

/**
 * Role-protected Route
 */
const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const role = user?.role === 'client' ? 'corporate' : user?.role;

  if (isLoading) return <PageLoader message="Preparing your workspace..." durationMs={0} />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!role) return <PageLoader message="Loading your profile..." durationMs={0} />;
  if (!allowedRoles.includes(role)) {
    if (allowedRoles.includes('corporate') && (role === 'pentester' || role === 'client')) {
      return children;
    }
    if (role === 'admin') return <Navigate to="/mr-robot" replace />;
    if (role === 'pentester') return <Navigate to="/pentester" replace />;
    return <Navigate to={role === 'student' ? '/student-dashboard' : '/corporate-dashboard'} replace />;
  }
  return children;
};

/**
 * Public Route (redirects auth users to dashboard)
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <PageLoader message="Preparing your workspace..." durationMs={0} />;
  const role = user?.role === 'client' ? 'corporate' : user?.role;
  if (isAuthenticated) {
    if (role === 'admin') return <Navigate to="/mr-robot" replace />;
    if (role === 'pentester') return <Navigate to="/pentester" replace />;
    return <Navigate to={role === 'student' ? '/student-dashboard' : '/corporate-dashboard'} replace />;
  }
  return children;
};

const LoadingFallback = () => <PageLoader message="Loading secure interface..." />;

/**
 * App Router with nested layouts
 */
const AppRouter = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteEffects />
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
              path="pentester-login"
              element={
                <PublicRoute>
                  <Login mode="pentester" />
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

          {/* Workspace pages - dashboard and student learning */}
          <Route element={<WorkspaceLayout />}>
            <Route
              path="corporate-dashboard"
              element={
                <RoleRoute allowedRoles={['corporate', 'pentester']}>
                  <Dashboard />
                </RoleRoute>
              }
            />
            <Route
              path="dashboard"
              element={<Navigate to="/corporate-dashboard" replace />}
            />
            <Route
              path="engagements"
              element={
                <RoleRoute allowedRoles={['corporate']}>
                  <Engagements />
                </RoleRoute>
              }
            />
            <Route
              path="reports"
              element={
                <RoleRoute allowedRoles={['corporate']}>
                  <Reports />
                </RoleRoute>
              }
            />
            <Route
              path="remediation"
              element={
                <RoleRoute allowedRoles={['corporate']}>
                  <Remediation />
                </RoleRoute>
              }
            />
            <Route
              path="assets"
              element={
                <RoleRoute allowedRoles={['corporate']}>
                  <Assets />
                </RoleRoute>
              }
            />
            <Route
              path="billing"
              element={
                <RoleRoute allowedRoles={['corporate']}>
                  <Billing />
                </RoleRoute>
              }
            />
            <Route
              path="pentest"
              element={
                <RoleRoute allowedRoles={['pentester']}>
                  <Pentest />
                </RoleRoute>
              }
            />
            <Route
              path="pentester"
              element={
                <RoleRoute allowedRoles={['pentester']}>
                  <PentesterDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="mr-robot"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AdminDashboard />
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
            <Route
              path="settings"
              element={
                <RoleRoute allowedRoles={['student', 'pentester', 'corporate']}>
                  <AccountSettings />
                </RoleRoute>
              }
            />
          </Route>

          {/* Public pages - about, team, blog, etc. */}
          <Route element={<PublicLayout />}> 

          {/**AN error occured in tis line uncomment the feed back route when you are done with codex improvements  */}
            {/* <Route path="feedback" element={<Feedback />} />
   */}
            <Route path="about" element={<About />} />
            <Route path="team" element={<Team />} />
            <Route path="developer" element={<Developer />} />
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
