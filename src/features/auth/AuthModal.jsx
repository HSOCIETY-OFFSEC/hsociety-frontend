import React, { useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import CorporateRegister from './CorporateRegister';
import useAuthModal from '../../shared/hooks/useAuthModal';
import { AUTH_MODAL_MODES } from '../../shared/utils/authModal';
import '../../styles/core/auth.css';

const AuthModal = () => {
  const { mode, payload, redirect, closeAuthModal, openAuthModal } = useAuthModal();

  useEffect(() => {
    if (!mode) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeAuthModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, closeAuthModal]);

  if (!mode) return null;

  const handleSwitchMode = (nextMode, options = {}) => {
    openAuthModal(nextMode, { replace: true, ...options });
  };

  const sharedProps = {
    layout: 'modal',
    onRequestModeChange: handleSwitchMode,
  };

  return (
    <div
      className="auth-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={() => closeAuthModal()}
    >
      <div
        className="auth-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="auth-modal-header">
          <span id="auth-modal-title" className="auth-modal-title">
            Account Access
          </span>
          <button
            type="button"
            className="auth-modal-close"
            onClick={() => closeAuthModal()}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className="auth-modal-body">
          {mode === AUTH_MODAL_MODES.LOGIN && (
            <Login
              {...sharedProps}
              mode="default"
              prefillEmail={payload?.email}
              redirect={redirect || payload?.redirect}
            />
          )}
          {mode === AUTH_MODAL_MODES.PENTESTER_LOGIN && (
            <Login
              {...sharedProps}
              mode="pentester"
              prefillEmail={payload?.email}
              redirect={redirect || payload?.redirect}
            />
          )}
          {mode === AUTH_MODAL_MODES.REGISTER && (
            <Register
              {...sharedProps}
              onLoginRedirect={(data) =>
                handleSwitchMode(AUTH_MODAL_MODES.LOGIN, { payload: data })
              }
            />
          )}
          {mode === AUTH_MODAL_MODES.CORPORATE_REGISTER && (
            <CorporateRegister
              {...sharedProps}
              onLoginRedirect={(data) =>
                handleSwitchMode(AUTH_MODAL_MODES.LOGIN, { payload: data })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
