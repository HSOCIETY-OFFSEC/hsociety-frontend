import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../../../styles/shared/layout.css';

/**
 * Auth Layout
 * Wraps login, register, and other auth pages.
 * Uses minimal Navbar (no user menu) with full-height content area.
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
