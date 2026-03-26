/**
 * AuthPortal.jsx — GitHub-style split auth layout
 *
 * Left panel  : Full-bleed hero image with overlay text + stats
 * Right panel : Login / Register forms (tabbed, GitHub aesthetic)
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { login as loginRequest } from '../../../core/auth/auth.service';
import { registerUser } from '../services/register.service';
import { buildRegisterDTO, validateRegisterForm } from '../services/register.contract';
import { validatePassword } from '../../../core/validation/input.validator';
import { useNotifications } from '../../../shared/components/providers/NotificationProvider';
import { envConfig } from '../../../config/app/env.config';
import { getWhatsAppLink } from '../../../config/app/social.config';
import brandLogoBlack from '../../../assets/branding/brand-images/brand-image-LOGO-black.png';
import '../styles/auth-portal.css';

const requireEmailVerification = envConfig.auth.requireEmailVerification;

/* ─── tiny icon helpers ───────────────────────────────────── */
const IconLock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconEye = ({ off }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {off
      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    }
  </svg>
);
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IMAGE_URL = brandLogoBlack;

/* ══════════════════════════════════════════════════════════
   LEFT PANEL
   ══════════════════════════════════════════════════════════ */
const LeftPanel = () => (
  <aside className="ap-left" aria-hidden="true">
    <div className="ap-left-img" style={{ backgroundImage: `url(${IMAGE_URL})` }} />
    <div className="ap-left-overlay" />
    <div className="ap-left-content">
      <p className="ap-eyebrow">HSOCIETY ACCESS</p>
      <h2 className="ap-hero-title">Build your security edge before the next breach.</h2>
      <p className="ap-hero-lead">
        Choose the path that matches your mission. We tailor onboarding for
        students who want hands-on training and teams that need real-world defence.
      </p>
      <div className="ap-stats">
        <div className="ap-stat">
          <strong>Real-world labs</strong>
          <span>Operator-led training with live tooling.</span>
        </div>
        <div className="ap-stat-divider" />
        <div className="ap-stat">
          <strong>Team defence</strong>
          <span>Corporate workflows built for rapid hardening.</span>
        </div>
      </div>
      <div className="ap-trust">
        <span className="ap-trust-badge"><IconShield /> Security-first platform</span>
        <span className="ap-trust-badge"><IconShield /> JWT + refresh sessions</span>
        <span className="ap-trust-badge"><IconShield /> Rate-limited auth</span>
      </div>
    </div>
  </aside>
);

/* ══════════════════════════════════════════════════════════
   PASSWORD INPUT
   ══════════════════════════════════════════════════════════ */
const PasswordInput = React.forwardRef(({ id, name, value, onChange, onInput, placeholder, disabled, autoComplete }, ref) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onInput={onInput}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className="ap-input"
        style={{ paddingRight: '2.75rem' }}
        ref={ref}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="ap-eye-btn"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        <IconEye off={show} />
      </button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';

/* ══════════════════════════════════════════════════════════
   ERROR BANNER
   ══════════════════════════════════════════════════════════ */
const ErrorBanner = ({ message }) => (
  <div className="ap-error" role="alert">
    <span className="ap-error-icon"><IconAlert /></span>
    {message}
  </div>
);

/* ══════════════════════════════════════════════════════════
   LOGIN FORM
   ══════════════════════════════════════════════════════════ */
const LoginForm = ({ onSwitchToRegister, prefillEmail = '', roleGuard = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useNotifications();

  const [email, setEmail]       = useState(prefillEmail || location.state?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const emailRef    = useRef(null);
  const passwordRef = useRef(null);

  // Sync browser autofill into React state
  useEffect(() => {
    const sync = () => {
      if (emailRef.current?.value && emailRef.current.value !== email) setEmail(emailRef.current.value);
      if (passwordRef.current?.value && passwordRef.current.value !== password) setPassword(passwordRef.current.value);
    };
    sync();
    const id = window.setInterval(sync, 500);
    const onAnim = (e) => { if (e.animationName === 'hsociety-autofill-detect') sync(); };
    document.addEventListener('animationstart', onAnim, true);
    return () => { window.clearInterval(id); document.removeEventListener('animationstart', onAnim, true); };
  }, []);

  const resolveRoute = (role) => {
    if (role === 'admin') return '/mr-robot';
    if (role === 'pentester') return '/pentester';
    if (role === 'student') return '/student-dashboard';
    return '/corporate-dashboard';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginRequest(email, password);
      if (!response.success) {
        if (requireEmailVerification && response.verificationRequired) {
          navigate('/verify-email', { replace: true, state: { email } });
          return;
        }
        setError(response.message || 'Login failed. Please try again.');
        return;
      }
      if (response.mustChangePassword && response.passwordChangeToken) {
        navigate('/change-password', {
          replace: true,
          state: { passwordChangeToken: response.passwordChangeToken, user: response.user },
        });
        return;
      }
      if (roleGuard && response.user?.role !== roleGuard) {
        setError('Login failed. Please try again.');
        return;
      }
      await login(response.user, response.token, response.refreshToken, response.expiresIn);
      showToast({ variant: 'success', title: 'Login successful', message: 'Welcome back. Your workspace is ready.', duration: 3600 });
      const redirect = location.state?.redirect;
      const needsOnboarding =
        response.user?.role === 'student' && !response.user?.onboardingCompletedAt;
      if (needsOnboarding) {
        navigate('/student-onboarding', { replace: true });
        return;
      }
      navigate(redirect && redirect.startsWith('/') ? redirect : resolveRoute(response.user?.role), { replace: true });
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ap-form-header">
        <h1 className="ap-form-title">Sign in to HSociety</h1>
        <p className="ap-form-subtitle">Use your credentials to access your workspace.</p>
      </div>

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleLogin} className="ap-form" noValidate>
        <div className="ap-field">
          <label htmlFor="login-email">Email address</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
            disabled={loading}
            className="ap-input"
            autoComplete="username"
            inputMode="email"
            ref={emailRef}
          />
        </div>

        <div className="ap-field">
          <div className="ap-label-row">
            <label htmlFor="login-password">Password</label>
            <button type="button" className="ap-link-muted" onClick={() => navigate('/forgot-password')} tabIndex={-1}>
              Forgot password?
            </button>
          </div>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            disabled={loading}
            autoComplete="current-password"
            ref={passwordRef}
          />
        </div>

        <button type="submit" className="ap-btn-primary" disabled={loading || !email || !password}>
          {loading ? <span className="ap-spinner" /> : null}
          {loading ? 'Signing in…' : 'Sign in'}
          {!loading && <IconArrow />}
        </button>
      </form>

      <div className="ap-divider"><span>New here?</span></div>

      <div className="ap-footer-actions">
        <button type="button" className="ap-btn-ghost" onClick={() => onSwitchToRegister('student')}>
          Create student account
        </button>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════
   REGISTER FORM
   ══════════════════════════════════════════════════════════ */
const RegisterForm = ({ defaultType = 'student', onSwitchToLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useNotifications();

  const prefillEmail = useMemo(() => {
    const q = new URLSearchParams(location.search);
    return q.get('email') || '';
  }, [location.search]);

  const [accountType, setAccountType] = useState(defaultType === 'corporate' ? 'corporate' : 'student');
  const [form, setForm] = useState({
    name: '', companyOrSchool: '', handle: '', email: prefillEmail,
    password: '', confirmPassword: '', inviteCode: '', agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const nameRef     = useRef(null);
  const orgRef      = useRef(null);
  const handleRef   = useRef(null);
  const emailRef    = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef  = useRef(null);

  const syncFromDom = useCallback(() => {
    setForm(prev => {
      let changed = false;
      const next = { ...prev };
      const check = (ref, key) => {
        if (ref.current && ref.current.value !== prev[key]) { next[key] = ref.current.value; changed = true; }
      };
      check(nameRef, 'name');
      check(orgRef, 'companyOrSchool');
      check(handleRef, 'handle');
      check(emailRef, 'email');
      check(passwordRef, 'password');
      check(confirmRef, 'confirmPassword');
      return changed ? next : prev;
    });
  }, []);

  useEffect(() => {
    syncFromDom();
    const id = window.setInterval(syncFromDom, 500);
    const onAnim = (e) => { if (e.animationName === 'hsociety-autofill-detect') syncFromDom(); };
    document.addEventListener('animationstart', onAnim, true);
    return () => { window.clearInterval(id); document.removeEventListener('animationstart', onAnim, true); };
  }, [syncFromDom]);

  // Auto-suggest handle from name (only if ≥ 3 chars to pass validation)
  useEffect(() => {
    if (!form.name || form.handle) return;
    const suggested = form.name.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    if (suggested.length >= 3) setForm(prev => prev.handle ? prev : { ...prev, handle: suggested });
  }, [form.name, form.handle]);

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (k === 'agree') {
      setForm(prev => {
        const synced = { ...prev };
        if (nameRef.current?.value) synced.name = nameRef.current.value;
        if (orgRef.current?.value) synced.companyOrSchool = orgRef.current.value;
        if (handleRef.current?.value) synced.handle = handleRef.current.value;
        if (emailRef.current?.value) synced.email = emailRef.current.value;
        if (passwordRef.current?.value) synced.password = passwordRef.current.value;
        if (confirmRef.current?.value) synced.confirmPassword = confirmRef.current.value;
        return { ...synced, agree: value };
      });
      return;
    }
    setForm(prev => ({ ...prev, [k]: value }));
  };

  const isValid = useMemo(() => validateRegisterForm({ ...form, accountType }), [form, accountType]);

  const passwordValidation = useMemo(() => validatePassword(form.password), [form.password]);
  const passwordError = useMemo(() => {
    if (!form.password || passwordValidation.isValid) return '';
    return passwordValidation.errors?.[0] || 'Password does not meet requirements.';
  }, [form.password, passwordValidation]);
  const confirmError = useMemo(() => {
    if (!form.confirmPassword || !form.password || form.password === form.confirmPassword) return '';
    return 'Passwords do not match.';
  }, [form.password, form.confirmPassword]);

  const normalizeHandle = (value = '') =>
    String(value)
      .trim()
      .replace(/^@/, '')
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '');

  const getValidationError = (snapshot) => {
    if (!snapshot.name || snapshot.name.trim().length < 2) return 'Full name is required (min 2 characters).';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(snapshot.email || '')) return 'Enter a valid email address.';
    if (!snapshot.companyOrSchool || snapshot.companyOrSchool.trim().length < 2) return 'Organisation/School is required.';
    if (accountType === 'corporate' && (!snapshot.inviteCode || snapshot.inviteCode.trim().length < 4)) {
      return 'Invite code is required for corporate accounts.';
    }
    if (snapshot.handle) {
      const handleRegex = /^[a-z0-9._-]{3,30}$/i;
      if (!handleRegex.test(snapshot.handle.trim())) return 'Handle must be 3–30 characters (letters, numbers, dot, dash, underscore).';
    }
    const { isValid: pwValid, errors } = validatePassword(snapshot.password);
    if (!pwValid) return errors?.[0] || 'Password does not meet requirements.';
    if (snapshot.password !== snapshot.confirmPassword) return 'Passwords do not match.';
    if (!snapshot.agree) return 'Please accept the Terms of Service.';
    return '';
  };

  const getFormSnapshot = (formEl) => {
    if (formEl) {
      const data = new FormData(formEl);
      const next = {
        ...form,
        name: String(data.get('name') || ''),
        companyOrSchool: String(data.get('companyOrSchool') || ''),
        handle: normalizeHandle(data.get('handle') || ''),
        email: String(data.get('email') || '').trim(),
        password: String(data.get('password') || ''),
        confirmPassword: String(data.get('confirmPassword') || ''),
        inviteCode: String(data.get('inviteCode') || ''),
        agree: data.has('agree'),
      };
      if (next.password && !next.confirmPassword) next.confirmPassword = next.password;
      return next;
    }

    const fallback = {
      ...form,
      name: nameRef.current?.value ?? form.name,
      companyOrSchool: orgRef.current?.value ?? form.companyOrSchool,
      handle: normalizeHandle(handleRef.current?.value ?? form.handle),
      email: String(emailRef.current?.value ?? form.email).trim(),
      password: passwordRef.current?.value ?? form.password,
      confirmPassword: confirmRef.current?.value ?? form.confirmPassword,
      inviteCode: form.inviteCode,
    };
    if (fallback.password && !fallback.confirmPassword) fallback.confirmPassword = fallback.password;
    return fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const snapshot = getFormSnapshot(e.currentTarget);
    setForm(snapshot);
    if (!validateRegisterForm({ ...snapshot, accountType })) {
      setError(getValidationError(snapshot) || 'Please complete all required fields correctly.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = buildRegisterDTO({ ...snapshot, accountType });
      const response = await registerUser(payload);
      if (!response.success) {
        if (response.errorCode === 'USER_EXISTS') {
          setError('Account already exists. Sign in instead.');
          return;
        }
        setError(response.error || 'Registration failed. Please try again.');
        return;
      }
      if (requireEmailVerification && response.data?.verificationRequired) {
        showToast({ variant: 'info', title: 'Verify your email', message: 'We sent a verification link to your email.', duration: 4800 });
        navigate('/verify-email', { replace: true, state: { email: snapshot.email } });
        return;
      }
      const whatsappUrl = getWhatsAppLink();
      if (!requireEmailVerification && whatsappUrl) {
        window.location.href = whatsappUrl;
        return;
      }
      showToast({ variant: 'success', title: 'Account created', message: 'Your account is ready. Please sign in.', duration: 3600 });
      onSwitchToLogin();
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const orgLabel = accountType === 'corporate' ? 'Organisation' : 'School / University';
  const orgPlaceholder = accountType === 'corporate' ? 'Acme Corp' : 'MIT, Stanford…';

  return (
    <>
      <div className="ap-form-header">
        <h1 className="ap-form-title">Create your account</h1>
        <p className="ap-form-subtitle">Join HSociety and start your security mission.</p>
      </div>

      <div className="ap-toggle" role="group" aria-label="Account type">
        <button
          type="button"
          className={accountType === 'student' ? 'active' : ''}
          onClick={() => setAccountType('student')}
        >
          Student
        </button>
        <button
          type="button"
          className={accountType === 'corporate' ? 'active' : ''}
          onClick={() => setAccountType('corporate')}
        >
          Corporate
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit} className="ap-form" noValidate>
        <div className="ap-form-row">
          <div className="ap-field">
            <label htmlFor="reg-name">Full name</label>
            <input type="text" id="reg-name" name="name" value={form.name} onChange={set('name')} onInput={set('name')}
              placeholder="Ada Lovelace" required disabled={loading} className="ap-input" autoComplete="name" ref={nameRef} />
          </div>
          <div className="ap-field">
            <label htmlFor="reg-handle">Handle</label>
            <input type="text" id="reg-handle" name="handle" value={form.handle} onChange={set('handle')} onInput={set('handle')}
              placeholder="ada_lovelace" disabled={loading} className="ap-input" autoComplete="username" ref={handleRef} />
          </div>
        </div>

        <div className="ap-field">
          <label htmlFor="reg-org">{orgLabel}</label>
          <input type="text" id="reg-org" name="companyOrSchool" value={form.companyOrSchool} onChange={set('companyOrSchool')} onInput={set('companyOrSchool')}
            placeholder={orgPlaceholder} required disabled={loading} className="ap-input" autoComplete="organization" ref={orgRef} />
        </div>

        {accountType === 'corporate' && (
          <div className="ap-field">
            <label htmlFor="reg-invite">Invite code</label>
            <input
              type="text"
              id="reg-invite"
              name="inviteCode"
              value={form.inviteCode}
              onChange={set('inviteCode')}
              onInput={set('inviteCode')}
              placeholder="Provided by HSOCIETY"
              required
              disabled={loading}
              className="ap-input"
            />
          </div>
        )}

        <div className="ap-field">
          <label htmlFor="reg-email">Email address</label>
          <input type="email" id="reg-email" name="email" value={form.email} onChange={set('email')} onInput={set('email')}
            placeholder="you@example.com" required disabled={loading} className="ap-input" autoComplete="email" inputMode="email" ref={emailRef} />
        </div>

        <div className="ap-form-row">
          <div className="ap-field">
            <label htmlFor="reg-pw">Password</label>
            <PasswordInput id="reg-pw" name="password" value={form.password} onChange={set('password')} onInput={set('password')}
              placeholder="Min 8 characters" disabled={loading} autoComplete="new-password" ref={passwordRef} />
            {passwordError && <span className="ap-hint" role="status">{passwordError}</span>}
          </div>
          <div className="ap-field">
            <label htmlFor="reg-cpw">Confirm password</label>
            <PasswordInput id="reg-cpw" name="confirmPassword" value={form.confirmPassword} onChange={set('confirmPassword')} onInput={set('confirmPassword')}
              placeholder="Repeat password" disabled={loading} autoComplete="new-password" ref={confirmRef} />
            {confirmError && <span className="ap-hint" role="status">{confirmError}</span>}
          </div>
        </div>

        <label className="ap-checkbox">
          <input type="checkbox" name="agree" checked={form.agree} onChange={set('agree')} disabled={loading} />
          <span>
            I agree to the{' '}
            <button type="button" className="ap-link-inline" onClick={() => navigate('/terms')} disabled={loading}>Terms of Service</button>
            .
          </span>
        </label>

        <button type="submit" className="ap-btn-primary" disabled={loading || !form.agree}>
          {loading ? <span className="ap-spinner" /> : null}
          {loading ? 'Creating account…' : `Create ${accountType === 'corporate' ? 'organisation' : 'student'} account`}
          {!loading && <IconArrow />}
        </button>
      </form>

      <div className="ap-divider"><span>Already have an account?</span></div>

      <button type="button" className="ap-btn-ghost" onClick={onSwitchToLogin} disabled={loading}>
        Sign in instead
      </button>
    </>
  );
};

/* ══════════════════════════════════════════════════════════
   AUTH PORTAL — root component
   ══════════════════════════════════════════════════════════ */
const AuthPortal = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const authParam = query.get('auth');

  const initialView = (authParam === 'register' || authParam === 'register-corporate') ? 'register' : 'login';
  const initialType = authParam === 'register-corporate' ? 'corporate' : 'student';

  const [view, setView]       = useState(initialView);
  const [regType, setRegType] = useState(initialType);

  const goRegister = (type = 'student') => { setRegType(type); setView('register'); };
  const goLogin    = ()                 => setView('login');

  return (
    <div className="ap-root">
      <LeftPanel />
      <section className="ap-right">
        <div className="ap-right-inner">
          {view === 'login'
            ? (
              <LoginForm
                onSwitchToRegister={goRegister}
                roleGuard={authParam === 'pentester-login' ? 'pentester' : null}
              />
            )
            : <RegisterForm defaultType={regType} onSwitchToLogin={goLogin} />
          }
          <div className="ap-notice">
            <IconLock />
            <span>Secured by 256-bit encryption. We never store plain-text passwords.</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthPortal;
