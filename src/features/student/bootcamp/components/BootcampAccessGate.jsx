import React from 'react';
import useBootcampAccess from '../../hooks/useBootcampAccess';

const BootcampAccessGate = ({ children }) => {
  const { hasAccess } = useBootcampAccess();

  if (!hasAccess) return null;

  return children;
};

export default BootcampAccessGate;
