import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import Sidebar from './Sidebar';
import { getAvatarStyle } from '../../utils/avatar';
import '../../../styles/shared/layout.css';

/**
 * Workspace Layout
 * App-like shell for dashboards and learning flows.
 */
const WorkspaceLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = location.pathname || '';
  const workspaceTitle = useMemo(() => {
    const titleMap = [
      { path: '/student-dashboard', title: 'Student Dashboard' },
      { path: '/student-learning', title: 'Learning Path' },
      { path: '/student-learning/module', title: 'Lesson' },
      { path: '/corporate-dashboard', title: 'Corporate Dashboard' },
      { path: '/audits', title: 'Audits' },
      { path: '/pentest', title: 'Pentest' },
      { path: '/pentester', title: 'Pentester Dashboard' },
      { path: '/mr-robot', title: 'Admin Dashboard' },
      { path: '/community', title: 'Community' },
      { path: '/settings', title: 'Account Settings' }
    ];
    const match = titleMap.find((entry) => pathname.startsWith(entry.path));
    return match?.title || 'Workspace';
  }, [pathname]);

  useEffect(() => {
    setSidebarOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const userInitials = useMemo(() => {
    const name = user?.name || user?.email || 'User';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [user?.email, user?.name]);

  const avatarStyle = useMemo(
    () => getAvatarStyle(user?.email || user?.name || 'user'),
    [user?.email, user?.name]
  );

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClick = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div className={`workspace-layout app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar />

      <header className="workspace-topbar">
        <div className="workspace-topbar-content">
          <div className="workspace-topbar-title">{workspaceTitle}</div>
          <div className="workspace-topbar-actions" ref={menuRef}>
            <button
              type="button"
              className="workspace-profile-button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="workspace-avatar" style={user?.avatarUrl ? undefined : avatarStyle}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" />
                ) : (
                  <span>{userInitials}</span>
                )}
              </span>
              <span className="workspace-profile-name">{user?.name || user?.email || 'User'}</span>
              <FiChevronDown size={16} />
            </button>
            {menuOpen && (
              <div className="workspace-profile-menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/settings');
                  }}
                >
                  <FiUser size={16} />
                  Profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/settings');
                  }}
                >
                  Account Settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                  }}
                >
                  <FiLogOut size={16} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <button
        type="button"
        className="workspace-fab"
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
      >
        {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
      </button>

      <div
        className={`workspace-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <main className="workspace-main">
        <Outlet />
      </main>
    </div>
  );
};

export default WorkspaceLayout;
