import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LuBookOpen,
  LuChevronDown,
  LuCreditCard,
  LuBell,
  LuLayers,
  LuLogOut,
  LuMenu,
  LuEllipsis,
  LuMessageCircle,
  LuShield,
  LuX
} from 'react-icons/lu';
import { IoFlameOutline } from 'react-icons/io5';
import { useAuth } from '../../../core/auth/AuthContext';
import useAuthModal from '../../hooks/useAuthModal';
import { getMobileLinks, getDesktopLinks } from '../../../config/navigation.config';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import { getGithubAvatarDataUri } from '../../utils/avatar';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import { useNotifications } from '../../notifications/NotificationProvider';
import { useUserStats } from '../../hooks/useUserStats';
import '../../../styles/shared/components/layout/Navbar.css';

const NAV_COLLAPSE_WIDTH = 1024;
const MENU_IDS = {
  more: 'navbar-more-menu',
  student: 'navbar-student-menu',
  notifications: 'navbar-notifications',
  mobile: 'navbar-mobile-menu'
};

/**
 * Navbar Component
 * Location: src/shared/components/layout/Navbar.jsx
 * 
 * Features:
 * - Sticky header
 * - Logo with home navigation
 * - Theme toggle
 * - Navigation links (for authenticated users)
 * - User menu with logout
 * - Mobile responsive
 * - Active route highlighting
 */

const Navbar = ({ sticky = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openAuthModal } = useAuthModal();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [studentLearnOpen, setStudentLearnOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState({
    primary: true,
    learning: true,
    secondary: false
  });
  const moreMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const studentMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const moreCloseTimerRef = useRef(null);
  const studentCloseTimerRef = useRef(null);
  const userCloseTimerRef = useRef(null);
  const notificationCloseTimerRef = useRef(null);
  const [viewportMode, setViewportMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= NAV_COLLAPSE_WIDTH ? 'mobile' : 'desktop'
  );
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  } = useNotifications();

  const avatarFallback = useMemo(
    () => getGithubAvatarDataUri(user?.email || user?.name || 'user'),
    [user?.email, user?.name]
  );
  const avatarSrc = user?.avatarUrl || avatarFallback;

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleResize = () => {
      const nextMode = window.innerWidth <= NAV_COLLAPSE_WIDTH ? 'mobile' : 'desktop';
      setViewportMode((prevMode) => {
        if (prevMode !== nextMode) {
          setMobileMenuOpen(false);
          setUserMenuOpen(false);
          return nextMode;
        }
        return prevMode;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const role = user?.role === 'client' ? 'corporate' : user?.role;
  const isStudent = role === 'student';
  const showUserStats = isAuthenticated && Boolean(user?.id);
  const { cpTotal, streakDays } = useUserStats(user?.id, role);
  const mobileLinks = getMobileLinks(isAuthenticated, role);
  const desktopBasicLinks = getDesktopLinks(isAuthenticated, role);
  const studentLearnLinks = useMemo(
    () => [
      { path: '/student-bootcamps', label: 'Bootcamp', icon: LuLayers },
      { path: '/student-resources', label: 'Resources', icon: LuBookOpen },
      { path: '/student-payments', label: 'Payments', icon: LuCreditCard },
      { path: '/community', label: 'Community', icon: LuMessageCircle },
    ],
    []
  );
  const studentUtilityLinks = useMemo(
    () => [],
    []
  );
  const hiddenStudentNavPaths = useMemo(
    () => new Set(studentLearnLinks.map((link) => link.path)),
    [studentLearnLinks]
  );
  const roleOrder = useMemo(() => ({
    student: [
      '/student-dashboard',
      '/student-bootcamps/overview',
      '/student-bootcamps',
      '/student-resources',
      '/student-payments',
      '/community'
    ],
    corporate: [
      '/corporate-dashboard',
      '/engagements',
      '/reports',
      '/remediation',
      '/assets',
      '/billing',
      '/community',
      '/leaderboard',
      '/settings'
    ],
    pentester: [
      '/pentester',
      '/pentester/engagements',
      '/pentester/reports',
      '/pentester/profiles',
      '/community',
      '/leaderboard',
      '/settings'
    ],
    admin: [
      '/mr-robot',
      '/community',
      '/leaderboard',
      '/settings'
    ]
  }), []);

  const orderedDesktopLinks = useMemo(() => {
    const baseLinks = isStudent
      ? desktopBasicLinks.filter((link) => !hiddenStudentNavPaths.has(link.path))
      : desktopBasicLinks;
    const order = roleOrder[role] || [];
    return [...baseLinks].sort((a, b) => {
      const aIdx = order.indexOf(a.path);
      const bIdx = order.indexOf(b.path);
      if (aIdx === -1 && bIdx === -1) return 0;
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });
  }, [desktopBasicLinks, hiddenStudentNavPaths, isStudent, role, roleOrder]);

  // Keep desktop nav compact: no more than two buttons + dropdowns.
  const maxDesktopLinks = isAuthenticated ? (isStudent ? 1 : 2) : 4;
  const visibleDesktopLinks = orderedDesktopLinks.slice(0, maxDesktopLinks);
  const overflowDesktopLinks = orderedDesktopLinks.slice(maxDesktopLinks);

  const mobileSections = useMemo(() => {
    const primary = isStudent
      ? mobileLinks.filter((link) => !hiddenStudentNavPaths.has(link.path))
      : mobileLinks;
    const learning = isStudent ? studentLearnLinks : [];
    const secondary = isStudent ? studentUtilityLinks : [];
    return { primary, learning, secondary };
  }, [isStudent, mobileLinks, hiddenStudentNavPaths, studentLearnLinks, studentUtilityLinks]);

  const isActive = (path) => location.pathname === path;

  const clearCloseTimer = useCallback((ref) => {
    if (ref.current) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
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
    // Always reset transient nav UI when route changes.
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setStudentLearnOpen(false);
    setMoreMenuOpen(false);
    setNotificationMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!moreMenuOpen) return undefined;
    const handleOutsideClick = (event) => {
      if (!moreMenuRef.current || moreMenuRef.current.contains(event.target)) return;
      setMoreMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [moreMenuOpen]);

  useEffect(() => {
    if (!notificationMenuOpen) return undefined;
    const handleOutsideClick = (event) => {
      if (!notificationMenuRef.current || notificationMenuRef.current.contains(event.target)) return;
      setNotificationMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [notificationMenuOpen]);

  const handleEscape = (event, setter) => {
    if (event.key === 'Escape') setter(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <button
          type="button"
          className="navbar-logo"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          <Logo size="medium" />
        </button>

        {/* Desktop Basic Navigation */}
        <div className="desktop-nav">
          {visibleDesktopLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className={`desktop-nav-link ${isActive(link.path) ? 'active' : ''}`}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              <link.icon size={16} />
              <span>{link.label}</span>
            </button>
          ))}

          {overflowDesktopLinks.length > 0 && (
            <div
              className="navbar-more-dropdown"
              ref={moreMenuRef}
              onMouseEnter={() => openMenu(moreCloseTimerRef, setMoreMenuOpen)}
              onMouseLeave={() => scheduleClose(moreCloseTimerRef, setMoreMenuOpen)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setMoreMenuOpen(false);
                }
              }}
            >
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                className="desktop-nav-link navbar-more-trigger"
                aria-haspopup="menu"
                aria-expanded={moreMenuOpen}
                aria-controls={MENU_IDS.more}
                onKeyDown={(event) => handleEscape(event, setMoreMenuOpen)}
              >
                <LuEllipsis size={16} />
                <span>More</span>
                <LuChevronDown size={14} />
              </button>
              {moreMenuOpen && (
                <div
                  className="navbar-more-menu"
                  id={MENU_IDS.more}
                  role="menu"
                  onMouseEnter={() => openMenu(moreCloseTimerRef, setMoreMenuOpen)}
                  onMouseLeave={() => scheduleClose(moreCloseTimerRef, setMoreMenuOpen)}
                >
                  {overflowDesktopLinks.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      onClick={() => {
                        navigate(link.path);
                        setMoreMenuOpen(false);
                      }}
                      className={`navbar-more-item ${isActive(link.path) ? 'active' : ''}`}
                      role="menuitem"
                    >
                      <link.icon size={16} />
                      <span>{link.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {isStudent && (
            <div
              className="student-learn-dropdown"
              ref={studentMenuRef}
              onMouseEnter={() => openMenu(studentCloseTimerRef, setStudentLearnOpen)}
              onMouseLeave={() => scheduleClose(studentCloseTimerRef, setStudentLearnOpen)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setStudentLearnOpen(false);
                }
              }}
            >
              <button
                type="button"
                onClick={() => setStudentLearnOpen((prev) => !prev)}
                className="desktop-nav-link student-learn-trigger"
                aria-haspopup="menu"
                aria-expanded={studentLearnOpen}
                aria-controls={MENU_IDS.student}
                onKeyDown={(event) => handleEscape(event, setStudentLearnOpen)}
              >
                <LuLayers size={16} />
                <span>Learn</span>
                <LuChevronDown size={14} />
              </button>
              {studentLearnOpen && (
                <div
                  className="student-learn-menu"
                  id={MENU_IDS.student}
                  role="menu"
                  onMouseEnter={() => openMenu(studentCloseTimerRef, setStudentLearnOpen)}
                  onMouseLeave={() => scheduleClose(studentCloseTimerRef, setStudentLearnOpen)}
                >
                  {studentLearnLinks.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      onClick={() => navigate(link.path)}
                      className={`student-learn-item ${isActive(link.path) ? 'active' : ''}`}
                      role="menuitem"
                    >
                      <link.icon size={16} />
                      <span>{link.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {showUserStats && (
            <div className="navbar-landing-stats">
              <div className="navbar-stat-chip" title="Compromised Points">
                <img src={cpIcon} alt="CP" className="navbar-stat-icon" />
                <span>{cpTotal}</span>
              </div>
              <div className="navbar-stat-chip" title="Learning streak">
                <IoFlameOutline size={16} />
                <span>{streakDays} Streak</span>
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <span className="navbar-theme">
            <ThemeToggle />
          </span>

          {isAuthenticated && (
            <div
              className="navbar-notification-wrap"
              ref={notificationMenuRef}
              onMouseEnter={() => openMenu(notificationCloseTimerRef, setNotificationMenuOpen)}
              onMouseLeave={() => scheduleClose(notificationCloseTimerRef, setNotificationMenuOpen)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setNotificationMenuOpen(false);
                }
              }}
            >
              <button
                type="button"
                className="navbar-notification-btn"
                onClick={() => setNotificationMenuOpen((prev) => !prev)}
                aria-label="Notifications"
                aria-haspopup="menu"
                aria-expanded={notificationMenuOpen}
                aria-controls={MENU_IDS.notifications}
                onKeyDown={(event) => handleEscape(event, setNotificationMenuOpen)}
              >
                <LuBell size={16} />
                {unreadCount > 0 && (
                  <span className="navbar-notification-badge">{unreadCount}</span>
                )}
              </button>

              {notificationMenuOpen && (
                <div
                  className="navbar-notification-menu"
                  id={MENU_IDS.notifications}
                  onMouseEnter={() => openMenu(notificationCloseTimerRef, setNotificationMenuOpen)}
                  onMouseLeave={() => scheduleClose(notificationCloseTimerRef, setNotificationMenuOpen)}
                >
                  <div className="navbar-notification-head">
                    <strong>Notifications</strong>
                    <button
                      type="button"
                      onClick={async () => {
                        await markAllRead();
                      }}
                    >
                      Mark all read
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="navbar-notification-empty">No notifications yet.</p>
                  ) : (
                    notifications.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`navbar-notification-item ${item.read ? '' : 'unread'}`}
                        onClick={async () => {
                          await markRead(item.id);
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
          )}

          {/* Auth Actions (Desktop, Public) */}
          {!isAuthenticated && viewportMode === 'desktop' && (
            <div className="navbar-right-actions">
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="navbar-auth-button navbar-auth-primary"
              >
                Register
              </button>
            </div>
          )}

          {/* User Menu (Desktop) */}
          {isAuthenticated && user && (
            <div
              className="desktop-user-menu"
              ref={userMenuRef}
              onMouseEnter={() => openMenu(userCloseTimerRef, setUserMenuOpen)}
              onMouseLeave={() => scheduleClose(userCloseTimerRef, setUserMenuOpen)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setUserMenuOpen(false);
                }
              }}
            >
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="navbar-user-button"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                onKeyDown={(event) => handleEscape(event, setUserMenuOpen)}
              >
                <span className="navbar-user-avatar">
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className="navbar-user-avatar-img"
                    onError={(e) => {
                      if (e.currentTarget.src !== avatarFallback) {
                        e.currentTarget.src = avatarFallback;
                      }
                    }}
                  />
                </span>
                <span>{user.name || user.email}</span>
                <span className="navbar-user-chevron">
                  <LuChevronDown size={14} />
                </span>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div
                  className="navbar-user-menu"
                  role="menu"
                  onMouseEnter={() => openMenu(userCloseTimerRef, setUserMenuOpen)}
                  onMouseLeave={() => scheduleClose(userCloseTimerRef, setUserMenuOpen)}
                >
                  <div className="navbar-user-menu-header">
                    <p className="navbar-user-menu-label">
                      Signed in as
                    </p>
                    <p className="navbar-user-menu-email">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/settings')}
                    className="navbar-user-logout"
                    role="menuitem"
                  >
                    <span className="navbar-user-icon">
                      <LuShield size={16} />
                    </span>
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="navbar-user-logout"
                    role="menuitem"
                  >
                    <span className="navbar-user-icon">
                      <LuLogOut size={16} />
                    </span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {viewportMode === 'mobile' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-button"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls={MENU_IDS.mobile}
            >
              {mobileMenuOpen ? <LuX /> : <LuMenu />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {viewportMode === 'mobile' && mobileMenuOpen && (
        <div className="mobile-menu" id={MENU_IDS.mobile}>
          <div className="mobile-menu-inner">
            <div className="mobile-menu-section">
              <button
                type="button"
                className="mobile-menu-section-toggle"
                onClick={() => setMobileSectionsOpen((prev) => ({ ...prev, primary: !prev.primary }))}
                aria-expanded={mobileSectionsOpen.primary}
              >
                <span>Primary</span>
                <LuChevronDown size={16} />
              </button>
              {mobileSectionsOpen.primary && (
                <div className="mobile-menu-group">
                  {mobileSections.primary.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => {
                        navigate(link.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`mobile-menu-link ${isActive(link.path) ? 'active' : ''}`}
                    >
                      <span className="mobile-menu-icon">
                        <link.icon size={18} />
                      </span>
                      <span>{link.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isStudent && (
              <div className="mobile-menu-section">
                <button
                  type="button"
                  className="mobile-menu-section-toggle"
                  onClick={() => setMobileSectionsOpen((prev) => ({ ...prev, learning: !prev.learning }))}
                  aria-expanded={mobileSectionsOpen.learning}
                >
                  <span>Learning</span>
                  <LuChevronDown size={16} />
                </button>
                {mobileSectionsOpen.learning && (
                  <div className="mobile-menu-group">
                    {mobileSections.learning.map((link) => (
                      <button
                        key={link.path}
                        onClick={() => {
                          navigate(link.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`mobile-menu-link ${isActive(link.path) ? 'active' : ''}`}
                      >
                        <span className="mobile-menu-icon">
                          <link.icon size={18} />
                        </span>
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isStudent && mobileSections.secondary.length > 0 && (
              <div className="mobile-menu-section">
                <button
                  type="button"
                  className="mobile-menu-section-toggle"
                  onClick={() => setMobileSectionsOpen((prev) => ({ ...prev, secondary: !prev.secondary }))}
                  aria-expanded={mobileSectionsOpen.secondary}
                >
                  <span>Utilities</span>
                  <LuChevronDown size={16} />
                </button>
                {mobileSectionsOpen.secondary && (
                  <div className="mobile-menu-group">
                    {mobileSections.secondary.map((link) => (
                      <button
                        key={link.path}
                        onClick={() => {
                          navigate(link.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`mobile-menu-link ${isActive(link.path) ? 'active' : ''}`}
                      >
                        <span className="mobile-menu-icon">
                          <link.icon size={18} />
                        </span>
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mobile-menu-divider" />

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="mobile-menu-logout"
              >
                <span className="mobile-menu-icon">
                  <LuLogOut size={18} />
                </span>
                <span>Logout</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-menu-register"
                >
                  <span className="mobile-menu-icon">
                    <LuShield size={18} />
                  </span>
                  <span>Register</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
