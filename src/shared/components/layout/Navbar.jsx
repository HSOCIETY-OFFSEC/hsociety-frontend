import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiBookOpen,
  FiCheckCircle,
  FiChevronDown,
  FiCreditCard,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiMoreHorizontal,
  FiShield,
  FiTerminal,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import { getMobileLinks, getDesktopLinks } from '../../../config/navigation.config';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import { getGithubAvatarDataUri } from '../../utils/avatar';
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
  const moreMenuRef = useRef(null);
  const [viewportMode, setViewportMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= NAV_COLLAPSE_WIDTH ? 'mobile' : 'desktop'
  );

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
  const mobileLinks = getMobileLinks(isAuthenticated, role);
  const desktopBasicLinks = getDesktopLinks(isAuthenticated, role);
  const studentLearnLinks = useMemo(
    () => [
      { path: '/student-learning', label: 'Learning Path', icon: FiTerminal },
      { path: '/student-quiz-material', label: 'Quiz Material', icon: FiCheckCircle },
      { path: '/student-resources', label: 'Resources', icon: FiBookOpen },
      { path: '/student-bootcamp', label: 'Bootcamp', icon: FiLayers },
      { path: '/student-payments', label: 'Payments', icon: FiCreditCard }
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
            <div className="navbar-more-dropdown" ref={moreMenuRef}>
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
            <div className="student-learn-dropdown">
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
          {/* Theme Toggle */}
          <span className="navbar-theme">
            <ThemeToggle />
          </span>

          {/* User Menu (Desktop) */}
          {isAuthenticated && user && (
            <div className="desktop-user-menu">
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
            )}
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
