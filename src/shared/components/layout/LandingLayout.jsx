import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../../../styles/shared/components/layout/LandingLayout.css';

/**
 * Landing Layout
 * Full-width layout for marketing/landing pages.
 * Navbar is non-sticky for hero sections that extend to top.
 */
const LandingLayout = () => {
  return (
    <div className="landing-layout">
      <Navbar sticky={true} />
      <main className="landing-main">
        <Outlet />
      </main>
    </div>
  );
};

export default LandingLayout;
