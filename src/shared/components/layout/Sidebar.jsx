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
    : path.startsWith('/corporate-dashboard') || path.startsWith('/pentest') || path.startsWith('/audits')
    ? 'corporate'
    : null;
  const resolvedRole = routeRole || role || 'student';
  const links = getSidebarLinks(true, resolvedRole);
  const isStudent = resolvedRole === 'student';
  const feedbackLink = links.find((link) => link.path === '/feedback');
  const mainLinks = isStudent && feedbackLink
    ? links.filter((link) => link.path !== '/feedback')
    : links;

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
            {mainLinks.map((link) => (
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
          {isStudent && feedbackLink && (
            <button
              type="button"
              className={`app-sidebar-link ${isActive(feedbackLink.path) ? 'active' : ''}`}
              onClick={() => navigate(feedbackLink.path)}
            >
              <span style={{ display: 'inline-flex' }}>
                <feedbackLink.icon size={18} />
              </span>
              <span>{feedbackLink.label}</span>
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
