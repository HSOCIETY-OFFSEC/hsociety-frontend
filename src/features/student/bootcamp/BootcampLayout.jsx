import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import BootcampSidebar from './BootcampSidebar';
import { HACKER_PROTOCOL_BOOTCAMP } from '../../../data/bootcamps/hackerProtocolData';
import '../../../styles/student/bootcamp-app.css';

const BootcampLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanel, setRightPanel] = useState(null);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('bootcamp-lock-scroll', sidebarOpen);
    return () => document.body.classList.remove('bootcamp-lock-scroll');
  }, [sidebarOpen]);

  const title = useMemo(() => HACKER_PROTOCOL_BOOTCAMP.title, []);

  return (
    <div className={`bootcamp-app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <header className="bootcamp-topbar">
        <div className="bootcamp-topbar-left">
          <button
            type="button"
            className="bootcamp-menu-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
          <div className="bootcamp-title">
            <span className="bootcamp-title-label">Bootcamp</span>
            <strong>{title}</strong>
          </div>
        </div>
        <div className="bootcamp-topbar-right">
          <div className="bootcamp-user-chip">
            <span>{user?.name || user?.email || 'Student'}</span>
          </div>
          <button
            type="button"
            className="bootcamp-back-btn"
            onClick={() => navigate('/student-dashboard')}
          >
            <FiArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <aside className="bootcamp-sidebar">
        <BootcampSidebar />
      </aside>

      <main className="bootcamp-main">
        <Outlet context={{ setRightPanel }} />
      </main>

      <aside className={`bootcamp-right ${rightPanel ? 'active' : ''}`}>
        {rightPanel}
      </aside>

      <footer className="bootcamp-footer">
        <span>HSOCIETY Bootcamp Learning</span>
        <span>Live classes + guided progression</span>
      </footer>

      <div
        className={`bootcamp-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
    </div>
  );
};

export default BootcampLayout;
