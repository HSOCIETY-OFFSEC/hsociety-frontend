import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';
import '../../../styles/shared/layout.css';

/**
 * Workspace Layout
 * App-like shell for dashboards and learning flows.
 */
const WorkspaceLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`workspace-layout app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar />

      <button
        type="button"
        className="workspace-fab"
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
      >
        {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
      </button>

      <div
        className={`workspace-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <main className="workspace-main">
        <Outlet />
      </main>
    </div>
  );
};

export default WorkspaceLayout;
