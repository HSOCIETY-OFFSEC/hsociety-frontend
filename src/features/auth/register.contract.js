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
  if (!form.name || form.name.trim().length < 2) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email || '')) return false;

  if (!form.companyOrSchool || form.companyOrSchool.trim().length < 2) return false;

  // SECURITY UPDATE IMPLEMENTED: Strong password (8+ chars, upper, lower, number, special)
  if (!form.password) return false;
  if (form.password.length < 8) return false;
  if (!/[A-Z]/.test(form.password)) return false;
  if (!/[a-z]/.test(form.password)) return false;
  if (!/[0-9]/.test(form.password)) return false;
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password)) return false;

  if (form.password !== form.confirmPassword) return false;

  if (!form.agree) return false;

  return true;
};

export default {
  buildRegisterDTO,
  validateRegisterForm
};
