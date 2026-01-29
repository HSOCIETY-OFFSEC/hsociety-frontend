import Logo from '../Logo';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';
import { HiHome, HiViewGrid, HiLogin, HiUserAdd } from 'react-icons/hi';

const Navbar = () => {
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
          <Link to="/dashboard" className="nav-link">
            <HiViewGrid size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/login" className="nav-link">
            <HiLogin size={18} />
            <span>Login</span>
          </Link>
          <Link to="/signup" className="nav-link">
            <HiUserAdd size={18} />
            <span>Sign Up</span>
          </Link>
        </div>

        <div className="navbar-actions">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;