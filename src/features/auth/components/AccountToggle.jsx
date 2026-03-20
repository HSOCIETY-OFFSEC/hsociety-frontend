import React from 'react';
import { AUTH_FORM_CONTENT } from '../../../data/static/auth/authContent';

const AccountToggle = ({ value, onChange, disabled = false }) => {
  const copy = AUTH_FORM_CONTENT.register;

  return (
    <div className="ap-toggle" role="group" aria-label={copy.accountType.label}>
      <button
        type="button"
        className={value === 'student' ? 'active' : ''}
        onClick={() => onChange('student')}
        disabled={disabled}
      >
        {copy.accountType.studentLabel}
      </button>
      <button
        type="button"
        className={value === 'corporate' ? 'active' : ''}
        onClick={() => onChange('corporate')}
        disabled={disabled}
      >
        {copy.accountType.corporateLabel}
      </button>
    </div>
  );
};

export default AccountToggle;
