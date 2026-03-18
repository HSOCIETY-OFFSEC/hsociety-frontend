import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ScrollToTopButton from '../ui/ScrollToTopButton';
import useScrollReveal from '../../hooks/useScrollReveal';
import './PublicLayout.css';
import './PageLayout.css';

/**
 * Public Layout
 * Location: src/shared/components/layout/PublicLayout.jsx
 *
 * For public informational pages — About, Team, Blog, Careers, etc.
 * - Sticky Navbar.
 * - Content uses each page shell for width/padding (no global container constraint).
 * - Scroll-reveal hook re-runs on every route change, scoped to .public-layout.
 * - ScrollToTopButton renders outside <main> so it overlays page content.
 */
const PublicLayout = () => {
  const location = useLocation();
  useScrollReveal('.reveal-on-scroll', {}, [location.pathname], '.public-layout');

  return (
    <div className="public-layout page-container">
      <Navbar sticky={true} />
      <main className="public-main page-content">
        <Outlet />
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default PublicLayout;
