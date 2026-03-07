import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ScrollToTopButton from '../ui/ScrollToTopButton';
import useScrollReveal from '../../hooks/useScrollReveal';
import '../../../styles/shared/components/layout/PublicLayout.css';
import '../../../styles/shared/components/layout/PageLayout.css';

/**
 * Public Layout
 * For public pages like About, Team, Blog, etc.
 * Uses standard sticky Navbar and constrained content area.
 */
const PublicLayout = () => {
  useScrollReveal();

  return (
    <div className="public-layout page-container">
      <Navbar sticky={true} />
      <main className="public-main page-content container">
        <Outlet />
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default PublicLayout;
