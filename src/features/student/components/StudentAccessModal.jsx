import React from 'react';
import Button from '../../../shared/components/ui/Button';
import '../../dashboards/student/styles/student.css';

const StudentAccessModal = ({
  title = 'Access Restricted',
  description = 'You are currently logged in as a student and cannot access this content.',
  primaryLabel = 'Go to Overview',
  onPrimary,
  onClose
}) => {
  return (
    <div className="student-modal-backdrop" role="dialog" aria-modal="true">
      <div className="student-modal-card">
        <div className="student-modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="student-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="student-modal-subtitle">{description}</p>
        <div className="student-modal-actions">
          <Button variant="ghost" size="small" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="small" onClick={onPrimary}>
            {primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentAccessModal;
