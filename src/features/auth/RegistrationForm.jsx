// DEPRECATED — superseded by AuthPortal.jsx. Safe to delete once routes confirmed.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../shared/notifications/NotificationProvider';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import AccountToggle from './components/AccountToggle';
import PasswordField from './components/PasswordField';
import { AUTH_FORM_CONTENT } from '../../data/auth/authContent';
import { buildRegisterDTO, validateRegisterForm } from './register.contract';
import { validatePassword } from '../../core/validation/input.validator';
import { registerUser } from './register.service';
import './auth.css';

/**
 * Registration Form
 *
 * Designed to be viewport-contained — no scrolling required on any screen size.
 */
const RegistrationForm = ({
  defaultAccountType = 'student',
  allowAccountTypeSwitch = true,
  note = null,
  prefillEmail = '',
  useCard = true,
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
    email: prefillEmail || '',
    handle: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nameRef = useRef(null);
  const orgRef = useRef(null);
  const emailRef = useRef(null);
  const handleRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

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
  const passwordValidation = useMemo(
    () => validatePassword(form.password),
    [form.password]
  );
  const passwordError = useMemo(() => {
    if (!form.password) return '';
    if (passwordValidation.isValid) return '';
    return passwordValidation.errors[0] || 'Password does not meet requirements.';
  }, [form.password, passwordValidation]);
  const confirmError = useMemo(() => {
    if (!form.confirmPassword) return '';
    if (!form.password) return '';
    if (form.password === form.confirmPassword) return '';
    return 'Passwords do not match.';
  }, [form.password, form.confirmPassword]);

  const handleChange = (field) => (event) => {
    const value =
      field === 'agree' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const normalizeHandleInput = (value = '') =>
    String(value)
      .trim()
      .replace(/^@/, '')
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '');

  const syncFormFromDom = useCallback(() => {
    setForm((prev) => {
      let changed = false;
      const next = { ...prev };

      if (nameRef.current && nameRef.current.value !== prev.name) {
        next.name = nameRef.current.value;
        changed = true;
      }
      if (orgRef.current && orgRef.current.value !== prev.companyOrSchool) {
        next.companyOrSchool = orgRef.current.value;
        changed = true;
      }
      if (emailRef.current && emailRef.current.value !== prev.email) {
        next.email = emailRef.current.value;
        changed = true;
      }
      if (handleRef.current && handleRef.current.value !== prev.handle) {
        next.handle = handleRef.current.value;
        changed = true;
      }
      if (passwordRef.current && passwordRef.current.value !== prev.password) {
        next.password = passwordRef.current.value;
        changed = true;
      }
      if (confirmRef.current && confirmRef.current.value !== prev.confirmPassword) {
        next.confirmPassword = confirmRef.current.value;
        changed = true;
      }

      return changed ? next : prev;
    });
  }, []);

  useEffect(() => {
    syncFormFromDom();
    const interval = window.setInterval(syncFormFromDom, 500);
    return () => window.clearInterval(interval);
  }, [syncFormFromDom]);

  useEffect(() => {
    if (!prefillEmail) return;
    setForm((prev) => (prev.email ? prev : { ...prev, email: prefillEmail }));
  }, [prefillEmail]);

  useEffect(() => {
    if (!form.name || form.handle) return;
    const suggested = normalizeHandleInput(form.name);
    if (!suggested) return;
    setForm((prev) => (prev.handle ? prev : { ...prev, handle: suggested }));
  }, [form.name, form.handle]);

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
        if (response.errorCode === 'USER_EXISTS') {
          setError('Account already exists. Log in instead.');
          if (onLoginRedirect) {
            onLoginRedirect({ email: form.email });
            return;
          }
        }
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

      navigate('/posts', { state: redirectPayload, search: '?auth=login' });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <>
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
        <AccountToggle
          value={accountType}
          onChange={setAccountType}
          disabled={loading}
        />
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
              name="name"
              value={form.name}
              onChange={handleChange('name')}
              onInput={handleChange('name')}
              placeholder={copy.fields.name.placeholder}
              required
              disabled={loading}
              className="form-input"
              autoComplete="name"
              ref={nameRef}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="handle">{copy.fields.handle.label}</label>
          <input
            type="text"
            id="handle"
            name="handle"
            value={form.handle}
            onChange={handleChange('handle')}
            onInput={handleChange('handle')}
            onBlur={(e) => {
              const normalized = normalizeHandleInput(e.target.value);
              if (normalized !== e.target.value) {
                setForm((prev) => ({ ...prev, handle: normalized }));
              }
            }}
            placeholder={copy.fields.handle.placeholder}
            disabled={loading}
            className="form-input"
            autoComplete="username"
            ref={handleRef}
          />
          <span className="form-hint">{copy.fields.handle.hint}</span>
        </div>

        <div className="form-group">
          <label htmlFor="org">{orgFieldLabel}</label>
          <input
            type="text"
            id="org"
            name="organization"
            value={form.companyOrSchool}
            onChange={handleChange('companyOrSchool')}
            onInput={handleChange('companyOrSchool')}
            placeholder={orgFieldPlaceholder}
            required
            disabled={loading}
            className="form-input"
            autoComplete="organization"
            ref={orgRef}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">{copy.fields.email.label}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange('email')}
            onInput={handleChange('email')}
            placeholder={copy.fields.email.placeholder}
            required
            disabled={loading}
            className="form-input"
            autoComplete="email"
            inputMode="email"
            ref={emailRef}
          />
        </div>

        <div className="auth-form-row">
          <div className="form-group">
            <label htmlFor="password">{copy.fields.password.label}</label>
            <PasswordField
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange('password')}
              onInput={handleChange('password')}
              placeholder={copy.fields.password.placeholder}
              required
              disabled={loading}
              className="form-input"
              autoComplete="new-password"
              ref={passwordRef}
            />
            {passwordError && (
              <span className="form-hint form-error" role="status">
                {passwordError}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">{copy.fields.confirmPassword.label}</label>
            <PasswordField
              id="confirm-password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onInput={handleChange('confirmPassword')}
              placeholder={copy.fields.confirmPassword.placeholder}
              required
              disabled={loading}
              className="form-input"
              autoComplete="new-password"
              ref={confirmRef}
            />
            {confirmError && (
              <span className="form-hint form-error" role="status">
                {confirmError}
              </span>
            )}
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

    </>
  );

  if (!useCard) {
    return <div className="auth-panel">{formContent}</div>;
  }

  return (
    <Card className="auth-card">
      {formContent}
    </Card>
  );
};

export default RegistrationForm;
