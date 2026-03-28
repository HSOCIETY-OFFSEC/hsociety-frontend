import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { getSidebarLinks } from '../../../config/navigation/navigation.config';
import {
  LuBookOpen,
  LuChartBar,
  LuChevronDown,
  LuChevronsLeft,
  LuChevronsRight,
  LuFileText,
  LuLayers,
  LuPlay,
  LuVideo
} from 'react-icons/lu';
import Logo from '../common/Logo';

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
  const isBootcampRoute = path.startsWith('/student-bootcamps');
  const bootcampNavLinks = useMemo(() => ([
    { path: '/student-bootcamps', label: 'Bootcamp Home', icon: LuPlay },
    { path: '/student-bootcamps/overview', label: 'Overview', icon: LuLayers },
    { path: '/student-bootcamps/modules', label: 'Modules', icon: LuBookOpen },
    { path: '/student-bootcamps/live-class', label: 'Live Class', icon: LuVideo },
    { path: '/student-bootcamps/resources', label: 'Resources', icon: LuFileText },
    { path: '/student-bootcamps/progress', label: 'Progress', icon: LuChartBar }
  ]), []);
  const links = isBootcampRoute ? bootcampNavLinks : getSidebarLinks(true, resolvedRole);
  const isActive = (path) => location.pathname === path;
  const [learnOpen, setLearnOpen] = useState(false);
  const sidebarRef = useRef(null);
  const innerRef = useRef(null);

  const bootcampLinks = useMemo(
    () => (isBootcampRoute ? [] : links.filter((link) => link.group === 'learn')),
    [isBootcampRoute, links]
  );

  const defaultLinks = useMemo(
    () => (isBootcampRoute ? links : links.filter((link) => link.group !== 'learn')),
    [isBootcampRoute, links]
  );

  const labelList = useMemo(() => {
    const labels = links.map((link) => link.label);
    if (!isBootcampRoute && bootcampLinks.length > 0) labels.push('Learn');
    labels.push('Collapse');
    return labels;
  }, [bootcampLinks.length, isBootcampRoute, links]);

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

  const linkBase =
    'flex w-full items-center gap-2 rounded-xs border border-transparent px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary';
  const linkActive = 'bg-bg-tertiary text-text-primary border-brand/30 font-semibold';
  const renderLink = (link) => (
    <button
      key={link.path}
      type="button"
      className={`${linkBase} ${isActive(link.path) ? linkActive : ''} ${
        collapsed ? 'justify-center px-2' : ''
      }`}
      aria-label={link.label}
      onClick={() => navigate(link.path)}
    >
      <span className="inline-flex">
        <link.icon size={18} />
      </span>
      {!collapsed && <span className="inline-flex whitespace-nowrap">{link.label}</span>}
    </button>
  );

  return (
    <aside
      ref={sidebarRef}
      className="fixed left-0 z-40 flex flex-col overflow-hidden border-r border-border bg-bg-secondary transition-all duration-200"
      style={{
        top: 'var(--navbar-height, 64px)',
        height: 'calc(100vh - var(--navbar-height, 64px))',
        width: collapsed ? 'var(--sidebar-collapsed-width, 84px)' : 'var(--sidebar-width, 260px)',
      }}
      aria-label="Sidebar navigation"
    >
      <div className="app-sidebar-inner flex h-full flex-col gap-2 overflow-y-auto overflow-x-hidden px-2 py-4" ref={innerRef}>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-left transition-colors duration-150 hover:bg-bg-tertiary"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          <Logo size="small" />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold uppercase tracking-widest text-text-primary">HSOCIETY</span>
              <span className="text-xs uppercase tracking-widest text-text-tertiary">OffSec</span>
            </div>
          )}
        </button>

        <div className="flex flex-1 flex-col">
          {!collapsed && (
            <p className="px-3 pb-1 text-xs uppercase tracking-widest text-text-tertiary">Navigation</p>
          )}
          <div className="flex flex-1 flex-col gap-1">
            {collapsed ? (
              links.map(renderLink)
            ) : isBootcampRoute ? (
              defaultLinks.map(renderLink)
            ) : (
              <>
                {defaultLinks.map(renderLink)}
                {bootcampLinks.length > 0 && (
                  <div
                    className="flex flex-col"
                    onMouseLeave={() => setLearnOpen(false)}
                  >
                    <button
                      type="button"
                      className={`${linkBase} ${learnOpen ? linkActive : ''}`}
                      onClick={() => setLearnOpen((prev) => !prev)}
                    >
                      <span className="inline-flex">
                        <LuLayers size={18} />
                      </span>
                      <span className="inline-flex whitespace-nowrap">Learn</span>
                      <LuChevronDown
                        size={16}
                        className={`ml-auto transition-transform duration-150 ${learnOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {learnOpen && (
                      <div className="ml-2 border-l border-border pl-2">
                        {bootcampLinks.map((link) => (
                          <button
                            key={link.path}
                            type="button"
                            className={`${linkBase} ${isActive(link.path) ? linkActive : ''}`}
                            onClick={() => navigate(link.path)}
                          >
                            <span className="inline-flex">
                              <link.icon size={18} />
                            </span>
                            <span className="inline-flex whitespace-nowrap">{link.label}</span>
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

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3">
          {onToggleCollapse && (
            <button
              type="button"
              className={`inline-flex w-full items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary ${
                collapsed ? 'justify-center' : ''
              }`}
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <LuChevronsRight size={16} /> : <LuChevronsLeft size={16} />}
              {!collapsed && <span className="inline-flex whitespace-nowrap">{collapsed ? 'Expand' : 'Collapse'}</span>}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
