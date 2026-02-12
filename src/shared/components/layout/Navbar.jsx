import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../ui/Button';

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

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/pentest', label: 'Pentest', icon: '🔒' },
    { path: '/audits', label: 'Audits', icon: '📋' },
    { path: '/feedback', label: 'Feedback', icon: '💬' }
  ];

  const isActive = (path) => location.pathname === path;

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
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Logo size="medium" />
        </div>

        {/* Desktop Navigation */}
        {isAuthenticated && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            '@media (max-width: 768px)': {
              display: 'none'
            }
          }} className="desktop-nav">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1rem',
                  background: isActive(link.path) ? 'var(--primary-color-alpha)' : 'transparent',
                  color: isActive(link.path) ? 'var(--primary-color)' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: isActive(link.path) ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.background = 'var(--input-bg)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Right Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Theme Toggle */}
          <ThemeToggle />

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
                <span style={{ fontSize: '0.7rem' }}>▼</span>
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
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
              className="mobile-menu-button"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && mobileMenuOpen && (
        <div style={{
          borderTop: '1px solid var(--border-color)',
          padding: '1rem',
          background: 'var(--card-bg)'
        }} className="mobile-menu">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map(link => (
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
                <span style={{ fontSize: '1.25rem' }}>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}

            <div style={{
              height: '1px',
              background: 'var(--border-color)',
              margin: '0.5rem 0'
            }} />

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
              <span style={{ fontSize: '1.25rem' }}>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
          .desktop-user-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;