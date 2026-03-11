import { useMemo } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';

const normalizeStatus = (status) => (status ? String(status).toLowerCase() : '');

export const useBootcampAccess = () => {
  const { user } = useAuth();

  return useMemo(() => {
    const bootcampStatus = normalizeStatus(user?.bootcampStatus || user?.bootcamp?.status);
    const paymentStatus = normalizeStatus(user?.bootcampPaymentStatus || user?.paymentStatus);

    const isRegistered = Boolean(
      user?.bootcampRegistered ||
      bootcampStatus === 'enrolled' ||
      bootcampStatus === 'active' ||
      bootcampStatus === 'completed'
    );

    const isPaid = Boolean(
      user?.bootcampPaid ||
      user?.bootcampAccess ||
      paymentStatus === 'paid'
    );

    const isAccessGranted = Boolean(
      user?.bootcampAccess ||
      bootcampStatus === 'active' ||
      bootcampStatus === 'completed'
    );

    return {
      isRegistered,
      isPaid,
      isAccessGranted,
      hasAccess: isAccessGranted || (isRegistered && isPaid)
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
