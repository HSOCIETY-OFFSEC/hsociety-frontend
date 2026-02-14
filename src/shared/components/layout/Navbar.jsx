import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiChevronDown, FiLogOut, FiMenu, FiShield, FiX } from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import { getMobileLinks, getDesktopLinks } from '../../../config/navigation.config';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';

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
  const [viewportMode, setViewportMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= 768 ? 'mobile' : 'desktop'
  );

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleResize = () => {
      const nextMode = window.innerWidth <= 768 ? 'mobile' : 'desktop';
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

  const mobileLinks = getMobileLinks(isAuthenticated);
  const desktopBasicLinks = getDesktopLinks(isAuthenticated);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Always reset transient nav UI when route changes.
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav style={{
      position: sticky ? 'sticky' : 'relative',
      top: sticky ? 0 : 'auto',
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
          {desktopBasicLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
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
                  fontWeight: 600
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
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
            {mobileLinks.map(link => (
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
        @media (max-width: 768px) {
          nav .container {
            height: auto !important;
            padding-top: 0.75rem !important;
            padding-bottom: 0.75rem !important;
            gap: 0.75rem !important;
            flex-direction: row !important;
            align-items: center !important;
            flex-wrap: nowrap !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .desktop-user-menu {
            display: none !important;
          }
          .navbar-logo {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
          }
          .navbar-right {
            margin-left: auto;
            gap: 0.5rem;
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
