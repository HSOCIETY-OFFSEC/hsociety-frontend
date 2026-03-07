import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ScrollToTopButton from '../ui/ScrollToTopButton';
import useScrollReveal from '../../hooks/useScrollReveal';
import '../../../styles/shared/components/layout/LandingLayout.css';

/**
 * Landing Layout
 * Full-width layout for marketing/landing pages.
 * Navbar is non-sticky for hero sections that extend to top.
 */
const LandingLayout = () => {
  useScrollReveal();

  return (
    <div className="landing-layout">
      <Navbar sticky={true} />
      <main className="landing-main">
        <Outlet />
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default LandingLayout;
