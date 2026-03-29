import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';

const StudentRoleBlocker = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] py-[clamp(1.5rem,3vw,2.5rem)] text-text-primary">
      <div className="mx-auto flex min-h-[360px] max-w-[560px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card p-8 text-center text-text-tertiary">
        <h3 className="text-sm font-semibold text-text-secondary">Access restricted</h3>
        <p className="text-sm leading-relaxed text-text-tertiary">
          You are logged in as a student and cannot access this page or content.
        </p>
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
