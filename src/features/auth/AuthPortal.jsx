import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';
import RegistrationForm from './RegistrationForm';
import AuthLeftPanel from './components/AuthLeftPanel';
import { AUTH_FORM_CONTENT } from '../../data/auth/authContent';
import { AUTH_MODAL_MODES, AUTH_QUERY_KEY } from '../../shared/utils/auth/authModal';
import '../../styles/features/auth/auth.css';
import '../../styles/features/auth/auth-portal.css';

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
  const accountParam = params.get('account');
  const redirectParam = params.get('redirect') || '';
  const reasonParam = params.get('reason') || '';
  const copy = AUTH_FORM_CONTENT.register;

  const [mode, setMode] = useState(modeParam);
  const [prefillEmail, setPrefillEmail] = useState(emailParam);

  useEffect(() => {
    setMode(modeParam);
    setPrefillEmail(emailParam || '');
  }, [modeParam, emailParam]);

  const isLogin = mode === AUTH_MODAL_MODES.LOGIN || mode === AUTH_MODAL_MODES.PENTESTER_LOGIN;
  const defaultAccountType =
    accountParam === 'corporate' || modeParam === AUTH_MODAL_MODES.CORPORATE_REGISTER
      ? 'corporate'
      : 'student';

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

  return (
    <div className="auth-portal">
      <AuthLeftPanel />

      <section className="auth-portal-panel">
        <div className="auth-portal-panel-inner">
          {isLogin ? (
            <Login
              layout="modal"
              prefillEmail={prefillEmail}
              mode={mode === AUTH_MODAL_MODES.PENTESTER_LOGIN ? 'pentester' : 'default'}
              redirect={redirectParam || null}
              useCard={false}
              onRequestModeChange={() => updateMode(AUTH_MODAL_MODES.REGISTER)}
            />
          ) : (
            <>
              <RegistrationForm
                defaultAccountType={defaultAccountType}
                allowAccountTypeSwitch={true}
                note={defaultAccountType === 'corporate' ? copy.note.corporate : null}
                prefillEmail={prefillEmail}
                useCard={false}
                onLoginRedirect={(payload) =>
                  updateMode(AUTH_MODAL_MODES.LOGIN, {
                    email: payload?.email || prefillEmail,
                    redirect: payload?.redirect || redirectParam,
                  })
                }
                onSuccessRedirect={redirectParam || null}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AuthPortal;
