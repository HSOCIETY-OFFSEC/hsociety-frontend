import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../core/auth/AuthContext';
import { registerBootcamp } from '../../../dashboards/student/services/student.service';
import { getCurrentUser } from '../../../../core/auth/auth.service';
import BootcampAccessPage from '../../components/bootcamp/BootcampAccessPage';
import useBootcampAccess from '../../hooks/useBootcampAccess';
import { consumeBootcampRedirect, setBootcampRedirect } from '../../utils/bootcampRedirect';
import '../../styles/bootcamp/bootcamp-app.css';

const BootcampLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const { isRegistered, isPaid, accessRevoked } = useBootcampAccess();
  const [registering, setRegistering] = useState(false);
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

  return (
    <>
      {!gateAccess && (
        <div className="bootcamp-shell">
          <Outlet />
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
