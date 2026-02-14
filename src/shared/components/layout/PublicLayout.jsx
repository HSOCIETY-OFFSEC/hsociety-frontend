import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../../../styles/shared/layout.css';

/**
 * Public Layout
 * For public pages like About, Team, Blog, etc.
 * Uses standard sticky Navbar and constrained content area.
 */
const PublicLayout = () => {
  return (
    <div className="public-layout page-container">
      <Navbar sticky={true} />
      <main className="public-main page-content container">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
