import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { getSidebarLinks } from '../../../config/navigation.config';
import { FiChevronDown, FiLayers } from 'react-icons/fi';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import '../../../styles/shared/components/layout/Sidebar.css';

/**
 * Sidebar Component (large screens only via CSS)
 * Location: src/shared/components/layout/Sidebar.jsx
 */
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const role = user?.role === 'client' ? 'corporate' : user?.role;
  const path = location.pathname || '';
  const routeRole = path.startsWith('/student')
    ? 'student'
    : path.startsWith('/mr-robot')
    ? 'admin'
    : path.startsWith('/pentester')
    ? 'pentester'
    : path.startsWith('/corporate-dashboard') ||
      path.startsWith('/engagements') ||
      path.startsWith('/reports') ||
      path.startsWith('/remediation') ||
      path.startsWith('/assets') ||
      path.startsWith('/billing')
    ? 'corporate'
    : null;
  const resolvedRole = routeRole || role || 'student';
  const links = getSidebarLinks(true, resolvedRole);
  const isActive = (path) => location.pathname === path;
  const [learnOpen, setLearnOpen] = useState(false);

  const bootcampLinks = useMemo(
    () => links.filter((link) => link.group === 'learn'),
    [links]
  );

  const defaultLinks = useMemo(
    () => links.filter((link) => link.group !== 'learn'),
    [links]
  );

  const renderLink = (link) => (
    <button
      key={link.path}
      type="button"
      className={`app-sidebar-link ${isActive(link.path) ? 'active' : ''}`}
      onClick={() => navigate(link.path)}
    >
      <span style={{ display: 'inline-flex' }}>
        <link.icon size={18} />
      </span>
      <span>{link.label}</span>
    </button>
  );

  return (
    <aside className="app-sidebar" aria-label="Sidebar navigation">
      <div className="app-sidebar-inner">
        <button
          type="button"
          className="app-sidebar-logo"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          <Logo size="small" />
          <div className="app-sidebar-brand">
            <span className="app-sidebar-title">HSOCIETY</span>
            <span className="app-sidebar-subtitle">OffSec</span>
          </div>
        </button>

        <div>
          <p className="app-sidebar-section-title">Navigation</p>
          <div className="app-sidebar-links">
            {defaultLinks.map(renderLink)}
            {bootcampLinks.length > 0 && (
              <div
                className={`bootcamp-dropdown ${learnOpen ? 'open' : ''}`}
                onMouseLeave={() => setLearnOpen(false)}
              >
                <button
                  type="button"
                  className={`app-sidebar-link ${learnOpen ? 'active' : ''}`}
                  onClick={() => setLearnOpen((prev) => !prev)}
                >
                  <span style={{ display: 'inline-flex' }}>
                    <FiLayers size={18} />
                  </span>
                  <span>Learn</span>
                  <FiChevronDown size={16} style={{ marginLeft: 'auto', transition: 'transform 0.2s ease', transform: learnOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}/>
                </button>
                {learnOpen && (
                  <div className="bootcamp-dropdown-menu">
                    {bootcampLinks.map((link) => (
                      <button
                        key={link.path}
                        type="button"
                        className={`app-sidebar-link ${isActive(link.path) ? 'active' : ''}`}
                        onClick={() => navigate(link.path)}
                      >
                        <span style={{ display: 'inline-flex' }}>
                          <link.icon size={18} />
                        </span>
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="app-sidebar-footer">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
