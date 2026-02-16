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
  /** Authenticated workspace nav (sidebar) */
  workspace: {
    corporate: [
      { path: '/corporate-dashboard', label: 'Dashboard', icon: FiBarChart2 },
      { path: '/pentest', label: 'Pentest', icon: FiShield },
      { path: '/audits', label: 'Audits', icon: FiFileText },
      { path: '/feedback', label: 'Feedback', icon: FiMessageSquare }
    ],
    student: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/student-dashboard', label: 'Dashboard', icon: FiBookOpen },
      { path: '/student-learning', label: 'Learn', icon: FiTerminal },
      { path: '/community', label: 'Community', icon: FiMessageSquare },
      { path: '/feedback', label: 'Feedback', icon: FiMessageSquare },
      { path: '/about', label: 'About Us', icon: FiUsers }
    ]
  },

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
  desktopAuth: {
    corporate: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/corporate-dashboard', label: 'Dashboard', icon: FiBarChart2 },
      { path: '/pentest', label: 'Pentest', icon: FiShield },
      { path: '/audits', label: 'Audits', icon: FiFileText },
      { path: '/community', label: 'Community', icon: FiMessageSquare },
      { path: '/feedback', label: 'Feedback', icon: FiMessageSquare },
      { path: '/about', label: 'About Us', icon: FiUsers },
      { path: '/team', label: 'Meet the Team', icon: FiUsers },
      { path: '/developer', label: 'Meet the Developer', icon: FiCode }
    ],
    student: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/student-dashboard', label: 'Dashboard', icon: FiBookOpen },
      { path: '/student-learning', label: 'Learn', icon: FiTerminal },
      { path: '/community', label: 'Community', icon: FiMessageSquare },
      { path: '/feedback', label: 'Feedback', icon: FiMessageSquare },
      { path: '/about', label: 'About Us', icon: FiUsers }
    ]
  },

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

const normalizeRole = (role) => (role === 'client' ? 'corporate' : role);

/** Get mobile nav links based on auth state and role */
export const getMobileLinks = (isAuthenticated, role) => {
  if (!isAuthenticated) return NAV_LINKS.public;
  const normalizedRole = normalizeRole(role) || 'student';
  return dedupeLinks([...(NAV_LINKS.desktopAuth[normalizedRole] || [])]);
};

/** Get desktop nav links based on auth state and role */
export const getDesktopLinks = (isAuthenticated, role) => {
  if (!isAuthenticated) return NAV_LINKS.desktopPublic;
  const normalizedRole = normalizeRole(role) || 'student';
  return NAV_LINKS.desktopAuth[normalizedRole] || NAV_LINKS.desktopPublic;
};

/** Get full sidebar links */
export const getSidebarLinks = (isAuthenticated, role) => {
  if (!isAuthenticated) return NAV_LINKS.public;
  const normalizedRole = normalizeRole(role) || 'student';
  return NAV_LINKS.workspace[normalizedRole] || NAV_LINKS.public;
};
