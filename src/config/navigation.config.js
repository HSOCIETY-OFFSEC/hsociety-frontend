/**
 * Navigation Configuration
 * Centralized nav links used by Navbar and Sidebar.
 * Location: src/config/navigation.config.js
 */

import {
  FiBarChart2,
  FiBriefcase,
  FiCreditCard,
  FiFileText,
  FiMessageSquare,
  FiShield,
  FiTool,
  FiUsers,
  FiCode,
  FiBookOpen,
  FiLayers,
  FiTerminal
} from 'react-icons/fi';
import { FiCpu } from 'react-icons/fi';

export const NAV_LINKS = {
  /** Authenticated workspace nav (sidebar) */
  workspace: {
    corporate: [
      { path: '/corporate-dashboard', label: 'Dashboard', icon: FiBarChart2 },
      { path: '/engagements', label: 'Engagements', icon: FiShield },
      { path: '/reports', label: 'Reports', icon: FiFileText },
      { path: '/remediation', label: 'Remediation', icon: FiTool },
      { path: '/assets', label: 'Assets', icon: FiLayers },
      { path: '/billing', label: 'Billing', icon: FiCreditCard }
    ],
    pentester: [
      { path: '/pentester', label: 'Assignments', icon: FiShield },
      { path: '/pentest', label: 'Pentest', icon: FiBarChart2 },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ],
    admin: [
      { path: '/mr-robot', label: 'Mr. Robot', icon: FiCpu },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ],
    student: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/student-dashboard', label: 'Dashboard', icon: FiBookOpen },
      { path: '/student-learning', label: 'Learn', icon: FiTerminal },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ]
  },

  /** Public pages */
  public: [
    { path: '/', label: 'Home', icon: FiShield },
    { path: '/about', label: 'About Us', icon: FiUsers },
    { path: '/team', label: 'Meet the Team', icon: FiUsers },
    { path: '/developer', label: 'Meet the Developer', icon: FiCode },
    { path: '/student-dashboard', label: 'Student Dashboard', icon: FiBookOpen },
    { path: '/careers', label: 'Careers', icon: FiBriefcase },
    { path: '/methodology', label: 'Methodology', icon: FiShield },
    { path: '/case-studies', label: 'Case Studies', icon: FiFileText },
    { path: '/blog', label: 'Field Notes', icon: FiMessageSquare }
  ],

  /** Desktop quick links when authenticated */
  desktopAuth: {
    corporate: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/corporate-dashboard', label: 'Dashboard', icon: FiBarChart2 },
      { path: '/engagements', label: 'Engagements', icon: FiShield },
      { path: '/reports', label: 'Reports', icon: FiFileText },
      { path: '/remediation', label: 'Remediation', icon: FiTool },
      { path: '/assets', label: 'Assets', icon: FiLayers },
      { path: '/billing', label: 'Billing', icon: FiCreditCard },
      { path: '/about', label: 'About Us', icon: FiUsers },
      { path: '/team', label: 'Meet the Team', icon: FiUsers },
      { path: '/developer', label: 'Meet the Developer', icon: FiCode }
    ],
    pentester: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/pentester', label: 'Assignments', icon: FiBarChart2 },
      { path: '/pentest', label: 'Pentest', icon: FiShield },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ],
    admin: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/mr-robot', label: 'Mr. Robot', icon: FiCpu },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ],
    student: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/student-dashboard', label: 'Dashboard', icon: FiBookOpen },
      { path: '/student-learning', label: 'Learn', icon: FiTerminal },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ]
  },

  /** Desktop quick links when not authenticated */
  desktopPublic: [
    { path: '/', label: 'Home', icon: FiShield },
    { path: '/about', label: 'About', icon: FiUsers },
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

const normalizeRole = (role) => {
  if (role === 'client') return 'corporate';
  return role;
};

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
