import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiActivity, FiClipboard, FiHome, FiSettings, FiShield, FiUsers, FiWifi } from 'react-icons/fi';
import '../../../styles/dashboards/admin/index.css';

const navItems = [
  { to: '/mr-robot', label: 'Overview', icon: FiHome, end: true },
  { to: '/mr-robot/community', label: 'Manage Community', icon: FiActivity },
  { to: '/mr-robot/users', label: 'Manage Users', icon: FiUsers },
  { to: '/mr-robot/pentests', label: 'Manage Pentests', icon: FiShield },
  { to: '/mr-robot/security', label: 'Security (Mini SOC)', icon: FiWifi },
  { to: '/mr-robot/content', label: 'Manage Content', icon: FiClipboard },
  { to: '/mr-robot/operations', label: 'Management Hub', icon: FiClipboard },
  { to: '/settings', label: 'Account Settings', icon: FiSettings },
];

const AdminLayout = () => {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-brand">
          <span>HSOCIETY</span>
          <strong>Admin Console</strong>
        </div>
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
