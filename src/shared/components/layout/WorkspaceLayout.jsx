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
// WorkspaceLayout styles are now Tailwind-based.
import BootcampComingSoonModal from '../../../features/student/components/bootcamp/BootcampComingSoonModal';
import { envConfig } from '../../../config/app/env.config';

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
  const bootcampComingSoon = envConfig.features.bootcampComingSoon;
  const [bootcampModalOpen, setBootcampModalOpen] = useState(false);
  const lastNonBootcampPathRef = useRef('/student-dashboard');

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
  const isBootcamp = pathname.startsWith('/student-bootcamps');
  const isDashboardTheme = !isCommunity && !isLessonWorkspace;
  const { cpTotal, streakDays } = useUserStats(user?.id, role);

  useEffect(() => {
    if (!bootcampComingSoon) {
      if (bootcampModalOpen) setBootcampModalOpen(false);
      lastNonBootcampPathRef.current = pathname;
      return;
    }
    if (!pathname.startsWith('/student-bootcamps')) {
      if (bootcampModalOpen) setBootcampModalOpen(false);
      lastNonBootcampPathRef.current = pathname;
      return;
    }
    if (!bootcampModalOpen) setBootcampModalOpen(true);
  }, [bootcampComingSoon, bootcampModalOpen, pathname]);

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

  const topbarBase =
    'fixed left-0 right-0 z-40 flex h-16 items-center border-b border-border bg-bg-secondary px-5 font-sans';
  const iconBtn =
    'inline-flex h-8 w-8 items-center justify-center rounded-xs border border-border text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary';
  const pillBtn =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1.5 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-bg-tertiary';
  const dropdownBase =
    'absolute top-full mt-2 w-72 max-w-sm origin-top-left rounded-sm border border-border bg-bg-secondary p-2 shadow-lg animate-workspace-pop';
  const dropdownItem =
    'flex w-full items-center gap-2 rounded-xs px-3 py-2 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary';

  const mainPaddingTop = isLessonWorkspace
    ? 'calc(var(--navbar-height, 64px) + 0.75rem)'
    : isCommunity
    ? 'calc(var(--navbar-height, 64px) + 1rem)'
    : 'calc(var(--navbar-height, 64px) + 1.5rem)';

  const mainPaddingBottom = isCommunity
    ? '0px'
    : isMobile
    ? 'calc(1.5rem + var(--bottom-nav-height, 64px))'
    : '2rem';

  const mainPaddingX = isLessonWorkspace ? '0px' : isMobile ? '1rem' : '1.5rem';

  const mainPaddingLeft = showSidebar && !isLessonWorkspace && !isMobile
    ? 'calc(var(--sidebar-width, 260px) + 1.5rem)'
    : mainPaddingX;

  return (
    <div
      className={`workspace-layout relative flex min-h-screen flex-col ${isCommunity ? 'community-mode h-screen overflow-hidden' : ''} ${
        isDashboardTheme ? 'pp-dashboard-theme' : ''
      } ${mobileSidebarOpen ? 'sidebar-open' : ''}`}
      style={{
        '--sidebar-collapsed-width': '84px',
        '--bottom-nav-height': isMobile ? '90px' : '64px',
      }}
    >
      {showSidebar && isMobile && (
        <button
          type="button"
          className={`fixed inset-0 z-30 border-0 bg-black/50 transition-opacity duration-150 ${
            mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
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
        <header className={topbarBase} style={{ top: '0px' }}>
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              {showSidebar && (
                <button
                  type="button"
                  className={iconBtn}
                  onClick={handleSidebarToggle}
                  aria-label={isMobile ? 'Toggle sidebar' : sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <LuMenu size={16} />
                </button>
              )}
              <button
                type="button"
                className={pillBtn}
                onClick={() => navigate(isBootcamp ? '/student-dashboard' : '/')}
                aria-label={isBootcamp ? 'Back to dashboard' : WORKSPACE_UI.aria.goHome}
              >
                <LuHouse size={16} />
                <span className="hidden sm:inline">{isBootcamp ? 'Back' : WORKSPACE_UI.topbar.home}</span>
              </button>

              {isCommunity && !showSidebar && (
                <nav className="flex max-w-xs flex-wrap items-center gap-1 overflow-x-auto md:max-w-sm md:overflow-visible" aria-label="Workspace navigation">
                  {defaultLinks.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary ${
                        pathname === link.path ? 'bg-bg-tertiary text-text-primary border-brand/30' : ''
                      }`}
                      onClick={() => navigate(link.path)}
                    >
                      <link.icon size={16} />
                      <span>{link.label}</span>
                    </button>
                  ))}

                  {learnLinks.length > 0 && (
                    <div
                      className="relative"
                      onMouseLeave={() => setLearnOpen(false)}
                    >
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary ${
                          learnOpen ? 'bg-bg-tertiary text-text-primary border-brand/30' : ''
                        }`}
                        onClick={() => setLearnOpen((prev) => !prev)}
                      >
                        <LuLayers size={16} />
                        <span>{WORKSPACE_UI.topbar.learn}</span>
                        <LuChevronDown size={14} />
                      </button>
                      {learnOpen && (
                        <div className={`${dropdownBase} left-0`}>
                          {learnLinks.map((link) => (
                            <button
                              key={link.path}
                              type="button"
                              className={`${dropdownItem} ${
                                pathname === link.path ? 'bg-bg-tertiary text-text-primary' : ''
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

            <div className="flex items-center gap-2">
              {role === 'student' && isBootcamp && (
                <button
                  type="button"
                  className="hidden items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary sm:inline-flex"
                  onClick={() => navigate('/student-bootcamps/live-class')}
                >
                  Live Class
                </button>
              )}
              {user?.id && (
                <div
                  className="hidden items-center gap-2 rounded-xs border border-status-success/40 bg-status-success/10 px-3 py-1 text-sm font-semibold text-status-success sm:inline-flex"
                  title={WORKSPACE_UI.cpChipTitle}
                >
                  <img src={cpIcon} alt="CP" className="h-5 w-5 object-contain" />
                  <span>{cpTotal}</span>
                </div>
              )}

              {role === 'student' && (
                <div className="hidden items-center gap-1 rounded-xs border border-status-orange/40 bg-status-orange/10 px-3 py-1 text-xs font-semibold text-text-primary sm:inline-flex" title={WORKSPACE_UI.streakTitle}>
                  <IoFlameOutline size={15} />
                  <span className="hidden sm:inline">{streakDays}</span>
                </div>
              )}

              <div
                className="relative"
                ref={notificationMenuRef}
                onMouseLeave={() => setNotificationMenuOpen(false)}
              >
                <button
                  type="button"
                  className={iconBtn}
                  onClick={() => setNotificationMenuOpen((prev) => !prev)}
                  aria-label={WORKSPACE_UI.aria.notifications}
                >
                  <LuBell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-danger px-1 text-xs font-semibold text-ink-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationMenuOpen && (
                  <div className={`${dropdownBase} right-0 origin-top-right`}>
                    <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
                      <strong className="text-sm text-text-primary">{WORKSPACE_UI.notifications.title}</strong>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
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
                      <p className="py-2 text-sm text-text-tertiary">{WORKSPACE_UI.notifications.empty}</p>
                    ) : (
                      notifications.slice(0, 8).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`flex w-full flex-col gap-1 rounded-xs border border-border px-3 py-2 text-left text-xs text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary ${
                            item.read ? '' : 'border-brand/40'
                          }`}
                          onClick={async () => {
                            await markRead(item.id);
                            openNotificationTarget(item, navigate);
                          }}
                        >
                          <strong className="text-sm text-text-primary">{item.title}</strong>
                          <span className="text-xs text-text-secondary">{item.message}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {isMobile && overflowNavLinks.length > 0 && (
                <div
                  className="relative"
                  ref={overflowMenuRef}
                  onMouseLeave={() => setOverflowMenuOpen(false)}
                >
                  <button
                    type="button"
                    className={iconBtn}
                    onClick={() => setOverflowMenuOpen((prev) => !prev)}
                    aria-label="More"
                    aria-haspopup="menu"
                    aria-expanded={overflowMenuOpen}
                  >
                  <BsThreeDotsVertical size={18} />
                  </button>
                  {overflowMenuOpen && (
                    <div className={`${dropdownBase} right-0 origin-top-right`} role="menu">
                      {overflowNavLinks.map((link) => (
                        <button
                          key={link.path}
                          type="button"
                          role="menuitem"
                          className={`${dropdownItem} ${
                            pathname === link.path ? 'bg-brand/10 text-brand' : ''
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
                  className="relative"
                  ref={communityMenuRef}
                >
                  <button
                    type="button"
                    className={iconBtn}
                    onClick={() => setCommunityMenuOpen((prev) => !prev)}
                    aria-label={WORKSPACE_UI.topbar.community}
                    aria-haspopup="menu"
                    aria-expanded={communityMenuOpen}
                  >
                    <LuChartBar size={16} />
                  </button>
                  {communityMenuOpen && (
                    <div className={`${dropdownBase} right-0 origin-top-right`} role="menu">
                      <button
                        type="button"
                        role="menuitem"
                        className={dropdownItem}
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
                        className={dropdownItem}
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
                <div ref={menuRef} className="relative">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2 py-1.5 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-bg-tertiary"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-brand text-ink-white">
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
                    <span className="hidden max-w-32 truncate text-sm sm:inline">
                      {user?.name || user?.email || WORKSPACE_UI.topbar.userFallback}
                    </span>
                    <LuChevronDown size={16} />
                  </button>
                  {menuOpen && (
                    <div className={`${dropdownBase} right-0 origin-top-right`} role="menu">
                      <button
                        type="button"
                        role="menuitem"
                        className={dropdownItem}
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
                        className={dropdownItem}
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
                        className={dropdownItem}
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

      <main
        className="workspace-main w-full min-w-0 flex-1 overflow-x-hidden"
        style={{
          paddingTop: mainPaddingTop,
          paddingLeft: mainPaddingLeft,
          paddingRight: mainPaddingX,
          paddingBottom: mainPaddingBottom,
          height: isCommunity ? 'calc(100vh - var(--navbar-height, 64px))' : 'auto',
        }}
      >
        {showPaymentBanner && (
          <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xs border border-status-warning/40 bg-status-warning/10 px-3 py-2 text-sm text-text-secondary">
            <span className="flex-1 min-w-0">
              Your bootcamp access is paused — complete payment to unlock all phases.
            </span>
            <button
              type="button"
              className="rounded-xs bg-status-warning px-3 py-1 text-xs font-semibold text-ink-black transition-colors duration-150 hover:bg-status-warning/80"
              onClick={() => navigate('/student-payments?open=payment')}
            >
              Pay Now
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-xs p-1 text-text-tertiary hover:text-text-primary"
              onClick={dismissPaymentBanner}
              aria-label="Dismiss"
            >
              <LuX size={14} />
            </button>
          </div>
        )}
        <div className="flex flex-col gap-5">
          <Outlet />
        </div>
      </main>

      {navMode === 'mobile' && (
        <BottomNav
          links={bottomNavLinks}
          profile={user?.id ? profileNav : null}
        />
      )}
      {bootcampComingSoon && bootcampModalOpen && (
        <BootcampComingSoonModal
          onClose={() => {
            setBootcampModalOpen(false);
            if (pathname.startsWith('/student-bootcamps')) {
              const fallback = (
                lastNonBootcampPathRef.current
                && !lastNonBootcampPathRef.current.startsWith('/student-bootcamps')
              )
                ? lastNonBootcampPathRef.current
                : '/student-dashboard';
              if (pathname !== fallback) {
                navigate(fallback, { replace: true });
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default WorkspaceLayout;
