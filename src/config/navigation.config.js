/**
 * Navigation Configuration
 * Centralized nav links used by Navbar and Sidebar.
 * Location: src/config/navigation.config.js
 */

import {
  FiBarChart2,
  FiBriefcase,
  FiFileText,
  FiMessageSquare,
  FiShield,
  FiUsers,
  FiCode,
  FiBookOpen,
  FiLayers,
  FiTerminal
} from 'react-icons/fi';

export const NAV_LINKS = {
  /** Authenticated user nav (Dashboard, Pentest, etc.) */
  app: [
    { path: '/dashboard', label: 'Dashboard', icon: FiBarChart2 },
    { path: '/pentest', label: 'Pentest', icon: FiShield },
    { path: '/audits', label: 'Audits', icon: FiFileText },
    { path: '/feedback', label: 'Feedback', icon: FiMessageSquare },
    { path: '/community', label: 'Community', icon: FiMessageSquare }
  ],

  /** Public pages */
  public: [
    { path: '/', label: 'Home', icon: FiShield },
    { path: '/about', label: 'About Us', icon: FiUsers },
    { path: '/team', label: 'Meet the Team', icon: FiUsers },
    { path: '/developer', label: 'Meet the Developer', icon: FiCode },
    { path: '/community', label: 'Community', icon: FiMessageSquare },
    { path: '/student-dashboard', label: 'Student Dashboard', icon: FiBookOpen },
    { path: '/careers', label: 'Careers', icon: FiBriefcase },
    { path: '/methodology', label: 'Methodology', icon: FiShield },
    { path: '/case-studies', label: 'Case Studies', icon: FiFileText },
    { path: '/blog', label: 'Field Notes', icon: FiMessageSquare },
    { path: '/feedback', label: 'Contact', icon: FiMessageSquare }
  ],

  /** Desktop quick links when authenticated */
  desktopAuth: [
    { path: '/dashboard', label: 'Dashboard', icon: FiBarChart2 },
    { path: '/community', label: 'Community', icon: FiMessageSquare },
    { path: '/feedback', label: 'Feedback', icon: FiMessageSquare }
  ],

  /** Desktop quick links when not authenticated */
  desktopPublic: [
    { path: '/', label: 'Home', icon: FiShield },
    { path: '/about', label: 'About', icon: FiUsers },
    { path: '/community', label: 'Community', icon: FiMessageSquare },
    { path: '/careers', label: 'Careers', icon: FiBriefcase }
  ]
};

/** Deduplicate links by path */
export const dedupeLinks = (links) =>
  links.reduce((acc, link) => {
    if (!acc.some((item) => item.path === link.path)) {
      acc.push(link);
    }
    return acc;
  }, []);

/** Get mobile nav links based on auth state */
export const getMobileLinks = (isAuthenticated) =>
  isAuthenticated
    ? dedupeLinks([
        ...NAV_LINKS.app,
        ...NAV_LINKS.public.filter((l) => l.path !== '/feedback')
      ])
    : NAV_LINKS.public;

/** Get desktop nav links based on auth state */
export const getDesktopLinks = (isAuthenticated) =>
  isAuthenticated ? NAV_LINKS.desktopAuth : NAV_LINKS.desktopPublic;

/** Get full sidebar links */
export const getSidebarLinks = (isAuthenticated) =>
  isAuthenticated
    ? dedupeLinks([...NAV_LINKS.app, ...NAV_LINKS.public])
    : NAV_LINKS.public;
