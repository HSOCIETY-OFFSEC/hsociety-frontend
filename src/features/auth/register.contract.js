/**
 * Register Contract
 * Location: src/features/auth/register.contract.js
 *
 * Canonical registration DTO for backend integration.
 */

const normalizeAccountType = (accountType) =>
  accountType === 'student' ? 'student' : 'corporate';

export const buildRegisterDTO = (form) => {
  const role = normalizeAccountType(form.accountType);

  return {
    role,
    profile: {
      fullName: form.name.trim(),
      organization: form.companyOrSchool.trim()
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
  if (!form.name || form.name.trim().length < 2) {
    return 'Please enter your full name';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email || '')) {
    return 'Please enter a valid email address';
  }

  if (!form.companyOrSchool || form.companyOrSchool.trim().length < 2) {
    return form.accountType === 'student'
      ? 'Please enter your school'
      : 'Please enter your company';
  }

  // SECURITY UPDATE IMPLEMENTED: Strong password (8+ chars, upper, lower, number, special)
  if (!form.password) return 'Password is required';
  if (form.password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(form.password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(form.password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(form.password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password)) {
    return 'Password must contain at least one special character';
  }

  if (form.password !== form.confirmPassword) {
    return 'Passwords do not match';
  }

  if (!form.agree) {
    return 'You must accept the terms to continue';
  }

  return '';
};

export default {
  buildRegisterDTO,
  validateRegisterForm
};
