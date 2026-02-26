import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiBookOpen,
  FiCheckCircle,
  FiChevronDown,
  FiCreditCard,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiShield,
  FiTerminal,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import { getMobileLinks, getDesktopLinks } from '../../../config/navigation.config';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import { getAvatarStyle } from '../../utils/avatar';

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
  const [viewportMode, setViewportMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= NAV_COLLAPSE_WIDTH ? 'mobile' : 'desktop'
  );

  const avatarStyle = useMemo(
    () => getAvatarStyle(user?.email || user?.name || 'user'),
    [user?.email, user?.name]
  );

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

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Always reset transient nav UI when route changes.
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setStudentLearnOpen(false);
  }, [location.pathname]);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)',
      background: 'var(--card-bg)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        gap: '2rem'
      }}>
        {/* Logo */}
        <div className="navbar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Logo size="medium" />
        </div>

        {/* Desktop Basic Navigation */}
        <div className="desktop-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          {desktopLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className="desktop-nav-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                minHeight: '44px',
                padding: '0.5rem 0.8rem',
                borderRadius: '9px',
                border: '1px solid transparent',
                background: isActive(link.path) ? 'var(--primary-color-alpha)' : 'transparent',
                color: isActive(link.path) ? 'var(--primary-color)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <link.icon size={16} />
              <span>{link.label}</span>
            </button>
          ))}

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
        <div className="navbar-right" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Theme Toggle */}
          <span className="navbar-theme">
            <ThemeToggle />
          </span>

          {/* User Menu (Desktop) */}
          {isAuthenticated && user && (
            <div style={{ position: 'relative' }} className="desktop-user-menu">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary-color)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  overflow: 'hidden',
                  ...(user?.avatarUrl ? {} : avatarStyle)
                }}>
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                  )}
                </span>
                <span>{user.name || user.email}</span>
                <span style={{ display: 'inline-flex' }}>
                  <FiChevronDown size={14} />
                </span>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  minWidth: '200px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 1000
                }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '0.5rem'
                  }}>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      marginBottom: '0.25rem'
                    }}>
                      Signed in as
                    </p>
                    <p style={{
                      fontSize: '0.95rem',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      margin: 0
                    }}>
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ef4444',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span style={{ display: 'inline-flex' }}>
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.625rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '1.5rem',
                cursor: 'pointer',
                borderRadius: '10px',
                minWidth: '44px',
                minHeight: '44px'
              }}
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
        <div style={{
          borderTop: '1px solid var(--border-color)',
          padding: '1rem',
          background: 'var(--card-bg)'
        }} className="mobile-menu">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(isStudent ? mobileLinks.filter((link) => !hiddenStudentNavPaths.has(link.path)) : mobileLinks).map(link => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  background: isActive(link.path) ? 'var(--primary-color-alpha)' : 'transparent',
                  color: isActive(link.path) ? 'var(--primary-color)' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: isActive(link.path) ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '1.25rem', display: 'inline-flex' }}>
                  <link.icon size={18} />
                </span>
                <span>{link.label}</span>
              </button>
            ))}

            {isStudent && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {studentLearnLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => {
                      navigate(link.path);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem 1rem',
                      background: isActive(link.path) ? 'var(--primary-color-alpha)' : 'transparent',
                      color: isActive(link.path) ? 'var(--primary-color)' : 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: isActive(link.path) ? 600 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', display: 'inline-flex' }}>
                      <link.icon size={18} />
                    </span>
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div style={{
              height: '1px',
              background: 'var(--border-color)',
              margin: '0.5rem 0'
            }} />

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '1.25rem', display: 'inline-flex' }}>
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '1.25rem', display: 'inline-flex' }}>
                  <FiShield size={18} />
                </span>
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style>{`
        nav .container {
          max-width: 100%;
          overflow: hidden;
        }
        .navbar-logo {
          min-width: 0;
          flex-shrink: 0;
        }
        .desktop-nav {
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          row-gap: 0.4rem;
          overflow: hidden;
        }
        .desktop-nav-link {
          white-space: nowrap;
          flex: 0 1 auto;
        }
        .student-learn-dropdown {
          position: relative;
        }
        .student-learn-trigger {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          min-height: 44px;
          padding: 0.5rem 0.8rem;
          border-radius: 9px;
          border: 1px solid var(--border-color);
          background: var(--input-bg);
          color: var(--text-primary);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .student-learn-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          min-width: 210px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          padding: 0.5rem;
          z-index: 1000;
        }
        .student-learn-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 0.75rem;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
        }
        .student-learn-item.active,
        .student-learn-item:hover {
          background: var(--primary-color-alpha);
          color: var(--primary-color);
        }
        .navbar-right {
          flex-shrink: 0;
          min-width: 0;
        }
        .mobile-menu {
          max-height: calc(100vh - 84px);
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        @media (max-width: 1200px) {
          nav .container {
            gap: 1rem !important;
          }
          .desktop-nav {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            scrollbar-width: thin;
            padding-bottom: 0.25rem;
          }
        }
        @media (max-width: ${NAV_COLLAPSE_WIDTH}px) {
          nav .container {
            height: auto !important;
            min-height: 72px;
            padding-top: 0.75rem !important;
            padding-bottom: 0.75rem !important;
            gap: 0.75rem !important;
            flex-direction: row !important;
            align-items: center !important;
            flex-wrap: nowrap !important;
          }
          .navbar-logo {
            flex: 1 1 auto;
          }
          .navbar-right {
            margin-left: auto;
            gap: 0.5rem;
            flex: 0 0 auto;
          }
          .mobile-menu-button {
            position: relative;
            z-index: 2;
          }
          .desktop-nav {
            display: none !important;
          }
          .desktop-user-menu {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          nav .container {
            display: flex;
            align-items: center;
          }
        }
        @media (max-width: 420px) {
          .navbar-logo .logo-image {
            height: 40px !important;
          }
          .navbar-right {
            gap: 0.4rem;
          }
        }
        @media (max-width: 640px) {
          .mobile-menu {
            padding-bottom: 1.5rem !important;
            max-height: calc(100vh - 76px);
          }
          .mobile-menu-button {
            min-width: 44px;
            min-height: 44px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
