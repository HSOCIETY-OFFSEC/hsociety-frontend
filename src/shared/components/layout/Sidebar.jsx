import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { getSidebarLinks } from '../../../config/navigation.config';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';

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

  return (
    <aside className="app-sidebar" aria-label="Sidebar navigation">
      <div className="app-sidebar-inner">
        <div className="app-sidebar-logo" onClick={() => navigate('/')}>
          <Logo size="small" />
          <div className="app-sidebar-brand">
            <span className="app-sidebar-title">HSOCIETY</span>
            <span className="app-sidebar-subtitle">OffSec</span>
          </div>
        </div>

        <div>
          <p className="app-sidebar-section-title">Navigation</p>
          <div className="app-sidebar-links">
            {links.map((link) => (
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
        </div>

        <div className="app-sidebar-footer">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
