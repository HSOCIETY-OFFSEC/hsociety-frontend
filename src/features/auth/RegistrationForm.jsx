import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import PasswordInput from '../../shared/components/ui/PasswordInput';
import PasswordStrengthIndicator from '../../shared/components/ui/PasswordStrengthIndicator';
import PublicError from '../../shared/components/ui/PublicError';
import { getPublicErrorMessage } from '../../shared/utils/publicError';
import { buildRegisterDTO, validateRegisterForm } from './register.contract';
import { registerUser } from './register.service';
import { login as loginRequest } from '../../core/auth/auth.service';
import { useAuth } from '../../core/auth/AuthContext';
import { useNotifications } from '../../shared/notifications/NotificationProvider';
import { trackEvent } from '../../shared/services/analytics.service';
import { AUTH_FORM_CONTENT } from '../../data/auth/authContent';
import '../../styles/core/auth.css';

const RegistrationForm = ({
  defaultAccountType = 'corporate',
  allowAccountTypeSwitch = true,
  note = '',
  onSuccessRedirect = null,
  onLoginRedirect = null,
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useNotifications();
  const copy = AUTH_FORM_CONTENT.register;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    accountType: defaultAccountType,
    name: '',
    email: '',
    companyOrSchool: '',
    password: '',
    confirmPassword: '',
    agree: false
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (error) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [error]);

  const resolveDashboardRoute = (role) => {
    if (role === 'student') return '/student-dashboard';
    return '/corporate-dashboard';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const isValid = validateRegisterForm(form);
    if (!isValid) {
      setError('Registration failed. Please check your details.');
      return;
    }

    setLoading(true);
    trackEvent('register_submit_start', { account_type: form.accountType });
    try {
      const payload = buildRegisterDTO(form);
      const response = await registerUser(payload);
      if (!response.success) {
        setError(getPublicErrorMessage({ action: 'submit', response }));
        return;
      }

      const successRoute =
        onSuccessRedirect && onSuccessRedirect !== '/login'
          ? onSuccessRedirect
          : resolveDashboardRoute(payload.role);

      if (response.isMock) {
        const mockUser = response.data || {
          id: `mock-${Date.now()}`,
          email: payload.credentials.email,
          role: payload.role,
          name: payload.profile?.fullName
        };
        await login(mockUser, 'mock-token');
        showToast({
          variant: 'success',
          title: 'Account created',
          message: 'Welcome to HSOCIETY. Your workspace is ready.',
          duration: 4200,
        });
        trackEvent('register_submit_success', { account_type: payload.role, source: 'mock' });
        navigate(successRoute);
        return;
      }

      if (response.data?.token) {
        const userData = response.data.user || {
          email: payload.credentials.email,
          role: payload.role,
          name: payload.profile?.fullName
        };
        await login(userData, response.data.token, response.data.refreshToken);
        showToast({
          variant: 'success',
          title: 'Account created',
          message: 'Welcome to HSOCIETY. Your workspace is ready.',
          duration: 4200,
        });
        trackEvent('register_submit_success', { account_type: payload.role, source: 'token' });
        navigate(successRoute);
        return;
      }

      const loginResponse = await loginRequest(payload.credentials.email, payload.credentials.password);

      if (loginResponse.success && !loginResponse.twoFactorRequired) {
        const role = loginResponse.user?.role || payload.role;
        await login(loginResponse.user, loginResponse.token, loginResponse.refreshToken);
        showToast({
          variant: 'success',
          title: 'Account created',
          message: 'Welcome to HSOCIETY. Your workspace is ready.',
          duration: 4200,
        });
        trackEvent('register_submit_success', { account_type: role, source: 'login' });
        navigate(resolveDashboardRoute(role));
        return;
      }

      showToast({
        variant: 'success',
        title: 'Account created',
        message: 'Your account is ready. Sign in to continue.',
        duration: 4200,
      });
      trackEvent('register_submit_success', { account_type: payload.role, source: 'redirect_login' });
      if (onLoginRedirect) {
        onLoginRedirect({
          email: payload.credentials.email,
          redirect: successRoute,
        });
        return;
      }
      navigate('/login', {
        state: {
          email: payload.credentials.email,
          redirect: successRoute,
        },
      });
    } catch (err) {
      console.error('Registration failed:', err);
      trackEvent('register_submit_failure', { account_type: form.accountType });
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card" padding="medium">
      <div className="auth-header">
        <h1>{copy.header.title}</h1>
        <p className="auth-subtitle">
          {allowAccountTypeSwitch
            ? copy.header.subtitle.defaultSwitch
            : defaultAccountType === 'student'
              ? copy.header.subtitle.student
              : copy.header.subtitle.corporate}
        </p>
      </div>

      <PublicError message={error} icon={<FiAlertTriangle size={16} />} />

      {note && <p className="auth-note">{note}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        {allowAccountTypeSwitch ? (
          <div className="form-group">
            <label>{copy.accountType.label}</label>
            <div className="auth-toggle">
              <button
                type="button"
                className={form.accountType === 'corporate' ? 'active' : ''}
                onClick={() => updateField('accountType', 'corporate')}
                disabled={loading}
              >
                {copy.accountType.corporate}
              </button>
              <button
                type="button"
                className={form.accountType === 'student' ? 'active' : ''}
                onClick={() => updateField('accountType', 'student')}
                disabled={loading}
              >
                {copy.accountType.student}
              </button>
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label>{copy.accountType.label}</label>
            <div className="auth-account-label">
              {defaultAccountType === 'student'
                ? copy.accountType.studentLabel
                : copy.accountType.corporateLabel}
            </div>
          </div>
        )}

        <div className="auth-form-row">
          <div className="form-group">
            <label htmlFor="register-name">{copy.fields.name.label}</label>
            <input
              id="register-name"
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder={copy.fields.name.placeholder}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-org">
              {form.accountType === 'student'
                ? copy.fields.org.studentLabel
                : copy.fields.org.corporateLabel}
            </label>
            <input
              id="register-org"
              type="text"
              className="form-input"
              value={form.companyOrSchool}
              onChange={(e) => updateField('companyOrSchool', e.target.value)}
              placeholder={
                form.accountType === 'student'
                  ? copy.fields.org.studentPlaceholder
                  : copy.fields.org.corporatePlaceholder
              }
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="register-email">{copy.fields.email.label}</label>
          <input
            id="register-email"
            type="email"
            className="form-input"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder={copy.fields.email.placeholder}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">{copy.fields.password.label}</label>
          <PasswordInput
            id="register-password"
            className="form-input"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            placeholder={copy.fields.password.placeholder}
            disabled={loading}
          />
          <PasswordStrengthIndicator password={form.password} />
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm-password">{copy.fields.confirmPassword.label}</label>
          <PasswordInput
            id="register-confirm-password"
            className="form-input"
            value={form.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            placeholder={copy.fields.confirmPassword.placeholder}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => updateField('agree', e.target.checked)}
              disabled={loading}
            />
            <span>
              {copy.fields.agree.prefix}{' '}
              <button
                type="button"
                className="auth-link-inline"
                onClick={() => navigate('/terms')}
              >
                {copy.fields.agree.link}
              </button>{' '}
              {copy.fields.agree.suffix}
            </span>
          </label>
        </div>

        <Button variant="primary" size="large" type="submit" loading={loading} fullWidth>
          {copy.button.create}
        </Button>
      </form>
    </Card>
  );
};

export default RegistrationForm;
