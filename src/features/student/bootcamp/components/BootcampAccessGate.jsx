import React from 'react';
import Card from '../../../../shared/components/ui/Card';
import useBootcampAccess from '../../hooks/useBootcampAccess';

const BootcampAccessGate = ({ children }) => {
  const { isAccessGranted } = useBootcampAccess();

  if (!isAccessGranted) {
    return (
      <Card padding="large" className="bootcamp-access-card">
        <h2>Access restricted</h2>
        <p>Bootcamp access has not been granted yet. Please contact an administrator.</p>
      </Card>
    );
  }

  return children;
};

export default BootcampAccessGate;
