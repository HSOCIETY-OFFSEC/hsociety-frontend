import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingUtilityToolbar from '../ui/FloatingUtilityToolbar';
import useScrollReveal from '../../hooks/useScrollReveal';
import '../../../styles/shared/components/layout/LandingLayout.css';

/**
 * Landing Layout
 * Full-width layout for marketing/landing pages.
 * Navbar is non-sticky for hero sections that extend to top.
 */
const LandingLayout = () => {
  const location = useLocation();
  useScrollReveal('.reveal-on-scroll', {}, [location.pathname], '.landing-layout');

  return (
    <div className="landing-layout">
      <Navbar sticky={true} />
      <main className="landing-main">
        <Outlet />
      </main>
      <FloatingUtilityToolbar />
    </div>
  );
};

export default LandingLayout;
