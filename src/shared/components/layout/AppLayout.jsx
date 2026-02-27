import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../../../styles/shared/components/layout/AppLayout.css';
import '../../../styles/shared/components/layout/PageLayout.css';

/**
 * App Layout
 * Wraps authenticated app pages (Dashboard, Audits, Pentest, etc.)
 * with consistent Navbar and main content area.
 */
const AppLayout = () => {
  return (
    <div className="app-layout page-container">
      <Navbar sticky={true} />
      <main className="app-main page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
