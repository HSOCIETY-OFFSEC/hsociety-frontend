import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { getSidebarLinks } from '../../../config/navigation/navigation.config';
import { LuChevronDown, LuChevronsLeft, LuChevronsRight, LuLayers } from 'react-icons/lu';
import Logo from '../common/Logo';
import './Sidebar.css';

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
  const sidebarRef = useRef(null);
  const innerRef = useRef(null);

  const bootcampLinks = useMemo(
    () => links.filter((link) => link.group === 'learn'),
    [links]
  );

  const defaultLinks = useMemo(
    () => links.filter((link) => link.group !== 'learn'),
    [links]
  );

  const labelList = useMemo(() => {
    const labels = links.map((link) => link.label);
    if (bootcampLinks.length > 0) labels.push('Learn');
    labels.push('Collapse');
    return labels;
  }, [links, bootcampLinks.length]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const inner = innerRef.current;
    if (!sidebar || !inner) return undefined;

    const root = sidebar.closest('.workspace-layout') || document.documentElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const getFont = () => {
      const sample = inner.querySelector('.app-sidebar-link');
      const style = window.getComputedStyle(sample || inner);
      const weight = style.fontWeight || '500';
      const size = style.fontSize || '14px';
      const family = style.fontFamily || 'sans-serif';
      return `${weight} ${size} ${family}`;
    };

    const updateWidth = () => {
      if (collapsed) {
        const fallback = getComputedStyle(root)
          .getPropertyValue('--sidebar-collapsed-width')
          .trim() || '84px';
        root.style.setProperty('--sidebar-width', fallback);
        return;
      }

      const sample = inner.querySelector('.app-sidebar-link');
      const style = window.getComputedStyle(sample || inner);
      const paddingLeft = parseFloat(style.paddingLeft || '0');
      const paddingRight = parseFloat(style.paddingRight || '0');
      const gap = parseFloat(style.columnGap || style.gap || '0');
      const iconWidth = 18;
      const breathing = 20;

      ctx.font = getFont();
      const maxLabelWidth = Math.max(
        ...labelList.map((label) => Math.ceil(ctx.measureText(String(label)).width))
      );
      const measured = paddingLeft + paddingRight + iconWidth + gap + maxLabelWidth + breathing;
      const clamped = Math.min(320, Math.max(200, Math.ceil(measured)));
      root.style.setProperty('--sidebar-width', `${clamped}px`);
    };

    updateWidth();
    const handleResize = () => updateWidth();
    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(updateWidth);
    observer.observe(inner);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [collapsed, labelList]);

  const renderLink = (link) => (
    <button
      key={link.path}
      type="button"
      className={`app-sidebar-link ${isActive(link.path) ? 'active' : ''} ${
        collapsed ? 'is-collapsed' : ''
      }`}
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
    <aside ref={sidebarRef} className={`app-sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Sidebar navigation">
      <div className="app-sidebar-inner" ref={innerRef}>
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

        <div className="app-sidebar-nav-block">
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
            >
              {collapsed ? <LuChevronsRight size={16} /> : <LuChevronsLeft size={16} />}
              <span className="app-sidebar-label">
                {collapsed ? 'Expand' : 'Collapse'}
              </span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
