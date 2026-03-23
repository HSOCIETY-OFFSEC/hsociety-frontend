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
import './Navbar.css';

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
    const shouldShowDock = viewportMode === 'mobile' && !isAuthenticated && !mobileMenuOpen;
    document.body.classList.toggle('has-auth-dock', shouldShowDock);
    return () => {
      document.body.classList.remove('has-auth-dock');
    };
  }, [viewportMode, isAuthenticated, mobileMenuOpen]);

  useEffect(() => {
    if (!transparentOnTop || typeof window === 'undefined') return undefined;
    const update = () => setIsAtTop(window.scrollY <= 2);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
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

  return (
    <nav className={`gh-nav${transparentOnTop && isAtTop ? ' gh-nav--transparent' : ''}`}>
      <div className="gh-nav-inner">

        {/* ── Logo ─────────────────────────────────── */}
        <button
          type="button"
          className="gh-nav-logo"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          <Logo size="large" src={logoSrc} />
        </button>

        {/* ── Desktop nav links ────────────────────── */}
        <div className="gh-nav-links">
          {visibleDesktopLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className={`gh-nav-link${isActive(link.path) ? ' is-active' : ''}`}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              <link.icon size={15} />
              <span>{link.label}</span>
            </button>
          ))}

          {/* More dropdown */}
          {overflowDesktopLinks.length > 0 && (
            <div
              className="gh-dropdown"
              ref={moreMenuRef}
              onMouseEnter={() => openMenu(moreCloseTimerRef, setMoreMenuOpen)}
              onMouseLeave={() => scheduleClose(moreCloseTimerRef, setMoreMenuOpen)}
              onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMoreMenuOpen(false); }}
            >
              <button
                type="button"
                className="gh-nav-link"
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
                  className="gh-dropdown-menu"
                  id={MENU_IDS.more}
                  role="menu"
                  onMouseEnter={() => openMenu(moreCloseTimerRef, setMoreMenuOpen)}
                  onMouseLeave={() => scheduleClose(moreCloseTimerRef, setMoreMenuOpen)}
                >
                  {overflowDesktopLinks.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      className={`gh-dropdown-item${isActive(link.path) ? ' is-active' : ''}`}
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
              className="gh-dropdown"
              ref={studentMenuRef}
              onMouseEnter={() => openMenu(studentCloseTimerRef, setStudentLearnOpen)}
              onMouseLeave={() => scheduleClose(studentCloseTimerRef, setStudentLearnOpen)}
              onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setStudentLearnOpen(false); }}
            >
              <button
                type="button"
                className="gh-nav-link gh-nav-link--pill"
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
                  className="gh-dropdown-menu"
                  id={MENU_IDS.student}
                  role="menu"
                  onMouseEnter={() => openMenu(studentCloseTimerRef, setStudentLearnOpen)}
                  onMouseLeave={() => scheduleClose(studentCloseTimerRef, setStudentLearnOpen)}
                >
                  {studentLearnLinks.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      className={`gh-dropdown-item${isActive(link.path) ? ' is-active' : ''}`}
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
        <div className="gh-nav-right">
          {/* CP + streak stat chips */}
          {showStats && (
            <div className="gh-stat-group">
              <span className="gh-stat-chip" title="Compromised Points">
                <img src={cpIcon} alt="CP" className="gh-stat-cp-icon" />
                <span>{cpTotal}</span>
              </span>
              <span className="gh-stat-chip" title="Learning streak">
                <IoFlameOutline size={14} />
                <span>{streakDays}d</span>
              </span>
            </div>
          )}

          {/* Notifications */}
          {isAuthenticated && (
            <div
              className="gh-dropdown"
              ref={notificationMenuRef}
              onMouseEnter={() => openMenu(notificationCloseTimerRef, setNotificationMenuOpen)}
              onMouseLeave={() => scheduleClose(notificationCloseTimerRef, setNotificationMenuOpen)}
              onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setNotificationMenuOpen(false); }}
            >
              <button
                type="button"
                className="gh-icon-btn"
                onClick={() => setNotificationMenuOpen((p) => !p)}
                aria-label="Notifications"
                aria-haspopup="menu"
                aria-expanded={notificationMenuOpen}
                aria-controls={MENU_IDS.notifications}
                onKeyDown={(e) => handleEscape(e, setNotificationMenuOpen)}
              >
                <LuBell size={16} />
                {unreadCount > 0 && (
                  <span className="gh-notif-badge">{unreadCount}</span>
                )}
              </button>

              {notificationMenuOpen && (
                <div
                  className="gh-dropdown-menu gh-notif-menu"
                  id={MENU_IDS.notifications}
                  onMouseEnter={() => openMenu(notificationCloseTimerRef, setNotificationMenuOpen)}
                  onMouseLeave={() => scheduleClose(notificationCloseTimerRef, setNotificationMenuOpen)}
                >
                  <div className="gh-notif-head">
                    <strong>Notifications</strong>
                    <div className="gh-notif-head-actions">
                      <button
                        type="button"
                        className="gh-notif-read-all"
                        onClick={async () => { await markAllRead(); }}
                      >
                        Mark all read
                      </button>
                      <button
                        type="button"
                        className="gh-notif-read-all"
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
                    <p className="gh-notif-empty">No notifications yet.</p>
                  ) : (
                    notifications.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`gh-notif-item${item.read ? '' : ' is-unread'}`}
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
          )}

          {/* Login button (public, desktop) */}
          {!isAuthenticated && !isAuthPage && viewportMode === 'desktop' && (
            <>
              <button
                type="button"
                className="gh-btn"
                onClick={() => openAuthModal('login')}
              >
                Login
              </button>
            </>
          )}

          {/* User menu (authenticated, desktop) */}
          {isAuthenticated && user && (
            <div
              className="gh-dropdown"
              ref={userMenuRef}
              onMouseEnter={() => openMenu(userCloseTimerRef, setUserMenuOpen)}
              onMouseLeave={() => scheduleClose(userCloseTimerRef, setUserMenuOpen)}
              onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setUserMenuOpen(false); }}
            >
              <button
                type="button"
                className="gh-user-btn"
                onClick={() => setUserMenuOpen((p) => !p)}
                aria-label="Open user menu"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                onKeyDown={(e) => handleEscape(e, setUserMenuOpen)}
              >
                <span className="gh-user-avatar">
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    onError={(e) => {
                      if (e.currentTarget.src !== avatarFallback) e.currentTarget.src = avatarFallback;
                    }}
                  />
                </span>
                <LuChevronDown size={13} className="gh-user-chevron" />
              </button>

              {userMenuOpen && (
                <div
                  className="gh-dropdown-menu gh-user-menu"
                  role="menu"
                  onMouseEnter={() => openMenu(userCloseTimerRef, setUserMenuOpen)}
                  onMouseLeave={() => scheduleClose(userCloseTimerRef, setUserMenuOpen)}
                >
                  {/* Header */}
                  <div className="gh-user-menu-header">
                    <p className="gh-user-menu-hint">Signed in as</p>
                    <p className="gh-user-menu-email">{user.email}</p>
                  </div>

                  <div className="gh-dropdown-divider" />

                  <button
                    type="button"
                    className="gh-dropdown-item"
                    role="menuitem"
                    onClick={() => navigate('/settings')}
                  >
                    <LuShield size={15} />
                    <span>Profile</span>
                  </button>

                  <div className="gh-dropdown-divider" />

                  <button
                    type="button"
                    className="gh-dropdown-item gh-dropdown-item--danger"
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
              className="gh-hamburger"
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
        <div className="gh-mobile-menu" id={MENU_IDS.mobile}>
          <div className="gh-mobile-menu-inner">

            {/* Primary section */}
            <div className="gh-mobile-section">
              <button
                type="button"
                className="gh-mobile-section-toggle"
                onClick={() => setMobileSectionsOpen((p) => ({ ...p, primary: !p.primary }))}
                aria-expanded={mobileSectionsOpen.primary}
              >
                <span>Primary</span>
                <LuChevronDown size={15} />
              </button>
              {mobileSectionsOpen.primary && (
                <div className="gh-mobile-group">
                  {mobileSections.primary.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      className={`gh-mobile-link${isActive(link.path) ? ' is-active' : ''}`}
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
              <div className="gh-mobile-section">
                <button
                  type="button"
                  className="gh-mobile-section-toggle"
                  onClick={() => setMobileSectionsOpen((p) => ({ ...p, learning: !p.learning }))}
                  aria-expanded={mobileSectionsOpen.learning}
                >
                  <span>Learning</span>
                  <LuChevronDown size={15} />
                </button>
                {mobileSectionsOpen.learning && (
                  <div className="gh-mobile-group">
                    {mobileSections.learning.map((link) => (
                      <button
                        key={link.path}
                        type="button"
                        className={`gh-mobile-link${isActive(link.path) ? ' is-active' : ''}`}
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
              <div className="gh-mobile-section">
                <button
                  type="button"
                  className="gh-mobile-section-toggle"
                  onClick={() => setMobileSectionsOpen((p) => ({ ...p, secondary: !p.secondary }))}
                  aria-expanded={mobileSectionsOpen.secondary}
                >
                  <span>Utilities</span>
                  <LuChevronDown size={15} />
                </button>
                {mobileSectionsOpen.secondary && (
                  <div className="gh-mobile-group">
                    {mobileSections.secondary.map((link) => (
                      <button
                        key={link.path}
                        type="button"
                        className={`gh-mobile-link${isActive(link.path) ? ' is-active' : ''}`}
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

            <div className="gh-mobile-divider" />

            {/* Auth row */}
            {isAuthenticated ? (
              <button
                type="button"
                className="gh-mobile-link gh-mobile-link--danger"
                onClick={handleLogout}
              >
                <LuLogOut size={16} />
                <span>Sign out</span>
              </button>
            ) : !isAuthPage ? (
              <>
                <button
                  type="button"
                  className="gh-mobile-link"
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
        <div className="gh-mobile-dock" role="navigation" aria-label="Quick actions">
          <button
            type="button"
            className="gh-mobile-dock-btn"
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
