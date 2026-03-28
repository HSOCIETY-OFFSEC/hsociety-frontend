/**
 * Shows password strength as user types (Weak / Fair / Good / Strong).
 * Uses the same rules as validatePassword (length, upper, lower, number, special).
 */
import React from 'react';
import { validatePassword } from '../../../core/validation/input.validator';

const LABELS = {
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
};

function getLevel(strength) {
  if (strength >= 100) return 'strong';
  if (strength >= 60) return 'good';
  if (strength >= 40) return 'fair';
  return 'weak';
}

export default function PasswordStrengthIndicator({ password = '', className = '' }) {
  if (!password) {
    return null;
  }
  const { strength } = validatePassword(password);
  const level = getLevel(strength);
  const width = Math.min(100, strength);
  const fillColor = {
    weak: 'bg-status-danger',
    fair: 'bg-status-warning',
    good: 'bg-status-success',
    strong: 'bg-status-success',
  }[level];
  const labelColor = {
    weak: 'text-status-danger',
    fair: 'text-status-warning',
    good: 'text-status-success',
    strong: 'text-status-success',
  }[level];

  return (
    <div className={`mt-1.5 flex items-center gap-3 ${className}`} role="status" aria-live="polite">
      <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-border">
        <div
          className={`h-full rounded-sm transition-all duration-200 ${fillColor}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={`min-w-[3.5rem] text-xs font-semibold uppercase tracking-[0.05em] ${labelColor}`}>
        {LABELS[level]}
      </span>
    </div>
  );
}
