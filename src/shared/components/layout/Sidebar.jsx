import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { getSidebarLinks } from '../../../config/navigation.config';
import { LuChevronDown, LuChevronsLeft, LuChevronsRight, LuLayers } from 'react-icons/lu';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import '../../../styles/shared/components/layout/Sidebar.css';

/**
 * Sidebar Component (large screens only via CSS)
 * Location: src/shared/components/layout/Sidebar.jsx
 */
const Sidebar = ({ collapsed = false, onToggleCollapse = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
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
      className={`app-sidebar-link ${isActive(link.path) ? 'active' : ''} ${
        collapsed ? 'is-collapsed' : ''
      }`}
      data-tooltip={collapsed ? link.label : undefined}
      aria-label={link.label}
      onClick={() => navigate(link.path)}
    >
      <span style={{ display: 'inline-flex' }}>
        <link.icon size={18} />
      </span>
      <span className="app-sidebar-label">{link.label}</span>
    </button>
  );

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Sidebar navigation">
      <div className="app-sidebar-inner">
        <button
          type="button"
          className="app-sidebar-logo"
          onClick={() => navigate('/')}
          aria-label="Go to home"
          data-tooltip={collapsed ? 'Home' : undefined}
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
            {collapsed ? (
              links.map(renderLink)
            ) : (
              <>
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
                        <LuLayers size={18} />
                      </span>
                      <span className="app-sidebar-label">Learn</span>
                      <LuChevronDown
                        size={16}
                        style={{
                          marginLeft: 'auto',
                          transition: 'transform 0.2s ease',
                          transform: learnOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
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
                            <span className="app-sidebar-label">{link.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="app-sidebar-footer">
          {onToggleCollapse && (
            <button
              type="button"
              className="app-sidebar-collapse"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              data-tooltip={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? <LuChevronsRight size={16} /> : <LuChevronsLeft size={16} />}
              <span className="app-sidebar-label">
                {collapsed ? 'Expand' : 'Collapse'}
              </span>
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
