import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { registerBootcamp } from '../../dashboards/student/student.service';
import StudentAccessModal from '../components/StudentAccessModal';
import useBootcampAccess from '../hooks/useBootcampAccess';
import '../../../styles/student/bootcamp-app.css';

const BootcampLayout = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { isRegistered, isPaid } = useBootcampAccess();
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [accessModalCopy, setAccessModalCopy] = useState({
    title: 'Bootcamp access required',
    description: 'Please complete registration and payment to unlock the bootcamp dashboard.',
    primaryLabel: 'Go to Payments',
    onPrimary: () => navigate('/student-payments'),
  });
  const [registering, setRegistering] = useState(false);

  const gateAccess = Boolean(user) && (!isRegistered || !isPaid);

  useEffect(() => {
    if (!gateAccess) {
      setAccessModalOpen(false);
      return;
    }

    if (!isRegistered) {
      setAccessModalCopy({
        title: 'Bootcamp registration required',
        description: 'You have not registered for the bootcamp yet. Register now to begin the enrollment process.',
        primaryLabel: registering ? 'Registering…' : 'Register for Bootcamp',
        onPrimary: null,
      });
      setAccessModalOpen(true);
      return;
    }

    setAccessModalCopy({
      title: 'Bootcamp payment required',
      description: 'Have you completed payment for the bootcamp? Payment unlocks your dashboard access.',
      primaryLabel: 'Go to Payments',
      onPrimary: () => navigate('/student-payments'),
    });
    setAccessModalOpen(true);
  }, [gateAccess, isRegistered, isPaid, navigate, registering]);

  const handleRegisterBootcamp = useCallback(async () => {
    if (registering) return;
    setRegistering(true);
    const response = await registerBootcamp({
      experienceLevel: 'beginner',
      goal: 'Join Hacker Protocol',
      availability: '6-10',
    });

    if (response.success) {
      updateUser({
        bootcampRegistered: true,
        bootcampStatus: response.data?.bootcampStatus || 'enrolled',
        bootcampPaymentStatus: response.data?.bootcampPaymentStatus || 'unpaid',
      });
      navigate('/student-payments');
    }

    setRegistering(false);
  }, [navigate, registering, updateUser]);

  return (
    <>
      {!gateAccess && <Outlet />}
      {accessModalOpen && (
        <StudentAccessModal
          title={accessModalCopy.title}
          description={accessModalCopy.description}
          primaryLabel={accessModalCopy.primaryLabel}
          onPrimary={() => {
            if (!isRegistered) {
              handleRegisterBootcamp();
              return;
            }
            accessModalCopy.onPrimary?.();
          }}
          onClose={() => {
            setAccessModalOpen(false);
            navigate('/student-dashboard');
          }}
        />
      )}
    </>
  );
};

export default BootcampLayout;
