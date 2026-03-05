import React from 'react';
import Button from '../../../shared/components/ui/Button';
import '../../../styles/student/components.css';

const StudentAccessModal = ({
  title = 'Access Restricted',
  description = 'You are currently logged in as a student and cannot access this content.',
  primaryLabel = 'Go to Overview',
  onPrimary,
  onClose,
}) => {
  return (
    <div className="student-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="access-modal-title">
      <div className="student-modal-card access-modal-card">
        {/* Top accent bar */}
        <div className="access-modal-accent" aria-hidden="true" />

        <div className="student-modal-header">
          <div className="access-modal-title-group">
            <span className="access-modal-eyebrow">Restricted</span>
            <h3 id="access-modal-title">{title}</h3>
          </div>
          <button
            type="button"
            className="student-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
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