import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FiBarChart2,
  FiBell,
  FiChevronDown,
  FiHome,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { IoFlameOutline } from 'react-icons/io5';
import { useAuth } from '../../../core/auth/AuthContext';
import Sidebar from './Sidebar';
import ThemeToggle from '../common/ThemeToggle';
import { getGithubAvatarDataUri } from '../../utils/avatar';
import { getSidebarLinks } from '../../../config/navigation.config';
import { getProfile } from '../../../features/account/account.service';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../../features/student/services/notifications.service';
import { getStudentXpSummary } from '../../../features/student/services/learn.service';
import cpIcon from '../../../assets/icons/CP/cp-icon.png';
import { WORKSPACE_UI } from '../../../data/shared/workspaceUiData';
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
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [learnOpen, setLearnOpen] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [cpTotal, setCpTotal] = useState(0);

  const menuRef = useRef(null);
  const communityMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);

  const pathname = location.pathname || '';
  const isCommunity = pathname.startsWith('/community');
  const role = user?.role === 'client' ? 'corporate' : user?.role;

  const communityLinks = useMemo(() => {
    if (!isCommunity) return [];
    const links = getSidebarLinks(true, role || 'student');
    return links || [];
  }, [isCommunity, role]);

  const learnLinks = useMemo(
    () => communityLinks.filter((link) => link.group === 'learn'),
    [communityLinks]
  );

  const defaultLinks = useMemo(
    () => communityLinks.filter((link) => link.group !== 'learn'),
    [communityLinks]
  );

  useEffect(() => {
    setSidebarOpen(false);
    setMenuOpen(false);
    setLearnOpen(false);
    setCommunityMenuOpen(false);
    setNotificationMenuOpen(false);
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

  useEffect(() => {
    if (!notificationMenuOpen) return undefined;
    const handleClick = (event) => {
      if (!notificationMenuRef.current || notificationMenuRef.current.contains(event.target)) return;
      setNotificationMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notificationMenuOpen]);

  useEffect(() => {
    let mounted = true;
    const loadNotifications = async () => {
      const response = await listNotifications();
      if (!mounted || !response.success) return;
      setNotifications(response.data || []);
    };
    loadNotifications();
    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;
    const loadCp = async () => {
      if (!user?.id) {
        if (mounted) setCpTotal(0);
        return;
      }
      const response = await getProfile();
      if (!mounted || !response.success) return;
      setCpTotal(Number(response.data?.xpSummary?.totalXp || 0));
    };
    loadCp();
    return () => {
      mounted = false;
    };
  }, [location.pathname, user?.id]);

  useEffect(() => {
    let mounted = true;
    const loadStreak = async () => {
      if (!user?.id || role !== 'student') {
        if (mounted) setStreakDays(0);
        return;
      }
      const response = await getStudentXpSummary();
      if (!mounted || !response.success) return;
      setStreakDays(Number(response.data?.streakDays || 0));
    };
    loadStreak();
    return () => {
      mounted = false;
    };
  }, [location.pathname, role, user?.id]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const showSidebar = !isCommunity && role !== 'admin';

  return (
    <div
      className={`workspace-layout app-shell ${sidebarOpen ? 'sidebar-open' : ''} ${
        showSidebar ? '' : 'no-sidebar'
      }`}
    >
      {showSidebar && <Sidebar />}

      <header className="workspace-topbar">
        <div className="workspace-topbar-content">
          <div className="workspace-topbar-left">
            <button
              type="button"
              className="workspace-home-button"
              onClick={() => navigate('/')}
              aria-label={WORKSPACE_UI.aria.goHome}
            >
              <FiHome size={16} />
              <span>{WORKSPACE_UI.topbar.home}</span>
            </button>

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

                {learnLinks.length > 0 && (
                  <div
                    className={`workspace-community-dropdown ${learnOpen ? 'open' : ''}`}
                    onMouseLeave={() => setLearnOpen(false)}
                  >
                    <button
                      type="button"
                      className={`workspace-community-link ${learnOpen ? 'active' : ''}`}
                      onClick={() => setLearnOpen((prev) => !prev)}
                    >
                      <FiLayers size={16} />
                      <span>{WORKSPACE_UI.topbar.learn}</span>
                      <FiChevronDown size={14} />
                    </button>
                    {learnOpen && (
                      <div className="workspace-community-menu">
                        {learnLinks.map((link) => (
                          <button
                            key={link.path}
                            type="button"
                            className={`workspace-community-item ${
                              pathname === link.path ? 'active' : ''
                            }`}
                            onClick={() => {
                              setLearnOpen(false);
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
            {user?.id && (
              <div className="workspace-cp-chip" title={WORKSPACE_UI.cpChipTitle}>
                <img src={cpIcon} alt="CP" className="workspace-cp-chip-icon" />
                <span>{cpTotal} CP</span>
              </div>
            )}

            {role === 'student' && (
              <div className="workspace-streak-chip" title={WORKSPACE_UI.streakTitle}>
                <IoFlameOutline size={15} />
                <span>{streakDays}</span>
              </div>
            )}

            <div
              className="workspace-notification-wrap"
              ref={notificationMenuRef}
              onMouseLeave={() => setNotificationMenuOpen(false)}
            >
              <button
                type="button"
                className="workspace-notification-btn"
                onClick={() => setNotificationMenuOpen((prev) => !prev)}
                aria-label={WORKSPACE_UI.aria.notifications}
              >
                <FiBell size={16} />
                {unreadCount > 0 && <span className="workspace-notification-badge">{unreadCount}</span>}
              </button>

              {notificationMenuOpen && (
                <div className="workspace-notification-menu">
                  <div className="workspace-notification-head">
                    <strong>{WORKSPACE_UI.notifications.title}</strong>
                    <button
                      type="button"
                      onClick={async () => {
                        await markAllNotificationsRead();
                        setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
                      }}
                    >
                      {WORKSPACE_UI.notifications.markAllRead}
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="workspace-notification-empty">{WORKSPACE_UI.notifications.empty}</p>
                  ) : (
                    notifications.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`workspace-notification-item ${item.read ? '' : 'unread'}`}
                        onClick={async () => {
                          await markNotificationRead(item.id);
                          setNotifications((prev) =>
                            prev.map((entry) =>
                              entry.id === item.id ? { ...entry, read: true } : entry
                            )
                          );
                          if (item.metadata?.meetUrl) {
                            window.open(item.metadata.meetUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <strong>{item.title}</strong>
                        <span>{item.message}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {isCommunity && (
              <div
                className="workspace-community-tools"
                ref={communityMenuRef}
                onMouseLeave={() => setCommunityMenuOpen(false)}
              >
                <button
                  type="button"
                  className="workspace-community-tool-btn"
                  onClick={() => setCommunityMenuOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={communityMenuOpen}
                >
                  <FiBarChart2 size={16} />
                  <span>{WORKSPACE_UI.topbar.community}</span>
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
                      {WORKSPACE_UI.topbar.stats}
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
                      {WORKSPACE_UI.topbar.accountSettings}
                    </button>
                  </div>
                )}
              </div>
            )}

            {isCommunity && <ThemeToggle />}

            <div ref={menuRef} onMouseLeave={() => setMenuOpen(false)}>
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
                <span className="workspace-profile-name">
                  {user?.name || user?.email || WORKSPACE_UI.topbar.userFallback}
                </span>
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
                    {WORKSPACE_UI.topbar.profile}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/settings');
                    }}
                  >
                    {WORKSPACE_UI.topbar.accountSettings}
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
                    {WORKSPACE_UI.topbar.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {!isCommunity && showSidebar && (
        <>
          <button
            type="button"
            className="workspace-fab"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={
              sidebarOpen ? WORKSPACE_UI.aria.closeNavigation : WORKSPACE_UI.aria.openNavigation
            }
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
