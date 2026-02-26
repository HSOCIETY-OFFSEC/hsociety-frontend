import { useMemo } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';

const normalizeStatus = (status) => (status ? String(status).toLowerCase() : '');

export const useBootcampAccess = () => {
  const { user } = useAuth();

  return useMemo(() => {
    const bootcampStatus = normalizeStatus(user?.bootcampStatus || user?.bootcamp?.status);

    const isRegistered = Boolean(
      user?.bootcampRegistered ||
      bootcampStatus === 'enrolled' ||
      bootcampStatus === 'active' ||
      bootcampStatus === 'completed'
    );

    const isPaid = Boolean(
      user?.bootcampPaid ||
      user?.bootcampAccess ||
      user?.paymentStatus === 'paid' ||
      user?.bootcampPaymentStatus === 'paid'
    );

    return {
      isRegistered,
      isPaid,
      hasAccess: isRegistered && isPaid
    };
  }, [
    user?.bootcampStatus,
    user?.bootcamp?.status,
    user?.bootcampRegistered,
    user?.bootcampPaid,
    user?.bootcampAccess,
    user?.paymentStatus,
    user?.bootcampPaymentStatus
  ]);
};

export default useBootcampAccess;
