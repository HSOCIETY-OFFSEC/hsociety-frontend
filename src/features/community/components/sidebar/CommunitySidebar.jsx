import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUsers, FiX } from 'react-icons/fi';
import { getSidebarLinks } from '../../../../config/navigation.config';
import Logo from '../../../../shared/components/common/Logo';
import '../../../../styles/sections/community/sidebar.css';

const CommunitySidebar = ({
  role,
  mobileOpen = false,
  onCloseMobileNav = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const rawLinks = getSidebarLinks(true, role);
  const links = useMemo(() => {
    if (rawLinks.some((link) => link.path === '/settings')) return rawLinks;
    return [
      ...rawLinks,
      { path: '/settings', label: 'Settings', icon: FiUsers },
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
      className={`community-sidebar-link ${isActive(link.path) ? 'active' : ''}`}
      onClick={() => {
        navigate(link.path);
        onCloseMobileNav();
      }}
    >
      <span className="community-sidebar-link-icon">
        <link.icon size={16} />
      </span>
      <span>{link.label}</span>
    </button>
  );

  return (
    <aside className={`community-sidebar ${mobileOpen ? 'open' : ''}`} aria-label="Community navigation">
      <div className="community-sidebar-brand">
        <button
          type="button"
          className="community-sidebar-brand-btn"
          onClick={() => {
            navigate('/community');
            onCloseMobileNav();
          }}
          aria-label="Go to community home"
        >
          <Logo size="small" className="community-sidebar-logo" />
          <span className="community-sidebar-brand-name">HSOCIETY</span>
        </button>
        <button
          type="button"
          className="community-sidebar-close-btn"
          onClick={onCloseMobileNav}
          aria-label="Close navigation"
        >
          <FiX size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="community-sidebar-section">
        <p className="community-sidebar-section-title">Navigation</p>
        <div className="community-sidebar-links">
          {defaultLinks.map(renderLink)}
        </div>
      </div>

      {bootcampLinks.length > 0 && (
        <div className="community-sidebar-section">
          <p className="community-sidebar-section-title">Bootcamp</p>
          <div className="community-sidebar-links">
            {bootcampLinks.map(renderLink)}
          </div>
        </div>
      )}
    </aside>
  );
};

export default CommunitySidebar;
