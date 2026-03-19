import { useMemo } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';

const normalizeStatus = (status) => (status ? String(status).toLowerCase() : '');

export const useBootcampAccess = () => {
  const { user } = useAuth();

  return useMemo(() => {
    const bootcampStatus = normalizeStatus(user?.bootcampStatus || user?.bootcamp?.status);
    const paymentStatus = normalizeStatus(user?.bootcampPaymentStatus || user?.paymentStatus);
    const accessOverride = user?.bootcampAccess;
    const accessRevoked = accessOverride === false;

    const isRegistered = Boolean(
      user?.bootcampRegistered ||
      bootcampStatus === 'enrolled' ||
      bootcampStatus === 'active' ||
      bootcampStatus === 'completed'
    );

    const isPaid = Boolean(
      user?.bootcampPaid ||
      accessOverride === true ||
      paymentStatus === 'paid'
    );

    const isAccessGranted = Boolean(
      accessOverride === true ||
      bootcampStatus === 'active' ||
      bootcampStatus === 'completed'
    );

    return {
      isRegistered,
      isPaid,
      isAccessGranted,
      hasAccess: !accessRevoked && (isAccessGranted || (isRegistered && isPaid))
    };
  }, [
    user?.bootcampStatus,
    user?.bootcamp?.status,
    user?.bootcampRegistered,
    user?.bootcampPaid,
    user?.bootcampAccess,
    user?.paymentStatus,
    user?.bootcampPaymentStatus,
    user?.paymentStatus
  ]);
};

export default useBootcampAccess;
