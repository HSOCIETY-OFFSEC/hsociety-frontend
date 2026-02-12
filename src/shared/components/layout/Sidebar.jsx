import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiBarChart2, FiBriefcase, FiFileText, FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import Logo from '../common/Logo';

/**
 * Sidebar Component (large screens only via CSS)
 * Location: src/shared/components/layout/Sidebar.jsx
 */

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: FiBarChart2 },
    { path: '/pentest', label: 'Pentest', icon: FiShield },
    { path: '/audits', label: 'Audits', icon: FiFileText },
    { path: '/feedback', label: 'Feedback', icon: FiMessageSquare },
    { path: '/community', label: 'Community', icon: FiMessageSquare }
  ];

  const publicLinks = [
    { path: '/about', label: 'About Us', icon: FiUsers },
    { path: '/team', label: 'Meet the Team', icon: FiUsers },
    { path: '/developer', label: 'Meet the Developer', icon: FiUsers },
    { path: '/community', label: 'Community', icon: FiMessageSquare },
    { path: '/student-dashboard', label: 'Student Dashboard', icon: FiUsers },
    { path: '/careers', label: 'Careers', icon: FiBriefcase },
    { path: '/methodology', label: 'Methodology', icon: FiShield },
    { path: '/case-studies', label: 'Case Studies', icon: FiFileText },
    { path: '/blog', label: 'Field Notes', icon: FiMessageSquare },
    { path: '/feedback', label: 'Contact', icon: FiMessageSquare }
  ];

  const dedupeLinks = (links) =>
    links.reduce((acc, link) => {
      if (!acc.some((item) => item.path === link.path)) {
        acc.push(link);
      }
      return acc;
    }, []);

  const links = isAuthenticated
    ? dedupeLinks([...navLinks, ...publicLinks])
    : publicLinks;

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
      </div>
    </aside>
  );
};

export default Sidebar;
