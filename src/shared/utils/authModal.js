export const AUTH_QUERY_KEY = 'auth';

export const AUTH_MODAL_MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
  CORPORATE_REGISTER: 'register-corporate',
  PENTESTER_LOGIN: 'pentester-login',
};

export const buildAuthModalUrl = (mode = AUTH_MODAL_MODES.LOGIN, options = {}) => {
  const params = new URLSearchParams();
  params.set(AUTH_QUERY_KEY, mode);
  if (options.reason) params.set('reason', options.reason);
  if (options.redirect) params.set('redirect', options.redirect);
  return `/?${params.toString()}`;
};
