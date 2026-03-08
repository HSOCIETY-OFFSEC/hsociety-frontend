import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingUtilityToolbar from '../ui/FloatingUtilityToolbar';
import useScrollReveal from '../../hooks/useScrollReveal';
import '../../../styles/shared/components/layout/PublicLayout.css';
import '../../../styles/shared/components/layout/PageLayout.css';

/**
 * Public Layout
 * For public pages like About, Team, Blog, etc.
 * Uses standard sticky Navbar and constrained content area.
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
