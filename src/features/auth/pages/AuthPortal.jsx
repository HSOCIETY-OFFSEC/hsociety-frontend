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
import Button from '../../../shared/components/ui/Button';
import SharedPasswordInput from '../../../shared/components/ui/PasswordInput';
import brandLogoBlack from '../../../assets/branding/brand-images/brand-image-LOGO-black.png';
import {
  authCheckbox,
  authDivider,
  authDividerText,
  authError,
  authErrorIcon,
  authField,
  authForm,
  authFormHeader,
  authFormRow,
  authFormSubtitle,
  authFormTitle,
  authHint,
  authInput,
  authLabel,
  authLinkInline,
  authLinkMuted,
  authNotice,
} from '../styles/authClasses';

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
  <aside className="group relative hidden min-h-screen overflow-hidden lg:block" aria-hidden="true">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75 saturate-75 transition-transform duration-[8000ms] ease-linear group-hover:scale-[1.02]"
      style={{ backgroundImage: `url(${IMAGE_URL})` }}
    />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.55),rgba(0,0,0,0.28)),linear-gradient(to_top,rgba(0,0,0,0.7),rgba(31,191,143,0.08),transparent)]" />
    <div className="relative z-10 flex h-full flex-col justify-end gap-5 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--bg-secondary)_85%,transparent),transparent_70%)] p-8 text-white">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand">HSOCIETY ACCESS</p>
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-white">Build your security edge before the next breach.</h2>
      <p className="text-sm leading-relaxed text-white/70">
        Choose the path that matches your mission. We tailor onboarding for
        students who want hands-on training and teams that need real-world defence.
      </p>
      <div className="flex items-start gap-6">
        <div className="flex flex-col gap-1">
          <strong className="text-sm font-semibold text-white">Real-world labs</strong>
          <span className="text-xs text-white/60">Operator-led training with live tooling.</span>
        </div>
        <div className="h-auto w-px self-stretch bg-white/20" />
        <div className="flex flex-col gap-1">
          <strong className="text-sm font-semibold text-white">Team defence</strong>
          <span className="text-xs text-white/60">Corporate workflows built for rapid hardening.</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 max-sm:hidden">
        <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--primary-color)_40%,transparent)] bg-[rgb(var(--brand-rgb)/0.12)] px-2.5 py-1 text-xs font-semibold text-brand backdrop-blur">
          <IconShield /> Security-first platform
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--primary-color)_40%,transparent)] bg-[rgb(var(--brand-rgb)/0.12)] px-2.5 py-1 text-xs font-semibold text-brand backdrop-blur">
          <IconShield /> JWT + refresh sessions
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--primary-color)_40%,transparent)] bg-[rgb(var(--brand-rgb)/0.12)] px-2.5 py-1 text-xs font-semibold text-brand backdrop-blur">
          <IconShield /> Rate-limited auth
        </span>
      </div>
    </div>
  </aside>
);

/* ══════════════════════════════════════════════════════════
   ERROR BANNER
   ══════════════════════════════════════════════════════════ */
const ErrorBanner = ({ message }) => (
  <div className={authError} role="alert">
    <span className={authErrorIcon}><IconAlert /></span>
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
      <div className={authFormHeader}>
        <h1 className={authFormTitle}>Sign in to HSociety</h1>
        <p className={authFormSubtitle}>Use your credentials to access your workspace.</p>
      </div>

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleLogin} className={authForm} noValidate>
        <div className={authField}>
          <label htmlFor="login-email" className={authLabel}>Email address</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
            disabled={loading}
            className={authInput}
            autoComplete="username"
            inputMode="email"
            ref={emailRef}
          />
        </div>

        <div className={authField}>
          <div className="flex items-baseline justify-between">
            <label htmlFor="login-password" className={authLabel}>Password</label>
            <button type="button" className={authLinkMuted} onClick={() => navigate('/forgot-password')} tabIndex={-1}>
              Forgot password?
            </button>
          </div>
          <SharedPasswordInput
            id="login-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            disabled={loading}
            autoComplete="current-password"
            className={authInput}
            ref={passwordRef}
          />
        </div>

        <Button type="submit" variant="primary" size="medium" fullWidth loading={loading} disabled={loading || !email || !password}>
          {loading ? 'Signing in…' : 'Sign in'}
          {!loading && <IconArrow />}
        </Button>
      </form>

      <div className={authDivider}><span className={authDividerText}>New here?</span></div>

      <div className="flex flex-col gap-2">
        <Button type="button" variant="ghost" size="medium" fullWidth onClick={() => onSwitchToRegister('student')}>
          Create student account
        </Button>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════
   REGISTER FORM
   ══════════════════════════════════════════════════════════ */
const RegisterForm = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useNotifications();

  const prefillEmail = useMemo(() => {
    const q = new URLSearchParams(location.search);
    return q.get('email') || '';
  }, [location.search]);

  const [accountType] = useState('student');
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
      <div className={authFormHeader}>
        <h1 className={authFormTitle}>Create your account</h1>
        <p className={authFormSubtitle}>Join HSociety and start your security mission.</p>
      </div>

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit} className={authForm} noValidate>
        <div className={authFormRow}>
          <div className={authField}>
            <label htmlFor="reg-name" className={authLabel}>Full name</label>
            <input type="text" id="reg-name" name="name" value={form.name} onChange={set('name')} onInput={set('name')}
              placeholder="Ada Lovelace" required disabled={loading} className={authInput} autoComplete="name" ref={nameRef} />
          </div>
          <div className={authField}>
            <label htmlFor="reg-handle" className={authLabel}>Handle</label>
            <input type="text" id="reg-handle" name="handle" value={form.handle} onChange={set('handle')} onInput={set('handle')}
              placeholder="ada_lovelace" disabled={loading} className={authInput} autoComplete="username" ref={handleRef} />
          </div>
        </div>

        <div className={authField}>
          <label htmlFor="reg-org" className={authLabel}>{orgLabel}</label>
          <input type="text" id="reg-org" name="companyOrSchool" value={form.companyOrSchool} onChange={set('companyOrSchool')} onInput={set('companyOrSchool')}
            placeholder={orgPlaceholder} required disabled={loading} className={authInput} autoComplete="organization" ref={orgRef} />
        </div>

        {accountType === 'corporate' && (
          <div className={authField}>
            <label htmlFor="reg-invite" className={authLabel}>Invite code</label>
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
              className={authInput}
            />
          </div>
        )}

        <div className={authField}>
          <label htmlFor="reg-email" className={authLabel}>Email address</label>
          <input type="email" id="reg-email" name="email" value={form.email} onChange={set('email')} onInput={set('email')}
            placeholder="you@example.com" required disabled={loading} className={authInput} autoComplete="email" inputMode="email" ref={emailRef} />
        </div>

        <div className={authFormRow}>
          <div className={authField}>
            <label htmlFor="reg-pw" className={authLabel}>Password</label>
            <SharedPasswordInput id="reg-pw" name="password" value={form.password} onChange={set('password')} onInput={set('password')}
              placeholder="Min 8 characters" disabled={loading} autoComplete="new-password" className={authInput} ref={passwordRef} />
            {passwordError && <span className={authHint} role="status">{passwordError}</span>}
          </div>
          <div className={authField}>
            <label htmlFor="reg-cpw" className={authLabel}>Confirm password</label>
            <SharedPasswordInput id="reg-cpw" name="confirmPassword" value={form.confirmPassword} onChange={set('confirmPassword')} onInput={set('confirmPassword')}
              placeholder="Repeat password" disabled={loading} autoComplete="new-password" className={authInput} ref={confirmRef} />
            {confirmError && <span className={authHint} role="status">{confirmError}</span>}
          </div>
        </div>

        <label className={authCheckbox}>
          <input type="checkbox" name="agree" checked={form.agree} onChange={set('agree')} disabled={loading} />
          <span>
            I agree to the{' '}
            <button type="button" className={authLinkInline} onClick={() => navigate('/terms')} disabled={loading}>Terms of Service</button>
            .
          </span>
        </label>

        <Button type="submit" variant="primary" size="medium" fullWidth loading={loading} disabled={loading || !form.agree}>
          {loading ? 'Creating account…' : `Create ${accountType === 'corporate' ? 'organisation' : 'student'} account`}
          {!loading && <IconArrow />}
        </Button>
      </form>

      <div className={authDivider}><span className={authDividerText}>Already have an account?</span></div>

      <Button type="button" variant="ghost" size="medium" fullWidth onClick={onSwitchToLogin} disabled={loading}>
        Sign in instead
      </Button>
    </>
  );
};

/* ══════════════════════════════════════════════════════════
   AUTH PORTAL — root component
   ══════════════════════════════════════════════════════════ */
const AuthPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const authParam = query.get('auth');

  const initialView = authParam === 'register' ? 'register' : 'login';

  const [view, setView]       = useState(initialView);

  useEffect(() => {
    if (authParam === 'register-corporate') {
      navigate('/contact', { replace: true });
    }
  }, [authParam, navigate]);

  const goRegister = () => { setView('register'); };
  const goLogin    = ()                 => setView('login');

  return (
    <div className="min-h-screen w-full bg-bg-primary pt-[var(--navbar-height,64px)] lg:grid lg:grid-cols-[1fr_minmax(360px,480px)]">
      <LeftPanel />
      <section className="flex min-h-screen items-center justify-center overflow-y-auto bg-bg-secondary px-6 py-8 pt-12 lg:border-l lg:border-border lg:pt-14">
        <div className="flex w-full max-w-[400px] flex-col gap-4">
          {view === 'login'
            ? (
              <LoginForm
                onSwitchToRegister={goRegister}
                roleGuard={authParam === 'pentester-login' ? 'pentester' : null}
              />
            )
            : <RegisterForm onSwitchToLogin={goLogin} />
          }
          <div className={authNotice}>
            <IconLock />
            <span>Secured by 256-bit encryption. We never store plain-text passwords.</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthPortal;
