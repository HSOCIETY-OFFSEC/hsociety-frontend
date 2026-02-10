// src/shared/components/layout/Navbar.jsx

/**
 * Navbar Component
 * Main navigation bar with authentication-aware menu
 */

import { Link, useNavigate } from 'react-router-dom';
import { HiHome, HiViewGrid, HiLogin, HiUserAdd, HiLogout } from 'react-icons/hi';
import { useAuth } from '../../../modules/auth/context/AuthContext';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import './layout.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Logo className="logo" />
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            <HiHome size={18} />
            <span>Home</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <HiViewGrid size={18} />
                <span>Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="nav-link nav-button">
                <HiLogout size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <HiLogin size={18} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="nav-link">
                <HiUserAdd size={18} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated && user && (
            <div className="navbar-user">
              <span className="user-name">{user.name}</span>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;