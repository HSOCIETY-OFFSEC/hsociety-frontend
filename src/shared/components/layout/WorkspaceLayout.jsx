import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiBarChart2, FiChevronDown, FiHome, FiLayers, FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import Sidebar from './Sidebar';
import ThemeToggle from '../common/ThemeToggle';
import { getGithubAvatarDataUri } from '../../utils/avatar';
import { getSidebarLinks } from '../../../config/navigation.config';
import '../../../styles/shared/components/layout/AppShell.css';
import '../../../styles/shared/components/layout/WorkspaceLayout.css';

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
  const [communityMenuOpen, setCommunityMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const communityMenuRef = useRef(null);
  const pathname = location.pathname || '';
  const isCommunity = pathname.startsWith('/community');
  const role = user?.role === 'client' ? 'corporate' : user?.role;
  const [bootcampOpen, setBootcampOpen] = useState(false);
  const workspaceTitle = useMemo(() => {
    const titleMap = [
      { path: '/student-dashboard', title: 'Student Dashboard' },
      { path: '/student-learning', title: 'Learning Path' },
      { path: '/student-learning/module', title: 'Lesson' },
      { path: '/corporate-dashboard', title: 'Corporate Dashboard' },
      { path: '/engagements', title: 'Engagements' },
      { path: '/reports', title: 'Reports' },
      { path: '/remediation', title: 'Remediation' },
      { path: '/assets', title: 'Assets' },
      { path: '/billing', title: 'Billing' },
      { path: '/pentester/engagements', title: 'Engagements' },
      { path: '/pentester/reports', title: 'Reports' },
      { path: '/pentester/profiles', title: 'Pentester Profiles' },
      { path: '/pentester', title: 'Pentester Overview' },
      { path: '/pentest', title: 'Engagements' },
      { path: '/community', title: 'Community' },
      { path: '/mr-robot', title: 'Admin Dashboard' },
      { path: '/settings', title: 'Account Settings' }
    ];
    const match = titleMap.find((entry) => pathname.startsWith(entry.path));
    return match?.title || 'Workspace';
  }, [pathname]);

  const communityLinks = useMemo(() => {
    if (!isCommunity) return [];
    const links = getSidebarLinks(true, role || 'student');
    return links || [];
  }, [isCommunity, role]);

  const bootcampLinks = useMemo(
    () => communityLinks.filter((link) => link.group === 'bootcamp'),
    [communityLinks]
  );

  const defaultLinks = useMemo(
    () => communityLinks.filter((link) => link.group !== 'bootcamp'),
    [communityLinks]
  );

  useEffect(() => {
    setSidebarOpen(false);
    setMenuOpen(false);
    setBootcampOpen(false);
    setCommunityMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('workspace-lock-scroll', sidebarOpen);
    return () => document.body.classList.remove('workspace-lock-scroll');
  }, [sidebarOpen]);

  const avatarFallback = useMemo(
    () => getGithubAvatarDataUri(user?.email || user?.name || 'user'),
    [user?.email, user?.name]
  );
  const avatarSrc = user?.avatarUrl || avatarFallback;

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClick = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!communityMenuOpen) return undefined;
    const handleClick = (event) => {
      if (!communityMenuRef.current || communityMenuRef.current.contains(event.target)) return;
      setCommunityMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [communityMenuOpen]);

  return (
    <div
      className={`workspace-layout app-shell ${sidebarOpen ? 'sidebar-open' : ''} ${isCommunity ? 'no-sidebar' : ''}`}
    >
      {!isCommunity && <Sidebar />}

      {!isCommunity && (
        <header className="workspace-topbar">
          <div className="workspace-topbar-content">
            <div className="workspace-topbar-left">
              <button
                type="button"
                className="workspace-home-button"
                onClick={() => navigate('/')}
                aria-label="Go to home"
              >
                <FiHome size={16} />
                <span>Home</span>
              </button>
              <div className="workspace-topbar-title">{workspaceTitle}</div>

              {isCommunity && (
                <nav className="workspace-community-nav" aria-label="Workspace navigation">
                  {defaultLinks.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      className={`workspace-community-link ${pathname === link.path ? 'active' : ''}`}
                      onClick={() => navigate(link.path)}
                    >
                      <link.icon size={16} />
                      <span>{link.label}</span>
                    </button>
                  ))}

                  {bootcampLinks.length > 0 && (
                    <div className={`workspace-community-dropdown ${bootcampOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className={`workspace-community-link ${bootcampOpen ? 'active' : ''}`}
                        onClick={() => setBootcampOpen((prev) => !prev)}
                      >
                        <FiLayers size={16} />
                        <span>Bootcamp</span>
                        <FiChevronDown size={14} />
                      </button>
                      {bootcampOpen && (
                        <div className="workspace-community-menu">
                          {bootcampLinks.map((link) => (
                            <button
                              key={link.path}
                              type="button"
                              className={`workspace-community-item ${pathname === link.path ? 'active' : ''}`}
                              onClick={() => {
                                setBootcampOpen(false);
                                navigate(link.path);
                              }}
                            >
                              <link.icon size={16} />
                              <span>{link.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </nav>
              )}
            </div>
            <div className="workspace-topbar-actions">
              {isCommunity && (
                <div className="workspace-community-tools" ref={communityMenuRef}>
                  <button
                    type="button"
                    className="workspace-community-tool-btn"
                    onClick={() => setCommunityMenuOpen((prev) => !prev)}
                    aria-haspopup="menu"
                    aria-expanded={communityMenuOpen}
                  >
                    <FiBarChart2 size={16} />
                    <span>Community</span>
                    <FiChevronDown size={14} />
                  </button>
                  {communityMenuOpen && (
                    <div className="workspace-community-menu" role="menu">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setCommunityMenuOpen(false);
                          navigate('/community#stats');
                        }}
                      >
                        <FiBarChart2 size={16} />
                        Stats
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setCommunityMenuOpen(false);
                          navigate('/settings');
                        }}
                      >
                        <FiUser size={16} />
                        Account Settings
                      </button>
                    </div>
                  )}
                </div>
              )}
              {isCommunity && <ThemeToggle />}
              <div ref={menuRef}>
              <button
                type="button"
                className="workspace-profile-button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="workspace-avatar">
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    onError={(e) => {
                      if (e.currentTarget.src !== avatarFallback) {
                        e.currentTarget.src = avatarFallback;
                      }
                    }}
                  />
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
          </div>
        </header>
      )}

      {!isCommunity && (
        <>
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
        </>
      )}

      <main className={`workspace-main ${isCommunity ? 'community-main' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default WorkspaceLayout;
