/**
 * Navbar Component
 * Location: src/shared/components/layout/Navbar.jsx
 *
 * GitHub header UI:
 *   logo | desktop-nav (centered) | right (stats · theme · notif · user · hamburger)
 *
 * Zero logic changes — only class names updated to match the new CSS.
 */

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LuBookOpen,
  LuChevronDown,
  LuCreditCard,
  LuBell,
  LuLayers,
  LuLogIn,
  LuLogOut,
  LuMenu,
  LuEllipsis,
  LuMessageCircle,
  LuShield,
  LuX,
} from 'react-icons/lu';
import { IoFlameOutline } from 'react-icons/io5';
import { useAuth } from '../../../core/auth/AuthContext';
import useAuthModal from '../../hooks/useAuthModal';
import { getMobileLinks, getDesktopLinks } from '../../../config/navigation/navigation.config';
import Logo from '../common/Logo';
import { resolveProfileAvatar } from '../../utils/display/profileAvatar';
import { openNotificationTarget } from '../../utils/notificationNavigation';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import { useNotifications } from '../providers/NotificationProvider';
import { useUserStats } from '../../hooks/useUserStats';

const NAV_COLLAPSE_WIDTH = 1024;
const MENU_IDS = {
  more:          'navbar-more-menu',
  student:       'navbar-student-menu',
  notifications: 'navbar-notifications',
  mobile:        'navbar-mobile-menu',
};

const Navbar = ({ sticky = true, logoSrc = null, transparentOnTop = false }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { openAuthModal } = useAuthModal();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen,       setMobileMenuOpen]       = useState(false);
  const [userMenuOpen,         setUserMenuOpen]         = useState(false);
  const [studentLearnOpen,     setStudentLearnOpen]     = useState(false);
  const [moreMenuOpen,         setMoreMenuOpen]         = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [mobileSectionsOpen,   setMobileSectionsOpen]   = useState({
    primary: true, learning: true, secondary: false,
  });

  const moreMenuRef            = useRef(null);
  const notificationMenuRef    = useRef(null);
  const studentMenuRef         = useRef(null);
  const userMenuRef            = useRef(null);
  const moreCloseTimerRef      = useRef(null);
  const studentCloseTimerRef   = useRef(null);
  const userCloseTimerRef      = useRef(null);
  const notificationCloseTimerRef = useRef(null);

  const [viewportMode, setViewportMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= NAV_COLLAPSE_WIDTH
      ? 'mobile'
      : 'desktop'
  );
  const [isAtTop, setIsAtTop] = useState(true);
  const isAuthPage = location.pathname.startsWith('/posts')
    || location.pathname.startsWith('/login')
    || location.pathname.startsWith('/register')
    || location.pathname.startsWith('/pentester-login')
    || location.pathname.startsWith('/change-password');

  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const { src: avatarSrc, fallback: avatarFallback } = useMemo(
    () => resolveProfileAvatar(user),
    [user]
  );

  const handleLogout = async () => { await logout(); };
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleResize = () => {
      const next = window.innerWidth <= NAV_COLLAPSE_WIDTH ? 'mobile' : 'desktop';
      setViewportMode((prev) => {
        if (prev !== next) { setMobileMenuOpen(false); setUserMenuOpen(false); }
        return next;
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const shouldShowDock = viewportMode === 'mobile' && !isAuthenticated && !mobileMenuOpen && !footerInView;
    document.body.classList.toggle('has-auth-dock', shouldShowDock);
    return () => {
      document.body.classList.remove('has-auth-dock');
    };
  }, [viewportMode, isAuthenticated, mobileMenuOpen, footerInView]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const footer = document.getElementById('footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry.isIntersecting);
        setFooterInView(visible);
        document.body.classList.toggle('footer-in-view', visible);
      },
      { threshold: 0.2 }
    );
    observer.observe(footer);
    return () => {
      observer.disconnect();
      document.body.classList.remove('footer-in-view');
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!transparentOnTop || typeof window === 'undefined') return undefined;
    const update = () => {
      const atTop = window.scrollY <= 2;
      setIsAtTop(atTop);
      document.documentElement.classList.toggle('nav-scrolled', !atTop);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      document.documentElement.classList.remove('nav-scrolled');
    };
  }, [transparentOnTop, location.pathname]);

  const role        = user?.role === 'client' ? 'corporate' : user?.role;
  const isStudent   = role === 'student';
  const showStats   = isAuthenticated && Boolean(user?.id);
  const { cpTotal, streakDays } = useUserStats(user?.id, role);

  const mobileLinks      = getMobileLinks(isAuthenticated, role);
  const desktopBasicLinks = getDesktopLinks(isAuthenticated, role);

  const studentLearnLinks = useMemo(() => [
    { path: '/student-bootcamps', label: 'Bootcamp',  icon: LuLayers      },
    { path: '/student-resources', label: 'Resources', icon: LuBookOpen    },
    { path: '/student-payments',  label: 'Payments',  icon: LuCreditCard  },
    { path: '/community',         label: 'Community', icon: LuMessageCircle },
  ], []);

  const studentUtilityLinks    = useMemo(() => [], []);
  const hiddenStudentNavPaths  = useMemo(
    () => new Set(studentLearnLinks.map((l) => l.path)),
    [studentLearnLinks]
  );

  const roleOrder = useMemo(() => ({
    student:   ['/student-dashboard','/student-bootcamps/overview','/student-bootcamps','/student-resources','/student-payments','/community'],
    corporate: ['/corporate-dashboard','/engagements','/reports','/remediation','/assets','/billing','/community','/leaderboard','/settings'],
    pentester: ['/pentester','/pentester/engagements','/pentester/reports','/pentester/profiles','/community','/leaderboard','/settings'],
    admin:     ['/mr-robot','/community','/leaderboard','/settings'],
  }), []);

  const orderedDesktopLinks = useMemo(() => {
    const base  = isStudent
      ? desktopBasicLinks.filter((l) => !hiddenStudentNavPaths.has(l.path))
      : desktopBasicLinks;
    const order = roleOrder[role] || [];
    return [...base].sort((a, b) => {
      const ai = order.indexOf(a.path), bi = order.indexOf(b.path);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [desktopBasicLinks, hiddenStudentNavPaths, isStudent, role, roleOrder]);

  const maxDesktopLinks    = isAuthenticated ? (isStudent ? 1 : 2) : 4;
  const visibleDesktopLinks  = orderedDesktopLinks.slice(0, maxDesktopLinks);
  const overflowDesktopLinks = orderedDesktopLinks.slice(maxDesktopLinks);

  const mobileSections = useMemo(() => ({
    primary:   isStudent ? mobileLinks.filter((l) => !hiddenStudentNavPaths.has(l.path)) : mobileLinks,
    learning:  isStudent ? studentLearnLinks  : [],
    secondary: isStudent ? studentUtilityLinks : [],
  }), [isStudent, mobileLinks, hiddenStudentNavPaths, studentLearnLinks, studentUtilityLinks]);

  const isActive = (path) => location.pathname === path;

  const clearCloseTimer = useCallback((ref) => {
    if (ref.current) { window.clearTimeout(ref.current); ref.current = null; }
  }, []);

  const scheduleClose = useCallback((ref, setter) => {
    clearCloseTimer(ref);
    ref.current = window.setTimeout(() => setter(false), 160);
  }, [clearCloseTimer]);

  const openMenu = useCallback((ref, setter) => {
    clearCloseTimer(ref);
    setter(true);
  }, [clearCloseTimer]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setStudentLearnOpen(false);
    setMoreMenuOpen(false);
    setNotificationMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!moreMenuOpen) return undefined;
    const handler = (e) => {
      if (!moreMenuRef.current?.contains(e.target)) setMoreMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moreMenuOpen]);

  useEffect(() => {
    if (!notificationMenuOpen) return undefined;
    const handler = (e) => {
      if (!notificationMenuRef.current?.contains(e.target)) setNotificationMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notificationMenuOpen]);

  const handleEscape = (e, setter) => { if (e.key === 'Escape') setter(false); };

  const navBase =
    'fixed left-0 right-0 z-40 h-16 border-b border-border bg-bg-secondary font-sans transition-colors duration-200';
  const navTransparent = 'bg-transparent border-transparent';
  const navInner = 'mx-auto flex h-full w-full items-center gap-4 px-4';
  const navLinks = 'hidden flex-1 items-center justify-center gap-1 lg:flex';
  const navLinkBase =
    'inline-flex h-8 items-center gap-2 rounded-xs px-3 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary';
  const navLinkActive = 'text-text-primary font-semibold';
  const navLinkPill =
    'border border-border bg-bg-secondary text-text-primary hover:border-brand/40';
  const dropdownBase =
    'absolute left-0 top-full mt-2 w-56 max-w-sm rounded-sm border border-border bg-bg-secondary p-1 shadow-lg';
  const dropdownItem =
    'flex w-full items-center gap-2 rounded-xs px-3 py-2 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary';
  const dropdownDivider = 'my-1 h-px w-full bg-border';
  const iconBtn =
    'relative inline-flex h-9 w-9 items-center justify-center rounded-xs border border-transparent text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary';
  const pillBtn =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1.5 text-sm font-medium text-text-primary transition-colors duration-150 hover:border-brand/40 hover:bg-bg-tertiary';

  return (
    <nav
      className={`${navBase} ${transparentOnTop && isAtTop ? navTransparent : ''}`.trim()}
      style={{ top: 'var(--ann-banner-height, 0px)' }}
    >
      <div className={navInner}>

        {/* ── Logo ─────────────────────────────────── */}
        <button
          type="button"
          className="flex h-full items-center"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          <Logo size="medium" src={logoSrc} />
        </button>

        {/* ── Desktop nav links ────────────────────── */}
        <div className={navLinks}>
          {visibleDesktopLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className={`${navLinkBase} ${isActive(link.path) ? navLinkActive : ''}`.trim()}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              <link.icon size={15} />
              <span>{link.label}</span>
            </button>
          ))}

          {/* More dropdown */}
          {overflowDesktopLinks.length > 0 && (
            <div
              className="relative inline-flex"
              ref={moreMenuRef}
              onMouseEnter={() => openMenu(moreCloseTimerRef, setMoreMenuOpen)}
              onMouseLeave={() => scheduleClose(moreCloseTimerRef, setMoreMenuOpen)}
              onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMoreMenuOpen(false); }}
            >
              <button
                type="button"
                className={navLinkBase}
                onClick={() => setMoreMenuOpen((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={moreMenuOpen}
                aria-controls={MENU_IDS.more}
                onKeyDown={(e) => handleEscape(e, setMoreMenuOpen)}
              >
                <LuEllipsis size={15} />
                <span>More</span>
                <LuChevronDown size={13} />
              </button>

              {moreMenuOpen && (
                <div
                  className={dropdownBase}
                  id={MENU_IDS.more}
                  role="menu"
                  onMouseEnter={() => openMenu(moreCloseTimerRef, setMoreMenuOpen)}
                  onMouseLeave={() => scheduleClose(moreCloseTimerRef, setMoreMenuOpen)}
                >
                  {overflowDesktopLinks.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      className={`${dropdownItem} ${isActive(link.path) ? navLinkActive : ''}`.trim()}
                      role="menuitem"
                      onClick={() => { navigate(link.path); setMoreMenuOpen(false); }}
                    >
                      <link.icon size={15} />
                      <span>{link.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Student Learn dropdown */}
          {isStudent && (
            <div
              className="relative inline-flex"
              ref={studentMenuRef}
              onMouseEnter={() => openMenu(studentCloseTimerRef, setStudentLearnOpen)}
              onMouseLeave={() => scheduleClose(studentCloseTimerRef, setStudentLearnOpen)}
              onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setStudentLearnOpen(false); }}
            >
              <button
                type="button"
                className={`${navLinkBase} ${navLinkPill}`.trim()}
                onClick={() => setStudentLearnOpen((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={studentLearnOpen}
                aria-controls={MENU_IDS.student}
                onKeyDown={(e) => handleEscape(e, setStudentLearnOpen)}
              >
                <LuLayers size={15} />
                <span>Learn</span>
                <LuChevronDown size={13} />
              </button>

              {studentLearnOpen && (
                <div
                  className={dropdownBase}
                  id={MENU_IDS.student}
                  role="menu"
                  onMouseEnter={() => openMenu(studentCloseTimerRef, setStudentLearnOpen)}
                  onMouseLeave={() => scheduleClose(studentCloseTimerRef, setStudentLearnOpen)}
                >
                  {studentLearnLinks.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      className={`${dropdownItem} ${isActive(link.path) ? navLinkActive : ''}`.trim()}
                      role="menuitem"
                      onClick={() => navigate(link.path)}
                    >
                      <link.icon size={15} />
                      <span>{link.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right cluster ────────────────────────── */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* CP + streak stat chips */}
          {showStats && (
            <div className="hidden items-center gap-2 lg:flex">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary" title="Compromised Points">
                <img src={cpIcon} alt="CP" className="h-3.5 w-3.5" />
                <span>{cpTotal}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary" title="Learning streak">
                <IoFlameOutline size={14} />
                <span>{streakDays}d</span>
              </span>
            </div>
          )}

          {/* Notifications */}
          {isAuthenticated && (
            <div
              className="relative inline-flex"
              ref={notificationMenuRef}
              onMouseEnter={() => openMenu(notificationCloseTimerRef, setNotificationMenuOpen)}
              onMouseLeave={() => scheduleClose(notificationCloseTimerRef, setNotificationMenuOpen)}
              onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setNotificationMenuOpen(false); }}
            >
              <button
                type="button"
                className={iconBtn}
                onClick={() => setNotificationMenuOpen((p) => !p)}
                aria-label="Notifications"
                aria-haspopup="menu"
                aria-expanded={notificationMenuOpen}
                aria-controls={MENU_IDS.notifications}
                onKeyDown={(e) => handleEscape(e, setNotificationMenuOpen)}
              >
                <LuBell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-danger px-1 text-xs font-semibold text-ink-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationMenuOpen && (
                <div
                  className={`fixed left-4 right-4 top-16 max-h-screen overflow-y-auto rounded-sm border border-border bg-bg-secondary p-2 shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 sm:max-w-sm`}
                  id={MENU_IDS.notifications}
                  onMouseEnter={() => openMenu(notificationCloseTimerRef, setNotificationMenuOpen)}
                  onMouseLeave={() => scheduleClose(notificationCloseTimerRef, setNotificationMenuOpen)}
                >
                  <div className="flex items-center justify-between gap-3 px-2 pb-2">
                    <strong className="text-sm text-text-primary">Notifications</strong>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-xs font-medium text-text-secondary hover:text-text-primary"
                        onClick={async () => { await markAllRead(); }}
                      >
                        Mark all read
                      </button>
                      <button
                        type="button"
                        className="text-xs font-medium text-text-secondary hover:text-text-primary"
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
                    <p className="px-2 py-3 text-sm text-text-tertiary">No notifications yet.</p>
                  ) : (
                    notifications.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`flex w-full flex-col gap-1 rounded-xs px-3 py-2 text-left text-xs text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary ${item.read ? '' : 'bg-bg-tertiary/60 text-text-primary'}`}
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
          )}

          {/* Login button (public, desktop) */}
          {!isAuthenticated && !isAuthPage && viewportMode === 'desktop' && (
            <>
              <button
                type="button"
                className={pillBtn}
                onClick={() => openAuthModal('login')}
              >
                Login
              </button>
            </>
          )}

          {/* User menu (authenticated, desktop) */}
          {isAuthenticated && user && (
            <div
              className="relative inline-flex"
              ref={userMenuRef}
              onMouseEnter={() => openMenu(userCloseTimerRef, setUserMenuOpen)}
              onMouseLeave={() => scheduleClose(userCloseTimerRef, setUserMenuOpen)}
              onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setUserMenuOpen(false); }}
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2 py-1.5 text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary"
                onClick={() => setUserMenuOpen((p) => !p)}
                aria-label="Open user menu"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                onKeyDown={(e) => handleEscape(e, setUserMenuOpen)}
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-tertiary">
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    onError={(e) => {
                      if (e.currentTarget.src !== avatarFallback) e.currentTarget.src = avatarFallback;
                    }}
                    className="h-full w-full object-cover"
                  />
                </span>
                <LuChevronDown size={13} className="text-text-tertiary" />
              </button>

              {userMenuOpen && (
                <div
                  className={`${dropdownBase} left-auto right-0 origin-top-right`}
                  role="menu"
                  onMouseEnter={() => openMenu(userCloseTimerRef, setUserMenuOpen)}
                  onMouseLeave={() => scheduleClose(userCloseTimerRef, setUserMenuOpen)}
                >
                  {/* Header */}
                  <div className="px-3 py-2">
                    <p className="text-xs uppercase tracking-widest text-text-tertiary">Signed in as</p>
                    <p className="text-sm text-text-primary">{user.email}</p>
                  </div>

                  <div className={dropdownDivider} />

                  <button
                    type="button"
                    className={dropdownItem}
                    role="menuitem"
                    onClick={() => navigate('/settings')}
                  >
                    <LuShield size={15} />
                    <span>Profile</span>
                  </button>

                  <div className={dropdownDivider} />

                  <button
                    type="button"
                    className={`${dropdownItem} text-status-danger hover:text-status-danger`}
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LuLogOut size={15} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger (mobile) */}
          {viewportMode === 'mobile' && (
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xs border border-border bg-bg-secondary text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary lg:hidden"
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls={MENU_IDS.mobile}
            >
              {mobileMenuOpen ? <LuX size={18} /> : <LuMenu size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────── */}
      {viewportMode === 'mobile' && mobileMenuOpen && (
        <div className="fixed left-0 right-0 top-16 z-40 border-b border-border bg-bg-secondary" id={MENU_IDS.mobile}>
          <div className="flex max-h-screen flex-col gap-4 overflow-y-auto px-4 py-4">

            {/* Primary section */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xs border border-border bg-bg-tertiary px-3 py-2 text-xs uppercase tracking-widest text-text-tertiary"
                onClick={() => setMobileSectionsOpen((p) => ({ ...p, primary: !p.primary }))}
                aria-expanded={mobileSectionsOpen.primary}
              >
                <span>Primary</span>
                <LuChevronDown size={15} />
              </button>
              {mobileSectionsOpen.primary && (
                <div className="flex flex-col gap-1">
                  {mobileSections.primary.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      className={`flex w-full items-center gap-2 rounded-xs px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary ${
                        isActive(link.path) ? 'bg-bg-tertiary text-text-primary' : ''
                      }`}
                      onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                    >
                      <link.icon size={16} />
                      <span>{link.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Learning section (student) */}
            {isStudent && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xs border border-border bg-bg-tertiary px-3 py-2 text-xs uppercase tracking-widest text-text-tertiary"
                  onClick={() => setMobileSectionsOpen((p) => ({ ...p, learning: !p.learning }))}
                  aria-expanded={mobileSectionsOpen.learning}
                >
                  <span>Learning</span>
                  <LuChevronDown size={15} />
                </button>
                {mobileSectionsOpen.learning && (
                  <div className="flex flex-col gap-1">
                    {mobileSections.learning.map((link) => (
                      <button
                        key={link.path}
                        type="button"
                        className={`flex w-full items-center gap-2 rounded-xs px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary ${
                          isActive(link.path) ? 'bg-bg-tertiary text-text-primary' : ''
                        }`}
                        onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                      >
                        <link.icon size={16} />
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Utilities section (student) */}
            {isStudent && mobileSections.secondary.length > 0 && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xs border border-border bg-bg-tertiary px-3 py-2 text-xs uppercase tracking-widest text-text-tertiary"
                  onClick={() => setMobileSectionsOpen((p) => ({ ...p, secondary: !p.secondary }))}
                  aria-expanded={mobileSectionsOpen.secondary}
                >
                  <span>Utilities</span>
                  <LuChevronDown size={15} />
                </button>
                {mobileSectionsOpen.secondary && (
                  <div className="flex flex-col gap-1">
                    {mobileSections.secondary.map((link) => (
                      <button
                        key={link.path}
                        type="button"
                        className={`flex w-full items-center gap-2 rounded-xs px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary ${
                          isActive(link.path) ? 'bg-bg-tertiary text-text-primary' : ''
                        }`}
                        onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                      >
                        <link.icon size={16} />
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="h-px w-full bg-border" />

            {/* Auth row */}
            {isAuthenticated ? (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-sm text-status-danger hover:bg-bg-tertiary"
                onClick={handleLogout}
              >
                <LuLogOut size={16} />
                <span>Sign out</span>
              </button>
            ) : !isAuthPage ? (
              <>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                  onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                >
                  <LuLogIn size={16} />
                  <span>Login</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* ── Mobile action dock (unauthenticated, menu closed) ── */}
      {viewportMode === 'mobile' && !isAuthenticated && !mobileMenuOpen && !isAuthPage && (
        <div className="fixed bottom-4 left-4 right-4 z-30" role="navigation" aria-label="Quick actions">
          <button
            type="button"
            className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm font-semibold text-text-primary shadow-lg"
            onClick={() => openAuthModal('login')}
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
