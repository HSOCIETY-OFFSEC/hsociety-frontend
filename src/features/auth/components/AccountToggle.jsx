import React from 'react';
import { AUTH_FORM_CONTENT } from '../../../data/static/auth/authContent';

const AccountToggle = ({ value, onChange, disabled = false }) => {
  const copy = AUTH_FORM_CONTENT.register;

  return (
    <div
      className="grid grid-cols-2 overflow-hidden rounded-xs border border-border bg-bg-tertiary"
      role="group"
      aria-label={copy.accountType.label}
    >
      <button
        type="button"
        className={`border-r border-border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          value === 'student'
            ? 'bg-bg-secondary text-text-primary'
            : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
        }`}
        onClick={() => onChange('student')}
        disabled={disabled}
      >
        {copy.accountType.studentLabel}
      </button>
      <button
        type="button"
        className={`px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          value === 'corporate'
            ? 'bg-bg-secondary text-text-primary'
            : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
        }`}
        onClick={() => onChange('corporate')}
        disabled={disabled}
      >
        {copy.accountType.corporateLabel}
      </button>
    </div>
  );
};

export default AccountToggle;
