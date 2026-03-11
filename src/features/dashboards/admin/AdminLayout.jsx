import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LuActivity, LuClipboard, LuHouse, LuMenu, LuSettings, LuShield, LuUsers, LuWifi, LuX } from 'react-icons/lu';
import '../../../styles/dashboards/admin/index.css';

const navItems = [
  { to: '/mr-robot', label: 'Overview', icon: LuHouse, end: true },
  { to: '/mr-robot/community', label: 'Manage Community', icon: LuActivity },
  { to: '/mr-robot/users', label: 'Manage Users', icon: LuUsers },
  { to: '/mr-robot/pentests', label: 'Manage Pentests', icon: LuShield },
  { to: '/mr-robot/security', label: 'Security (Mini SOC)', icon: LuWifi },
  { to: '/mr-robot/content', label: 'Manage Content', icon: LuClipboard },
  { to: '/mr-robot/operations', label: 'Management Hub', icon: LuClipboard },
  { to: '/settings', label: 'Account Settings', icon: LuSettings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = () => setSidebarOpen(false);
    document.body.classList.toggle('admin-sidebar-open', sidebarOpen);
    return () => document.body.classList.remove('admin-sidebar-open');
  }, [sidebarOpen]);

  return (
    <div className="admin-shell">
      <header className="admin-mobile-header" aria-label="Admin mobile navigation">
        <button
          type="button"
          className="admin-mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open admin menu"
        >
          <LuMenu size={22} />
          <span>Menu</span>
        </button>
        <span className="admin-mobile-header-title">Admin Console</span>
      </header>

      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
        aria-hidden="true"
        role="presentation"
      />

      <aside
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
        aria-label="Admin navigation"
        aria-hidden={!sidebarOpen}
      >
        <div className="admin-sidebar-brand">
          <span>HSOCIETY</span>
          <strong>Admin Console</strong>
        </div>
        <button
          type="button"
          className="admin-sidebar-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close admin menu"
        >
          <LuX size={20} />
        </button>
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `admin-sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
