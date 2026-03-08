import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../../../styles/shared/components/layout/AuthLayout.css';
import '../../../styles/shared/components/layout/PageLayout.css';

/**
 * Auth Layout
 * Location: src/shared/components/layout/AuthLayout.jsx
 *
 * Wraps login, register, OTP, and password-reset pages.
 * - Sticky minimal Navbar (user menu not shown during auth flows).
 * - Full-height centred main with a subtle theme-aware radial glow.
 * - .page-container / .page-content from PageLayout.css provide the
 *   shared flex-column / min-height contract across all layouts.
 */
const AuthLayout = () => {
  return (
    <div className="auth-layout page-container">
      <Navbar sticky={true} />
      <main className="auth-main page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;