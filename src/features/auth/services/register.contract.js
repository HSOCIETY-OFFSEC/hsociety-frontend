/**
 * Register Contract
 * Location: src/features/auth/register.contract.js
 *
 * Canonical registration DTO for backend integration.
 */

import { validatePassword } from '../../../core/validation/input.validator';

const normalizeAccountType = (accountType) =>
  accountType === 'student' ? 'student' : 'corporate';

export const buildRegisterDTO = (form) => {
  const role = normalizeAccountType(form.accountType);

  return {
    role,
    profile: {
      fullName: form.name.trim(),
      organization: form.companyOrSchool.trim(),
      handle: (form.handle || '').trim()
    },
    credentials: {
      email: form.email.trim().toLowerCase(),
      password: form.password
    },
    consent: {
      acceptedTerms: Boolean(form.agree),
      acceptedAt: new Date().toISOString()
    },
    metadata: {
      source: 'web',
      version: '1'
    }
  };
};

export const validateRegisterForm = (form) => {
  if (!form.name || form.name.trim().length < 2) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email || '')) return false;

  if (!form.companyOrSchool || form.companyOrSchool.trim().length < 2) return false;

  if (form.handle) {
    const handleRegex = /^[a-z0-9._-]{3,30}$/i;
    if (!handleRegex.test(form.handle.trim())) return false;
  }

  // SECURITY UPDATE IMPLEMENTED: Strong password (8+ chars, upper, lower, number, special)
  const { isValid: isPasswordValid } = validatePassword(form.password);
  if (!isPasswordValid) return false;

  if (form.password !== form.confirmPassword) return false;

  if (!form.agree) return false;

  return true;
};

export default {
  buildRegisterDTO,
  validateRegisterForm
};
