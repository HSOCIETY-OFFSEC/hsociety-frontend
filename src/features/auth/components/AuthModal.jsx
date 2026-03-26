import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import { AUTH_MODAL_MODES } from '../../../shared/utils/auth/authModal';
import '../styles/auth.css';

const AuthModal = () => {
  const { mode, payload, redirect, closeAuthModal, openAuthModal } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mode) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeAuthModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, closeAuthModal]);

  useEffect(() => {
    if (mode === AUTH_MODAL_MODES.CORPORATE_REGISTER) {
      closeAuthModal({ replace: true });
      navigate('/contact', { replace: true });
    }
  }, [mode, closeAuthModal, navigate]);

  if (!mode || mode === AUTH_MODAL_MODES.CORPORATE_REGISTER) return null;

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
      aria-label="Account access"
      onClick={() => closeAuthModal()}
    >
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
    </div>
  );
};

export default AuthModal;
