import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCircle, FiVideo } from 'react-icons/fi';
import { useAuth } from '../../../../core/auth/AuthContext';
import { registerBootcamp } from '../../../dashboards/student/services/student.service';
import { getCurrentUser } from '../../../../core/auth/auth.service';
import BootcampAccessPage from '../../components/bootcamp/BootcampAccessPage';
import BootcampSidebar from '../../components/bootcamp/BootcampSidebar';
import useBootcampAccess from '../../hooks/useBootcampAccess';
import { consumeBootcampRedirect, setBootcampRedirect } from '../../utils/bootcampRedirect';
import '../../styles/bootcamp/bootcamp-app.css';

const BootcampLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const { isRegistered, isPaid, accessRevoked } = useBootcampAccess();
  const [registering, setRegistering] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const allowPreview = location.pathname === '/student-bootcamps' || location.pathname === '/student-bootcamps/';
  const gateAccess = Boolean(user) && !allowPreview && (accessRevoked || !isRegistered || !isPaid);

  useEffect(() => {
    if (!gateAccess) return;
    const nextPath = `${location.pathname}${location.search || ''}`;
    setBootcampRedirect(nextPath);
  }, [gateAccess, location.pathname, location.search]);

  const handleRegisterBootcamp = useCallback(async () => {
    if (registering) return;
    setRegistering(true);
    const response = await registerBootcamp({
      experienceLevel: 'beginner',
      goal: 'Join Hacker Protocol',
      availability: '6-10',
    });

    if (response.success) {
      const refreshed = await getCurrentUser();
      if (refreshed.success && refreshed.user) {
        updateUser(refreshed.user);
      } else {
        updateUser({
          bootcampRegistered: true,
          bootcampStatus: response.data?.bootcampStatus || 'enrolled',
          bootcampPaymentStatus: response.data?.bootcampPaymentStatus || 'unpaid',
        });
      }
      const redirectTo = consumeBootcampRedirect('/student-bootcamps/overview');
      navigate(redirectTo, { replace: true });
    }

    setRegistering(false);
  }, [navigate, registering, updateUser]);

  const accessCopy = useMemo(() => {
    if (accessRevoked) {
      return {
        title: 'Bootcamp access revoked',
        description: 'Your bootcamp access was revoked by an admin. Contact support if you believe this is a mistake.',
        primaryLabel: 'Back to Dashboard',
        onPrimary: () => navigate('/student-dashboard'),
        primaryDisabled: false,
      };
    }

    if (!isRegistered) {
      return {
        title: 'Bootcamp registration required',
        description: 'You have not registered for the bootcamp yet. Register now to begin the enrollment process.',
        primaryLabel: registering ? 'Registering…' : 'Register for Bootcamp',
        onPrimary: handleRegisterBootcamp,
        primaryDisabled: registering,
      };
    }

    return {
      title: 'Bootcamp payment required',
      description: 'Have you completed payment for the bootcamp? Payment unlocks your dashboard access.',
      primaryLabel: 'Go to Payments',
      onPrimary: () => {
        setBootcampRedirect(`${location.pathname}${location.search || ''}`);
        navigate('/student-payments');
      },
      primaryDisabled: false,
    };
  }, [accessRevoked, handleRegisterBootcamp, isRegistered, location.pathname, location.search, navigate, registering]);

  useEffect(() => {
    const handleResize = () => {
      const width = window?.innerWidth || 0;
      setIsMobile(width < 960);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {!gateAccess && (
        <div className={`bootcamp-app ${collapsed ? 'bootcamp-collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
          <header className="bootcamp-topbar">
            <div className="bootcamp-topbar-content">
              <div className="bootcamp-topbar-left">
                <button
                  type="button"
                  className="bc-btn bc-btn-secondary"
                  onClick={() => navigate('/student-dashboard')}
                >
                  <FiArrowLeft size={14} />
                  Back to Dashboard
                </button>
              </div>
              <div className="bootcamp-topbar-right">
                <button
                  type="button"
                  className="bc-btn bc-btn-primary"
                  onClick={() => navigate('/student-bootcamps/live-class')}
                >
                  <FiVideo size={14} />
                  Live Class
                </button>
                <span className="bootcamp-topbar-status">
                  <FiCircle size={10} />
                  {user?.bootcampPaymentStatus === 'paid' ? 'Active' : 'Locked'}
                </span>
              </div>
            </div>
          </header>

          {!isMobile && (
            <aside className="bootcamp-sidebar">
              <BootcampSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
            </aside>
          )}

          <main className="bootcamp-main">
            <Outlet />
          </main>
        </div>
      )}
      {gateAccess && (
        <BootcampAccessPage
          title={accessCopy.title}
          description={accessCopy.description}
          primaryLabel={accessCopy.primaryLabel}
          onPrimary={accessCopy.onPrimary}
          primaryDisabled={accessCopy.primaryDisabled}
        />
      )}
    </>
  );
};

export default BootcampLayout;
