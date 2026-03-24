import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import PageLoader from '../../shared/components/ui/PageLoader';
import WorkspaceLayout from '../../shared/components/layout/WorkspaceLayout';
import AuthLayout from '../../shared/components/layout/AuthLayout';
import LandingLayout from '../../shared/components/layout/LandingLayout';
import PublicLayout from '../../shared/components/layout/PublicLayout';
import RouteEffects from '../../shared/components/layout/RouteEffects';
import StudentRoleBlocker from '../../features/student/components/StudentRoleBlocker';
import Landing from '../../features/landing/pages/Landing';
import AuthPortal from '../../features/auth/pages/AuthPortal';
import { AUTH_MODAL_MODES } from '../../shared/utils/auth/authModal';

// Lazy load components
const loadDashboard = (key) =>
  React.lazy(() =>
    import('../../features/dashboards').then((module) => ({ default: module[key] }))
  );
const Dashboard = loadDashboard('CorporateDashboard');
const Engagements = React.lazy(() => import('../../features/corporate/pages/Engagements'));
const Reports = React.lazy(() => import('../../features/corporate/pages/Reports'));
const Remediation = React.lazy(() => import('../../features/corporate/pages/Remediation'));
const Assets = React.lazy(() => import('../../features/corporate/pages/Assets'));
const Billing = React.lazy(() => import('../../features/corporate/pages/Billing'));
const CorporatePentest = React.lazy(() => import('../../features/corporate/pages/Pentest'));
const Services = React.lazy(() => import('../../features/services/pages/Services'));
const About = React.lazy(() => import('../../features/about/pages/About'));
const Team = React.lazy(() => import('../../features/team/pages/Team'));
const Developer = React.lazy(() => import('../../features/developer/pages/Developer'));
const Contact = React.lazy(() => import('../../features/contact/pages/Contact'));
const ServiceDetail = React.lazy(() => import('../../features/services/pages/ServiceDetail'));
const StudentDashboard = loadDashboard('StudentDashboard');
const StudentResources = React.lazy(() => import('../../features/student/pages/StudentResources'));
const StudentQuizMaterial = React.lazy(() => import('../../features/student/pages/StudentQuizMaterial'));
const StudentPayments = React.lazy(() => import('../../features/student/pages/StudentPayments'));
const StudentBootcamp = React.lazy(() => import('../../features/student/pages/StudentBootcamp'));
const StudentOnboarding = React.lazy(() => import('../../features/student/pages/StudentOnboarding'));
const BootcampLayout = React.lazy(() => import('../../features/student/pages/bootcamp/BootcampLayout'));
const BootcampOverview = React.lazy(() => import('../../features/student/pages/bootcamp/BootcampOverview'));
const BootcampModules = React.lazy(() => import('../../features/student/pages/bootcamp/BootcampModules'));
const BootcampModule = React.lazy(() => import('../../features/student/pages/bootcamp/BootcampModule'));
const BootcampRoom = React.lazy(() => import('../../features/student/pages/bootcamp/BootcampRoom'));
const BootcampLiveClass = React.lazy(() => import('../../features/student/pages/bootcamp/BootcampLiveClass'));
const BootcampResources = React.lazy(() => import('../../features/student/pages/bootcamp/BootcampResources'));
const BootcampProgress = React.lazy(() => import('../../features/student/pages/bootcamp/BootcampProgress'));
const AdminLayout = React.lazy(() => import('../../features/dashboards/admin/components/AdminLayout'));
const AdminOverview = React.lazy(() => import('../../features/dashboards/admin/pages/AdminOverview'));
const AdminUsers = React.lazy(() => import('../../features/dashboards/admin/pages/AdminUsers'));
const AdminPentests = React.lazy(() => import('../../features/dashboards/admin/pages/AdminPentests'));
const AdminCommunity = React.lazy(() => import('../../features/dashboards/admin/pages/AdminCommunity'));
const AdminOperations = React.lazy(() => import('../../features/dashboards/admin/pages/AdminOperations'));
const AdminContent = React.lazy(() => import('../../features/dashboards/admin/pages/AdminContent'));
const AdminSecurity = React.lazy(() => import('../../features/dashboards/admin/pages/AdminSecurity'));
const PentesterDashboard = loadDashboard('PentesterDashboard');
const PentesterEngagements = React.lazy(() =>
  import('../../features/dashboards/pentester/pages/PentesterEngagements')
);
const PentesterEngagementDetails = React.lazy(() =>
  import('../../features/dashboards/pentester/pages/PentesterEngagementDetails')
);
const PentesterReports = React.lazy(() =>
  import('../../features/dashboards/pentester/pages/PentesterReports')
);
const PentesterProfiles = React.lazy(() =>
  import('../../features/dashboards/pentester/pages/PentesterProfiles')
);
const CommunityHub = React.lazy(() => import('../../features/community/pages/CommunityHub'));
const CommunityProfile = React.lazy(() => import('../../features/community/pages/CommunityProfile'));
const CommunityProfiles = React.lazy(() => import('../../features/community/pages/CommunityProfiles'));
const CommunityMedia = React.lazy(() => import('../../features/community/pages/CommunityMedia'));
const NotificationsInbox = React.lazy(() => import('../../features/notifications/pages/NotificationsInbox'));
const PublicProfile = React.lazy(() => import('../../features/public/pages/PublicProfile'));
const AccountSettings = React.lazy(() => import('../../features/account/pages/AccountSettings'));
const Careers = React.lazy(() => import('../../features/careers/pages/Careers'));
const Methodology = React.lazy(() => import('../../features/methodology/pages/Methodology'));
const CaseStudies = React.lazy(() => import('../../features/case-studies/pages/CaseStudies'));
const Blog = React.lazy(() => import('../../features/blog/pages/Blog'));
const Pricing = React.lazy(() => import('../../features/pricing/pages/Pricing'));
const Feedback = React.lazy(() => import('../../features/feedback/pages/Feedback'));
const Terms = React.lazy(() => import('../../features/terms/pages/Terms'));
const Courses = React.lazy(() => import('../../features/courses/pages/Courses'));
const CourseDetails = React.lazy(() => import('../../features/courses/pages/CourseDetails'));
const CourseModuleDetails = React.lazy(() => import('../../features/courses/pages/CourseModuleDetails'));
const CourseRoomDetails = React.lazy(() => import('../../features/courses/pages/CourseRoomDetails'));
const Leaderboard = React.lazy(() => import('../../features/leaderboard/pages/Leaderboard'));
const CPPoints = React.lazy(() => import('../../features/cp-points/pages/CPPoints'));
const NotFound = React.lazy(() => import('../../features/notfound/pages/NotFound'));
const ForcePasswordChange = React.lazy(() => import('../../features/auth/pages/ForcePasswordChange'));
const VerifyEmail = React.lazy(() => import('../../features/auth/pages/VerifyEmail'));

/**
 * Protected Route
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <PageLoader message="Authenticating session..." durationMs={0} />;
  if (!isAuthenticated) {
    const redirect = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={{ pathname: '/', search: `?auth=${AUTH_MODAL_MODES.LOGIN}&redirect=${encodeURIComponent(redirect)}` }}
        replace
      />
    );
  }
  return children;
};

/**
 * Role-protected Route
 */
const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const role = user?.role === 'client' ? 'corporate' : user?.role;

  if (isLoading) return <PageLoader message="Preparing your workspace..." durationMs={0} />;
  if (!isAuthenticated) {
    const redirect = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={{ pathname: '/', search: `?auth=${AUTH_MODAL_MODES.LOGIN}&redirect=${encodeURIComponent(redirect)}` }}
        replace
      />
    );
  }
  if (!role) return <PageLoader message="Loading your profile..." durationMs={0} />;
  if (!allowedRoles.includes(role)) {
    if (role === 'student') return <StudentRoleBlocker />;
    if (role === 'admin') return <Navigate to="/mr-robot" replace />;
    if (role === 'pentester') return <Navigate to="/pentester" replace />;
    return <Navigate to={role === 'student' ? '/student-dashboard' : '/corporate-dashboard'} replace />;
  }
  return children;
};

const PublicHandleRoute = () => {
  const { handle } = useParams();
  if (!handle || !String(handle).startsWith('@')) {
    return <NotFound />;
  }
  return <PublicProfile />;
};

const CommunityProfileRedirect = () => {
  const { handle } = useParams();
  if (!handle) {
    return <Navigate to="/community" replace />;
  }
  const normalized = String(handle).trim().replace(/^@/, '');
  if (!normalized) {
    return <Navigate to="/community" replace />;
  }
  return <Navigate to={`/@${normalized}`} replace />;
};

const LegacyBootcampModuleRedirect = () => {
  const { moduleId } = useParams();
  return <Navigate to={`/student-bootcamps/modules/${moduleId}`} replace />;
};

const LegacyBootcampRoomRedirect = () => {
  const { moduleId, roomId } = useParams();
  return <Navigate to={`/student-bootcamps/modules/${moduleId}/rooms/${roomId}`} replace />;
};

const LoadingFallback = () => <PageLoader message="Loading secure interface..." durationMs={0} />;

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
              element={<Navigate to={{ pathname: '/posts', search: `?auth=${AUTH_MODAL_MODES.LOGIN}` }} replace />}
            />
            <Route
              path="pentester-login"
              element={<Navigate to={{ pathname: '/posts', search: `?auth=${AUTH_MODAL_MODES.PENTESTER_LOGIN}` }} replace />}
            />
            <Route
              path="register"
              element={<Navigate to={{ pathname: '/posts', search: `?auth=${AUTH_MODAL_MODES.REGISTER}` }} replace />}
            />
            <Route
              path="register/corporate"
              element={<Navigate to={{ pathname: '/posts', search: `?auth=${AUTH_MODAL_MODES.CORPORATE_REGISTER}` }} replace />}
            />
            <Route path="posts" element={<AuthPortal />} />
            <Route path="change-password" element={<ForcePasswordChange />} />
            <Route path="verify-email" element={<VerifyEmail />} />
          </Route>

          {/* Bootcamp learning app (standalone layout) */}
          {/* Workspace pages - dashboard and student learning */}
          <Route element={<WorkspaceLayout />}>
            <Route
              path="community"
              element={
                <RoleRoute allowedRoles={['student', 'pentester', 'admin']}>
                  <CommunityHub />
                </RoleRoute>
              }
            />
            <Route
              path="community/profiles"
              element={
                <RoleRoute allowedRoles={['student', 'pentester', 'admin']}>
                  <CommunityProfiles />
                </RoleRoute>
              }
            />
            <Route
              path="community/media"
              element={
                <RoleRoute allowedRoles={['student', 'pentester', 'admin']}>
                  <CommunityMedia />
                </RoleRoute>
              }
            />
            <Route
              path="notifications"
              element={
                <RoleRoute allowedRoles={['student', 'pentester', 'admin', 'corporate']}>
                  <NotificationsInbox />
                </RoleRoute>
              }
            />
            <Route
              path="community/profile/:handle"
              element={
                <RoleRoute allowedRoles={['student', 'pentester', 'admin']}>
                  <CommunityProfileRedirect />
                </RoleRoute>
              }
            />
            <Route
              path="corporate-dashboard"
              element={
                <RoleRoute allowedRoles={['corporate']}>
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
              path="corporate/pentest"
              element={
                <RoleRoute allowedRoles={['corporate']}>
                  <CorporatePentest />
                </RoleRoute>
              }
            />
            <Route
              path="pentest"
              element={
                <RoleRoute allowedRoles={['pentester']}>
                  <PentesterEngagements />
                </RoleRoute>
              }
            />
            <Route
              path="pentester/engagements"
              element={
                <RoleRoute allowedRoles={['pentester']}>
                  <PentesterEngagements />
                </RoleRoute>
              }
            />
            <Route
              path="pentester/engagements/:id"
              element={
                <RoleRoute allowedRoles={['pentester']}>
                  <PentesterEngagementDetails />
                </RoleRoute>
              }
            />
            <Route
              path="pentester/reports"
              element={
                <RoleRoute allowedRoles={['pentester']}>
                  <PentesterReports />
                </RoleRoute>
              }
            />
            <Route
              path="pentester/profiles"
              element={
                <RoleRoute allowedRoles={['pentester']}>
                  <PentesterProfiles />
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
                  <AdminLayout />
                </RoleRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="community" element={<AdminCommunity />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="pentests" element={<AdminPentests />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="operations" element={<AdminOperations />} />
              <Route path="security" element={<AdminSecurity />} />
            </Route>
            <Route
              path="student-dashboard"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="student-onboarding"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentOnboarding />
                </RoleRoute>
              }
            />
            <Route
              path="student-bootcamps"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <BootcampLayout />
                </RoleRoute>
              }
            >
              <Route index element={<StudentBootcamp />} />
              <Route path="overview" element={<BootcampOverview />} />
              <Route path="modules" element={<BootcampModules />} />
              <Route path="modules/:moduleId" element={<BootcampModule />} />
              <Route path="modules/:moduleId/rooms/:roomId" element={<BootcampRoom />} />
              <Route path="live-class" element={<BootcampLiveClass />} />
              <Route path="resources" element={<BootcampResources />} />
              <Route path="progress" element={<BootcampProgress />} />
              <Route
                path="hacker-protocol/dashboard"
                element={<Navigate to="/student-bootcamps/overview" replace />}
              />
              <Route
                path="hacker-protocol/modules/:moduleId"
                element={<LegacyBootcampModuleRedirect />}
              />
              <Route
                path="hacker-protocol/module/:moduleId/room/:roomId"
                element={<LegacyBootcampRoomRedirect />}
              />
            </Route>
            <Route
              path="student-learning"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <Navigate to="/student-bootcamps/overview" replace />
                </RoleRoute>
              }
            />
            <Route
              path="student-resources"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentResources />
                </RoleRoute>
              }
            />
            <Route
              path="student-quiz-material"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentQuizMaterial />
                </RoleRoute>
              }
            />
            <Route
              path="student-bootcamp"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <Navigate to="/student-bootcamps" replace />
                </RoleRoute>
              }
            />
            <Route
              path="student-payments"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentPayments />
                </RoleRoute>
              }
            />
            <Route
              path="settings"
              element={
                <RoleRoute allowedRoles={['student', 'pentester', 'corporate', 'admin']}>
                  <AccountSettings />
                </RoleRoute>
              }
            />
          </Route>

          {/* Public pages - about, team, blog, etc. */}
          <Route element={<PublicLayout />}>
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="services" element={<Services />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="about" element={<About />} />
            <Route path="team" element={<Team />} />
            <Route path="developer" element={<Developer />} />
            <Route path="contact" element={<Contact />} />
            <Route path="careers" element={<Careers />} />
            <Route path="methodology" element={<Methodology />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="blog" element={<Blog />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:bootcampId" element={<CourseDetails />} />
          <Route path="courses/:bootcampId/modules/:moduleId" element={<CourseModuleDetails />} />
          <Route path="courses/:bootcampId/modules/:moduleId/rooms/:roomId" element={<CourseRoomDetails />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="cp-points" element={<CPPoints />} />
          <Route path="terms" element={<Terms />} />
          <Route path="terms-and-conditions" element={<Terms />} />
          <Route path=":handle" element={<PublicHandleRoute />} />
        </Route>

          {/* 404 - minimal layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
