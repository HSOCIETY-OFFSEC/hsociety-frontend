import React, { useMemo, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../shared/notifications/NotificationProvider';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import PasswordInput from '../../shared/components/ui/PasswordInput';
import { AUTH_FORM_CONTENT } from '../../data/auth/authContent';
import { buildRegisterDTO, validateRegisterForm } from './register.contract';
import { registerUser } from './register.service';
import '../../styles/core/auth.css';

/**
 * Registration Form
 *
 * Designed to be viewport-contained — no scrolling required on any screen size.
 */
const RegistrationForm = ({
  defaultAccountType = 'student',
  allowAccountTypeSwitch = true,
  note = null,
  onSuccessRedirect = null,
  onLoginRedirect = null,
}) => {
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const copy = AUTH_FORM_CONTENT.register;

  const [accountType, setAccountType] = useState(
    defaultAccountType === 'corporate' ? 'corporate' : 'student'
  );
  const [form, setForm] = useState({
    name: '',
    companyOrSchool: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const headerSubtitle = useMemo(() => {
    if (accountType === 'corporate') return copy.header.subtitle.corporate;
    if (accountType === 'student') return copy.header.subtitle.student;
    return copy.header.subtitle.defaultSwitch;
  }, [accountType, copy.header.subtitle]);

  const orgFieldLabel =
    accountType === 'corporate'
      ? copy.fields.org.corporateLabel
      : copy.fields.org.studentLabel;
  const orgFieldPlaceholder =
    accountType === 'corporate'
      ? copy.fields.org.corporatePlaceholder
      : copy.fields.org.studentPlaceholder;

  const isValid = useMemo(
    () => validateRegisterForm({ ...form, accountType }),
    [form, accountType]
  );

  const handleChange = (field) => (event) => {
    const value =
      field === 'agree' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isValid) {
      setError('Please complete all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      const payload = buildRegisterDTO({ ...form, accountType });
      const response = await registerUser(payload);

      if (!response.success) {
        setError(response.error || 'Registration failed. Please try again.');
        return;
      }

      showToast({
        variant: 'success',
        title: 'Registration complete',
        message: 'Your account was created. Please log in to continue.',
        duration: 3600,
      });

      const redirectPayload = { email: form.email };
      if (onSuccessRedirect) redirectPayload.redirect = onSuccessRedirect;

      if (onLoginRedirect) {
        onLoginRedirect(redirectPayload);
        return;
      }

      if (onSuccessRedirect) {
        navigate(onSuccessRedirect, { state: redirectPayload });
        return;
      }

      navigate('/login', { state: redirectPayload });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card">
      <div className="auth-header">
        <h1>{copy.header.title}</h1>
        <p className="auth-subtitle">{headerSubtitle}</p>
      </div>

      {note && (
        <div className="auth-note">
          <p>{note}</p>
        </div>
      )}

      {allowAccountTypeSwitch ? (
        <div className="auth-toggle" role="group" aria-label={copy.accountType.label}>
          <button
            type="button"
            className={accountType === 'student' ? 'active' : ''}
            onClick={() => setAccountType('student')}
            disabled={loading}
          >
            {copy.accountType.studentLabel}
          </button>
          <button
            type="button"
            className={accountType === 'corporate' ? 'active' : ''}
            onClick={() => setAccountType('corporate')}
            disabled={loading}
          >
            {copy.accountType.corporateLabel}
          </button>
        </div>
      ) : (
        <div className="auth-account-label">
          {accountType === 'corporate'
            ? copy.accountType.corporateLabel
            : copy.accountType.studentLabel}
        </div>
      )}

      {error && (
        <div className="auth-error" role="alert">
          <span className="error-icon"><FiAlertTriangle size={15} /></span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-form-row">
          <div className="form-group">
            <label htmlFor="full-name">{copy.fields.name.label}</label>
            <input
              type="text"
              id="full-name"
              value={form.name}
              onChange={handleChange('name')}
              placeholder={copy.fields.name.placeholder}
              required
              disabled={loading}
              className="form-input"
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="org">{orgFieldLabel}</label>
            <input
              type="text"
              id="org"
              value={form.companyOrSchool}
              onChange={handleChange('companyOrSchool')}
              placeholder={orgFieldPlaceholder}
              required
              disabled={loading}
              className="form-input"
              autoComplete="organization"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">{copy.fields.email.label}</label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder={copy.fields.email.placeholder}
            required
            disabled={loading}
            className="form-input"
            autoComplete="email"
            inputMode="email"
          />
        </div>

        <div className="auth-form-row">
          <div className="form-group">
            <label htmlFor="password">{copy.fields.password.label}</label>
            <PasswordInput
              id="password"
              value={form.password}
              onChange={handleChange('password')}
              placeholder={copy.fields.password.placeholder}
              required
              disabled={loading}
              className="form-input"
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">{copy.fields.confirmPassword.label}</label>
            <PasswordInput
              id="confirm-password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder={copy.fields.confirmPassword.placeholder}
              required
              disabled={loading}
              className="form-input"
              autoComplete="new-password"
            />
          </div>
        </div>

        <label className="auth-checkbox">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={handleChange('agree')}
            disabled={loading}
            aria-label={copy.fields.agree.link}
          />
          <span>
            {copy.fields.agree.prefix}{' '}
            <button
              type="button"
              className="auth-link-inline"
              onClick={() => navigate('/terms')}
              disabled={loading}
            >
              {copy.fields.agree.link}
            </button>{' '}
            {copy.fields.agree.suffix}
          </span>
        </label>

        <div className="auth-mobile-actions">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading || !isValid}
          >
            {copy.button.create}
          </Button>
        </div>
      </form>

    </Card>
  );
};

export default RegistrationForm;
