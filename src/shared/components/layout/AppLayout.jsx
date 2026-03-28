import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

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
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden isolate">
      <Navbar sticky={true} />
      <main
        className="relative flex w-full flex-1 flex-col items-center justify-start overflow-y-auto overflow-x-hidden"
        style={{ minHeight: 'calc(100dvh - 4rem)' }}
      >
        <div className="pointer-events-none fixed inset-0 -z-10 bg-auth-glow" aria-hidden="true" />
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
