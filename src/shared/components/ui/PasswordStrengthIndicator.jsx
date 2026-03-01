/**
 * Shows password strength as user types (Weak / Fair / Good / Strong).
 * Uses the same rules as validatePassword (length, upper, lower, number, special).
 */
import React from 'react';
import { validatePassword } from '../../../core/validation/input.validator';
import './PasswordStrengthIndicator.css';

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

  return (
    <div className={`password-strength ${className}`} role="status" aria-live="polite">
      <div className="password-strength__bar">
        <div
          className={`password-strength__fill password-strength__fill--${level}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={`password-strength__label password-strength__label--${level}`}>
        {LABELS[level]}
      </span>
    </div>
  );
}
