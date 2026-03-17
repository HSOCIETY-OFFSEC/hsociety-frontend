import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiBriefcase, FiBookOpen } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Login from './Login';
import RegistrationForm from './RegistrationForm';
import { AUTH_FORM_CONTENT } from '../../data/auth/authContent';
import { AUTH_MODAL_MODES, AUTH_QUERY_KEY } from '../../shared/utils/authModal';
import '../../styles/core/auth.css';
import '../../styles/core/auth-portal.css';

const AUTH_PORTAL_ROUTE = '/posts';

const normalizeMode = (value) => {
  const allowed = new Set(Object.values(AUTH_MODAL_MODES));
  return allowed.has(value) ? value : AUTH_MODAL_MODES.REGISTER;
};

const AuthPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const modeParam = normalizeMode(params.get(AUTH_QUERY_KEY));
  const emailParam = params.get('email') || location.state?.email || '';
  const redirectParam = params.get('redirect') || '';
  const reasonParam = params.get('reason') || '';
  const copy = AUTH_FORM_CONTENT.register;

  const [mode, setMode] = useState(modeParam);
  const [accountType, setAccountType] = useState(null);
  const [prefillEmail, setPrefillEmail] = useState(emailParam);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    setMode(modeParam);
    setPrefillEmail(emailParam || '');
    if (modeParam === AUTH_MODAL_MODES.CORPORATE_REGISTER) {
      setAccountType('corporate');
      return;
    }
    if (modeParam === AUTH_MODAL_MODES.REGISTER) {
      setAccountType(null);
      return;
    }
    if (modeParam === AUTH_MODAL_MODES.LOGIN || modeParam === AUTH_MODAL_MODES.PENTESTER_LOGIN) {
      setAccountType(null);
    }
  }, [modeParam, emailParam]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const handleChange = () => setIsCompact(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isLogin = mode === AUTH_MODAL_MODES.LOGIN || mode === AUTH_MODAL_MODES.PENTESTER_LOGIN;

  const updateMode = (nextMode, options = {}) => {
    const nextEmail = typeof options.email === 'string' ? options.email : prefillEmail;
    const nextRedirect = typeof options.redirect === 'string' ? options.redirect : redirectParam;
    const nextParams = new URLSearchParams();
    if (nextMode) nextParams.set(AUTH_QUERY_KEY, nextMode);
    if (nextEmail) nextParams.set('email', nextEmail);
    if (nextRedirect) nextParams.set('redirect', nextRedirect);
    if (reasonParam) nextParams.set('reason', reasonParam);
    navigate(
      {
        pathname: AUTH_PORTAL_ROUTE,
        search: nextParams.toString() ? `?${nextParams.toString()}` : '',
      },
      {
        replace: false,
        state: { ...location.state, email: nextEmail },
      }
    );
  };

  const accountCopy = useMemo(() => {
    if (accountType === 'corporate') return copy.accountType.corporateLabel;
    if (accountType === 'student') return copy.accountType.studentLabel;
    return '';
  }, [accountType, copy.accountType]);

  return (
    <div className="auth-portal">
      <aside className="auth-portal-marketing" aria-hidden="true">
        <div className="auth-portal-marketing-inner">
          <p className="auth-portal-eyebrow">HSOCIETY ACCESS</p>
          <h2>Build your security edge before the next breach.</h2>
          <p className="auth-portal-lead">
            Choose the path that matches your mission. We tailor onboarding for students
            who want hands-on training and teams that need real-world defense.
          </p>
          <div className="auth-portal-stats">
            <div>
              <strong>Real-world labs</strong>
              <span>Operator-led training with live tooling.</span>
            </div>
            <div>
              <strong>Team defense</strong>
              <span>Corporate workflows built for rapid hardening.</span>
            </div>
          </div>
        </div>
      </aside>

      <section className="auth-portal-panel">
        <div className="auth-portal-panel-inner">
          {isLogin ? (
            <Login
              layout="modal"
              prefillEmail={prefillEmail}
              mode={mode === AUTH_MODAL_MODES.PENTESTER_LOGIN ? 'pentester' : 'default'}
              redirect={redirectParam || null}
              onRequestModeChange={() => updateMode(AUTH_MODAL_MODES.REGISTER)}
            />
          ) : (
            <>
              {isCompact && (
                <>
                  <RegistrationForm
                    defaultAccountType={mode === AUTH_MODAL_MODES.CORPORATE_REGISTER ? 'corporate' : 'student'}
                    allowAccountTypeSwitch={true}
                    note={mode === AUTH_MODAL_MODES.CORPORATE_REGISTER ? copy.note.corporate : null}
                    prefillEmail={prefillEmail}
                    onLoginRedirect={(payload) =>
                      updateMode(AUTH_MODAL_MODES.LOGIN, {
                        email: payload?.email || prefillEmail,
                        redirect: payload?.redirect || redirectParam,
                      })
                    }
                    onSuccessRedirect={redirectParam || null}
                  />
                  <div className="auth-portal-inline">
                    <span>Already have an account?</span>
                    <button
                      type="button"
                      className="auth-portal-link"
                      onClick={() => updateMode(AUTH_MODAL_MODES.LOGIN)}
                    >
                      Sign in
                    </button>
                  </div>
                </>
              )}

              {!isCompact && !accountType && (
                <Card className="auth-portal-card">
                  <div className="auth-portal-questionnaire">
                    <p className="auth-portal-title">First, tell us who you are.</p>
                    <p className="auth-portal-subtitle">
                      We will customize your onboarding and the right registration form.
                    </p>
                    <div className="auth-portal-choice-grid">
                      <button
                        type="button"
                        className="auth-portal-choice"
                        onClick={() => setAccountType('student')}
                      >
                        <div className="auth-portal-choice-icon">
                          <FiBookOpen size={18} />
                        </div>
                        <div>
                          <strong>I am a student</strong>
                          <span>Train for offensive security with guided labs.</span>
                        </div>
                        <FiArrowRight size={16} className="auth-portal-choice-arrow" />
                      </button>
                      <button
                        type="button"
                        className="auth-portal-choice"
                        onClick={() => setAccountType('corporate')}
                      >
                        <div className="auth-portal-choice-icon">
                          <FiBriefcase size={18} />
                        </div>
                        <div>
                          <strong>We are a company</strong>
                          <span>Secure systems with verified, supervised hackers.</span>
                        </div>
                        <FiArrowRight size={16} className="auth-portal-choice-arrow" />
                      </button>
                    </div>
                    <div className="auth-portal-inline">
                      <span>Already have an account?</span>
                      <button
                        type="button"
                        className="auth-portal-link"
                        onClick={() => updateMode(AUTH_MODAL_MODES.LOGIN)}
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </Card>
              )}

              {!isCompact && accountType && (
                <>
                  <RegistrationForm
                    defaultAccountType={accountType}
                    allowAccountTypeSwitch={false}
                    note={accountType === 'corporate' ? copy.note.corporate : null}
                    prefillEmail={prefillEmail}
                    onLoginRedirect={(payload) =>
                      updateMode(AUTH_MODAL_MODES.LOGIN, {
                        email: payload?.email || prefillEmail,
                        redirect: payload?.redirect || redirectParam,
                      })
                    }
                    onSuccessRedirect={redirectParam || null}
                  />
                  <div className="auth-portal-footer">
                    <span>Registering as</span>
                    <strong>{accountCopy}</strong>
                    <button
                      type="button"
                      className="auth-portal-link"
                      onClick={() => setAccountType(null)}
                    >
                      Change
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AuthPortal;
