import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LuX } from 'react-icons/lu';
import {
  LuChartBar,
  LuBell,
  LuChevronDown,
  LuHouse,
  LuLayers,
  LuLogOut,
  LuMenu,
  LuUser,
} from 'react-icons/lu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoFlameOutline } from 'react-icons/io5';
import { useAuth } from '../../../core/auth/AuthContext';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { resolveProfileAvatar } from '../../utils/display/profileAvatar';
import { openNotificationTarget } from '../../utils/notificationNavigation';
import { getMobileLinks, getSidebarLinks } from '../../../config/navigation/navigation.config';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import { WORKSPACE_UI } from '../../../data/static/shared/workspaceUiData';
import { useNotifications } from '../providers/NotificationProvider';
import useScrollReveal from '../../hooks/useScrollReveal';
import { useUserStats } from '../../hooks/useUserStats';
import './AppShell.css';
import './WorkspaceLayout.css';
import '../../../styles/base/dashboard-public-profile.css';

/**
 * Workspace Layout
 * App-like shell for dashboards and learning flows.
 */
const WorkspaceLayout = () => {
  const location = useLocation();
  useScrollReveal('.reveal-on-scroll', {}, [location.pathname], '.workspace-layout');

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [navMode, setNavMode] = useState('desktop');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [communityMenuOpen, setCommunityMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  } = useNotifications();
  const role = user?.role === 'client' ? 'corporate' : user?.role;

  // Payment reminder banner — shown for unpaid students
  const PAYMENT_BANNER_KEY = 'hsociety.payment-banner.dismissed';
  const [paymentBannerDismissed, setPaymentBannerDismissed] = useState(() => {
    try { return !!sessionStorage.getItem(PAYMENT_BANNER_KEY); } catch { return false; }
  });
  const showPaymentBanner =
    role === 'student' &&
    !paymentBannerDismissed &&
    user?.bootcampPaymentStatus === 'unpaid';

  const dismissPaymentBanner = () => {
    setPaymentBannerDismissed(true);
    try { sessionStorage.setItem(PAYMENT_BANNER_KEY, '1'); } catch { /* ignore */ }
  };

  const menuRef = useRef(null);
  const communityMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const overflowMenuRef = useRef(null);

  const pathname = location.pathname || '';
  const isLessonWorkspace = pathname.startsWith('/student-bootcamps/modules/');
  const isCommunity = pathname.startsWith('/community');
  const isDashboardTheme = !isCommunity && !isLessonWorkspace;
  const { cpTotal, streakDays } = useUserStats(user?.id, role);

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
    setMenuOpen(false);
    setLearnOpen(false);
    setCommunityMenuOpen(false);
    setNotificationMenuOpen(false);
    setOverflowMenuOpen(false);
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const resolveMode = () => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    const handleResize = () => {
      const nextMode = resolveMode();
      setNavMode(nextMode);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const stored = window?.sessionStorage?.getItem('hsociety.sidebar.collapsed');
    if (stored === 'true' || stored === 'false') {
      setSidebarCollapsed(stored === 'true');
      return;
    }
    setSidebarCollapsed(navMode !== 'mobile');
  }, [navMode]);

  useEffect(() => {
    if (navMode === 'mobile') return undefined;
    document.body.classList.remove('workspace-lock-scroll');
    return () => document.body.classList.remove('workspace-lock-scroll');
  }, [navMode]);

  const { src: avatarSrc, fallback: avatarFallback } = useMemo(
    () => resolveProfileAvatar(user),
    [user]
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
    if (!overflowMenuOpen) return undefined;
    const handleClick = (event) => {
      if (!overflowMenuRef.current || overflowMenuRef.current.contains(event.target)) return;
      setOverflowMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [overflowMenuOpen]);


  const isMobile = navMode === 'mobile';
  const showSidebar = !isLessonWorkspace && !isMobile;
  const handleSidebarToggle = () => {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
      return;
    }
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    window?.sessionStorage?.setItem('hsociety.sidebar.collapsed', String(next));
  };
  const mobileNavLinks = useMemo(
    () => (navMode === 'mobile' ? getMobileLinks(true, role || 'student') : []),
    [navMode, role]
  );
  const bottomNavLinks = useMemo(
    () => (navMode === 'mobile' ? mobileNavLinks.slice(0, 3) : []),
    [navMode, mobileNavLinks]
  );
  const overflowNavLinks = useMemo(
    () => (navMode === 'mobile' ? mobileNavLinks.slice(3) : []),
    [navMode, mobileNavLinks]
  );

  const profileNav = useMemo(
    () => ({
      path: '/settings',
      label: 'Profile',
      avatarSrc,
      avatarFallback,
    }),
    [avatarSrc, avatarFallback]
  );

  return (
    <div
      className={`workspace-layout app-shell ${showSidebar ? '' : 'no-sidebar'} ${
        isLessonWorkspace ? 'lesson-only' : ''
      } ${navMode} ${isCommunity ? 'community-mode' : ''} ${isDashboardTheme ? 'pp-dashboard-theme' : ''} ${
        mobileSidebarOpen ? 'sidebar-open' : ''
      }`}
      style={{
        '--sidebar-collapsed-width': '84px',
        '--bottom-nav-height': isMobile ? '90px' : '64px',
      }}
    >
      {showSidebar && isMobile && (
        <button
          type="button"
          className={`workspace-sidebar-overlay ${mobileSidebarOpen ? 'open' : ''}`}
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      {showSidebar && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
        />
      )}
      {!isLessonWorkspace && (
        <header className="workspace-topbar">
          <div className="workspace-topbar-content">
            <div className="workspace-topbar-left">
              {showSidebar && (
                <button
                  type="button"
                  className="workspace-collapse-btn"
                  onClick={handleSidebarToggle}
                  aria-label={isMobile ? 'Toggle sidebar' : sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <LuMenu size={16} />
                </button>
              )}
              <button
                type="button"
                className="workspace-home-button"
                onClick={() => navigate('/')}
                aria-label={WORKSPACE_UI.aria.goHome}
              >
                <LuHouse size={16} />
                <span>{WORKSPACE_UI.topbar.home}</span>
              </button>

              {isCommunity && !showSidebar && (
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
                        <LuLayers size={16} />
                        <span>{WORKSPACE_UI.topbar.learn}</span>
                        <LuChevronDown size={14} />
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
                  <span>{cpTotal}</span>
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
                  <LuBell size={16} />
                  {unreadCount > 0 && <span className="workspace-notification-badge">{unreadCount}</span>}
                </button>

                {notificationMenuOpen && (
                  <div className="workspace-notification-menu">
                    <div className="workspace-notification-head">
                      <strong>{WORKSPACE_UI.notifications.title}</strong>
                      <div className="workspace-notification-actions">
                        <button
                          type="button"
                          onClick={async () => {
                            await markAllRead();
                          }}
                        >
                          {WORKSPACE_UI.notifications.markAllRead}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNotificationMenuOpen(false);
                            navigate('/notifications');
                          }}
                        >
                          View all
                        </button>
                      </div>
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
                          await markRead(item.id);
                          openNotificationTarget(item, navigate);
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

              {isMobile && overflowNavLinks.length > 0 && (
                <div
                  className="workspace-overflow"
                  ref={overflowMenuRef}
                  onMouseLeave={() => setOverflowMenuOpen(false)}
                >
                  <button
                    type="button"
                    className="workspace-overflow-btn"
                    onClick={() => setOverflowMenuOpen((prev) => !prev)}
                    aria-label="More"
                    aria-haspopup="menu"
                    aria-expanded={overflowMenuOpen}
                  >
                  <BsThreeDotsVertical size={18} />
                  </button>
                  {overflowMenuOpen && (
                    <div className="workspace-overflow-menu" role="menu">
                      {overflowNavLinks.map((link) => (
                        <button
                          key={link.path}
                          type="button"
                          role="menuitem"
                          className={`workspace-overflow-item ${
                            pathname === link.path ? 'active' : ''
                          }`}
                          onClick={() => {
                            setOverflowMenuOpen(false);
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

              {isCommunity && (
                <div
                  className="workspace-community-tools"
                  ref={communityMenuRef}
                >
                  <button
                    type="button"
                    className="workspace-community-tool-btn"
                    onClick={() => setCommunityMenuOpen((prev) => !prev)}
                    aria-label={WORKSPACE_UI.topbar.community}
                    aria-haspopup="menu"
                    aria-expanded={communityMenuOpen}
                  >
                    <LuChartBar size={16} />
                  </button>
                  {communityMenuOpen && (
                    <div className="workspace-community-menu" role="menu">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setCommunityMenuOpen(false);
                          navigate('/community/profiles');
                        }}
                      >
                        <LuChartBar size={16} />
                        Profiles
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setCommunityMenuOpen(false);
                          navigate('/community/media');
                        }}
                      >
                        <LuLayers size={16} />
                        Media
                      </button>
                    </div>
                  )}
                </div>
              )}


              {!isMobile && (
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
                    <span className="workspace-profile-name">
                      {user?.name || user?.email || WORKSPACE_UI.topbar.userFallback}
                    </span>
                    <LuChevronDown size={16} />
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
                        <LuUser size={16} />
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
                        <LuLogOut size={16} />
                        {WORKSPACE_UI.topbar.logout}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={`workspace-main ${isCommunity ? 'community-main' : ''} ${showPaymentBanner ? 'has-payment-banner' : ''}`}>
        {showPaymentBanner && (
          <div className="workspace-payment-banner">
            <span className="workspace-payment-banner-text">
              Your bootcamp access is paused — complete payment to unlock all phases.
            </span>
            <button
              type="button"
              className="workspace-payment-banner-cta"
              onClick={() => navigate('/student-payments?open=payment')}
            >
              Pay Now
            </button>
            <button
              type="button"
              className="workspace-payment-banner-close"
              onClick={dismissPaymentBanner}
              aria-label="Dismiss"
            >
              <LuX size={14} />
            </button>
          </div>
        )}
        <div className="dashboard-shell">
          <Outlet />
        </div>
      </main>

      {navMode === 'mobile' && (
        <BottomNav
          links={bottomNavLinks}
          profile={user?.id ? profileNav : null}
        />
      )}
    </div>
  );
};

export default WorkspaceLayout;
