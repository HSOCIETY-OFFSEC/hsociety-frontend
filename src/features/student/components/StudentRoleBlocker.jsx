import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import '../styles/base.css';
import '../styles/components.css';

const StudentRoleBlocker = () => {
  const navigate = useNavigate();

  return (
    <div className="student-page">
      <div className="student-role-blocker">
        <h3>Access restricted</h3>
        <p>You are logged in as a student and cannot access this page or content.</p>
        <Button
          variant="primary"
          size="medium"
          onClick={() => navigate('/student-dashboard', { replace: true })}
        >
          Go to Overview
        </Button>
      </div>
    </div>
  );
};

export default StudentRoleBlocker;
