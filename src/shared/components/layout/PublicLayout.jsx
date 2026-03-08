import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingUtilityToolbar from '../ui/FloatingUtilityToolbar';
import useScrollReveal from '../../hooks/useScrollReveal';
import '../../../styles/shared/components/layout/PublicLayout.css';
import '../../../styles/shared/components/layout/PageLayout.css';

/**
 * Public Layout
 * Location: src/shared/components/layout/PublicLayout.jsx
 *
 * For public informational pages — About, Team, Blog, Careers, etc.
 * - Sticky Navbar.
 * - Content constrained via .container (layout.css) for comfortable reading.
 * - Scroll-reveal hook re-runs on every route change, scoped to .public-layout.
 * - FloatingUtilityToolbar renders outside <main> so it overlays page content.
 */
const PublicLayout = () => {
  const location = useLocation();
  useScrollReveal('.reveal-on-scroll', {}, [location.pathname], '.public-layout');

  return (
    <div className="public-layout page-container">
      <Navbar sticky={true} />
      <main className="public-main page-content container">
        <Outlet />
      </main>
      <FloatingUtilityToolbar />
    </div>
  );
};

export default PublicLayout;