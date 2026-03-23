import { useMemo } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';

const normalizeStatus = (status) => (status ? String(status).toLowerCase() : '');

export const useBootcampAccess = () => {
  const { user } = useAuth();

  return useMemo(() => {
    const bootcampStatus = normalizeStatus(user?.bootcampStatus);
    const paymentStatus = normalizeStatus(user?.bootcampPaymentStatus);
    const accessRevoked = user?.bootcampAccessRevoked === true;

    const isRegistered = Boolean(
      bootcampStatus === 'enrolled' ||
      bootcampStatus === 'active' ||
      bootcampStatus === 'completed'
    );

    const isPaid = paymentStatus === 'paid';

    const isAccessGranted = Boolean(
      bootcampStatus === 'active' ||
      bootcampStatus === 'completed'
    );

    return {
      isRegistered,
      isPaid,
      isAccessGranted,
      accessRevoked,
      hasAccess: isRegistered && isPaid && !accessRevoked
    };
  }, [
    user?.bootcampStatus,
    user?.bootcampAccessRevoked,
    user?.bootcampPaymentStatus
  ]);
};

export default useBootcampAccess;
