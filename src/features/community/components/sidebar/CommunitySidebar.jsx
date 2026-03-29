import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiUsers, FiX } from 'react-icons/fi';
import { getSidebarLinks } from '../../../../config/navigation/navigation.config';
import Logo from '../../../../shared/components/common/Logo';
import { COMMUNITY_UI } from '../../../../data/static/community/communityUiData';

const CommunitySidebar = ({
  role,
  mobileOpen = false,
  onCloseMobileNav = () => {},
  collapsed = false,
  onToggleCollapse = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const rawLinks = getSidebarLinks(true, role);
  const links = useMemo(() => {
    if (rawLinks.some((link) => link.path === '/settings')) return rawLinks;
    return [
      ...rawLinks,
      { path: '/settings', label: COMMUNITY_UI.sidebar.settingsLabel, icon: FiUsers },
    ];
  }, [rawLinks]);
  const isActive = (path) => location.pathname === path;

  const defaultLinks = useMemo(
    () => links.filter((link) => link.group !== 'bootcamp'),
    [links]
  );

  const bootcampLinks = useMemo(
    () => links.filter((link) => link.group === 'bootcamp'),
    [links]
  );

  const renderLink = (link) => (
    <button
      key={link.path}
      type="button"
      className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm font-semibold transition ${
        isActive(link.path)
          ? 'border-border bg-bg-secondary text-text-primary'
          : 'border-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
      } ${collapsed ? 'justify-center px-2' : ''}`}
      onClick={() => {
        navigate(link.path);
        onCloseMobileNav();
      }}
    >
      <span className="text-text-tertiary">
        <link.icon size={16} />
      </span>
      <span className={`${collapsed ? 'hidden' : 'inline'} truncate`}>{link.label}</span>
    </button>
  );

  return (
    <aside
      className={`${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } fixed inset-y-0 left-0 z-30 flex flex-col gap-4 overflow-y-auto border-r border-border bg-bg-primary px-4 py-4 transition-transform lg:static ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Community navigation"
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-text-primary"
          onClick={() => {
            navigate('/community');
            onCloseMobileNav();
          }}
          aria-label="Go to community home"
        >
          <Logo size="small" className="h-7 w-7" />
          <span className={`${collapsed ? 'hidden' : 'inline'}`}>{COMMUNITY_UI.sidebar.brandName}</span>
        </button>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-bg-secondary text-text-secondary transition hover:text-text-primary lg:hidden"
          onClick={onCloseMobileNav}
          aria-label="Close navigation"
        >
          <FiX size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="hidden h-8 w-8 items-center justify-center rounded-md border border-border bg-bg-secondary text-text-secondary transition hover:text-text-primary lg:inline-flex"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <p className={`text-xs uppercase tracking-widest text-text-tertiary ${collapsed ? 'sr-only' : ''}`}>
          {COMMUNITY_UI.sidebar.navigationTitle}
        </p>
        <div className="flex flex-col gap-1">
          {defaultLinks.map(renderLink)}
        </div>
      </div>

      {bootcampLinks.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className={`text-xs uppercase tracking-widest text-text-tertiary ${collapsed ? 'sr-only' : ''}`}>
            {COMMUNITY_UI.sidebar.bootcampTitle}
          </p>
          <div className="flex flex-col gap-1">
            {bootcampLinks.map(renderLink)}
          </div>
        </div>
      )}
    </aside>
  );
};

export default CommunitySidebar;
