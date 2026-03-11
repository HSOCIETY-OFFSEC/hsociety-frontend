import React from 'react';
import useBootcampAccess from '../../hooks/useBootcampAccess';

const BootcampAccessGate = ({ children }) => {
  const { isRegistered, isPaid } = useBootcampAccess();

  if (!isRegistered || !isPaid) return null;

  return children;
};

export default BootcampAccessGate;
