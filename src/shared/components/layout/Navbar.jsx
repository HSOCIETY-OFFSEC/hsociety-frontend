import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiBookOpen,
  FiCheckCircle,
  FiChevronDown,
  FiCreditCard,
  FiBell,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiMoreHorizontal,
  FiShield,
  FiTerminal,
  FiX
} from 'react-icons/fi';
import { IoFlameOutline } from 'react-icons/io5';
import { useAuth } from '../../../core/auth/AuthContext';
import { getMobileLinks, getDesktopLinks } from '../../../config/navigation.config';
import { getProfile } from '../../../features/account/account.service';
import { getStudentXpSummary } from '../../../features/student/services/learn.service';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import SocialLinks from '../common/SocialLinks';
import { getGithubAvatarDataUri } from '../../utils/avatar';
import cpIcon from '../../../assets/icons/CP/cp-icon.png';
import { useNotifications } from '../../notifications/NotificationProvider';
import '../../../styles/shared/components/layout/Navbar.css';

const NAV_COLLAPSE_WIDTH = 1024;

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
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [studentLearnOpen, setStudentLearnOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [cpTotal, setCpTotal] = useState(0);
  const moreMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
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
  const mobileLinks = getMobileLinks(isAuthenticated, role);
  const desktopBasicLinks = getDesktopLinks(isAuthenticated, role);
  const studentLearnLinks = useMemo(
    () => [
      { path: '/student-learning', label: 'Overview', icon: FiTerminal },
      { path: '/student-bootcamps', label: 'Bootcamps', icon: FiLayers },
      { path: '/student-resources', label: 'Resources', icon: FiBookOpen },
      { path: '/student-quiz-material', label: 'Quiz Material', icon: FiCheckCircle },
      { path: '/student-payments', label: 'Payments', icon: FiCreditCard },
    ],
    []
  );
  const hiddenStudentNavPaths = useMemo(
    () => new Set(studentLearnLinks.map((link) => link.path)),
    [studentLearnLinks]
  );
  const desktopLinks = useMemo(() => {
    if (!isStudent) return desktopBasicLinks;
    return desktopBasicLinks.filter((link) => !hiddenStudentNavPaths.has(link.path));
  }, [desktopBasicLinks, hiddenStudentNavPaths, isStudent]);
  const maxDesktopLinks = isAuthenticated ? (isStudent ? 2 : 4) : 4;
  const visibleDesktopLinks = desktopLinks.slice(0, maxDesktopLinks);
  const overflowDesktopLinks = desktopLinks.slice(maxDesktopLinks);

  const isActive = (path) => location.pathname === path;

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

  useEffect(() => {
    let mounted = true;
    const loadCp = async () => {
      if (!showUserStats) {
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
  }, [showUserStats, user?.id]);

  useEffect(() => {
    let mounted = true;
    const loadStreak = async () => {
      if (!showUserStats || !isStudent) {
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
  }, [showUserStats, isStudent, user?.id]);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <Logo size="medium" />
        </div>

        {/* Desktop Basic Navigation */}
        <div className="desktop-nav">
          {visibleDesktopLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className={`desktop-nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              <link.icon size={16} />
              <span>{link.label}</span>
            </button>
          ))}

          {overflowDesktopLinks.length > 0 && (
            <div
              className="navbar-more-dropdown"
              ref={moreMenuRef}
              onMouseLeave={() => setMoreMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                className="desktop-nav-link navbar-more-trigger"
              >
                <FiMoreHorizontal size={16} />
                <span>More</span>
                <FiChevronDown size={14} />
              </button>
              {moreMenuOpen && (
                <div className="navbar-more-menu">
                  {overflowDesktopLinks.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      onClick={() => {
                        navigate(link.path);
                        setMoreMenuOpen(false);
                      }}
                      className={`navbar-more-item ${isActive(link.path) ? 'active' : ''}`}
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
              onMouseLeave={() => setStudentLearnOpen(false)}
            >
              <button
                type="button"
                onClick={() => setStudentLearnOpen((prev) => !prev)}
                className="desktop-nav-link student-learn-trigger"
              >
                <FiTerminal size={16} />
                <span>Learn</span>
                <FiChevronDown size={14} />
              </button>
              {studentLearnOpen && (
                <div className="student-learn-menu">
                  {studentLearnLinks.map((link) => (
                    <button
                      key={link.path}
                      type="button"
                      onClick={() => navigate(link.path)}
                      className={`student-learn-item ${isActive(link.path) ? 'active' : ''}`}
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
                <span>{cpTotal} CP</span>
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
              onMouseLeave={() => setNotificationMenuOpen(false)}
            >
              <button
                type="button"
                className="navbar-notification-btn"
                onClick={() => setNotificationMenuOpen((prev) => !prev)}
                aria-label="Notifications"
              >
                <FiBell size={16} />
                {unreadCount > 0 && (
                  <span className="navbar-notification-badge">{unreadCount}</span>
                )}
              </button>

              {notificationMenuOpen && (
                <div className="navbar-notification-menu">
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
              <SocialLinks className="navbar-socials" size={16} />
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="navbar-auth-button"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
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
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="navbar-user-button"
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
                  <FiChevronDown size={14} />
                </span>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="navbar-user-menu">
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
                  >
                    <span className="navbar-user-icon">
                      <FiShield size={16} />
                    </span>
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="navbar-user-logout"
                  >
                    <span className="navbar-user-icon">
                      <FiLogOut size={16} />
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
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {viewportMode === 'mobile' && mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-inner">
            {(isStudent ? mobileLinks.filter((link) => !hiddenStudentNavPaths.has(link.path)) : mobileLinks).map(link => (
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

            {isStudent && (
              <div className="mobile-menu-group">
                {studentLearnLinks.map((link) => (
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

            <div className="mobile-menu-divider" />

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="mobile-menu-logout"
              >
                <span className="mobile-menu-icon">
                  <FiLogOut size={18} />
                </span>
                <span>Logout</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-menu-login"
                >
                  <span className="mobile-menu-icon">
                    <FiShield size={18} />
                  </span>
                  <span>Login</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-menu-register"
                >
                  <span className="mobile-menu-icon">
                    <FiShield size={18} />
                  </span>
                  <span>Register</span>
                </button>
                <SocialLinks className="mobile-menu-socials" size={18} />
              </>
            )}
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
