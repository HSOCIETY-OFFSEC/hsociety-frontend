import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentAccessModal from './StudentAccessModal';
import '../../../styles/student/student.css';

const StudentRoleBlocker = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleExit = () => {
    setOpen(false);
    navigate('/student-dashboard', { replace: true });
  };

  return (
    <div className="student-page">
      {open && (
        <StudentAccessModal
          title="Access restricted"
          description="You are logged in as a student and cannot access this page or content."
          primaryLabel="Go to Overview"
          onPrimary={handleExit}
          onClose={handleExit}
        />
      )}
    </div>
  );
};

export default StudentRoleBlocker;
