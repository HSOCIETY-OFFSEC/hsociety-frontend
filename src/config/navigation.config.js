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
  FiCheckCircle,
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
      { path: '/corporate-dashboard', label: 'Overview', icon: FiBarChart2 },
      { path: '/engagements', label: 'Engagements', icon: FiShield },
      { path: '/reports', label: 'Reports', icon: FiFileText },
      { path: '/remediation', label: 'Remediation', icon: FiTool },
      { path: '/assets', label: 'Assets', icon: FiLayers },
      { path: '/billing', label: 'Billing', icon: FiCreditCard },
      { path: '/community', label: 'Community', icon: FiMessageSquare }
    ],
    pentester: [
      { path: '/pentester', label: 'Overview', icon: FiBarChart2 },
      { path: '/pentester/engagements', label: 'Engagements', icon: FiShield },
      { path: '/pentester/reports', label: 'Reports', icon: FiFileText },
      { path: '/pentester/profiles', label: 'Pentester Profiles', icon: FiUsers },
      { path: '/community', label: 'Community', icon: FiMessageSquare },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ],
    admin: [
      { path: '/mr-robot', label: 'Mr. Robot', icon: FiCpu },
      { path: '/community', label: 'Community', icon: FiMessageSquare },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ],
    student: [
      { path: '/', label: 'Home', icon: FiShield, group: 'default' },
      { path: '/student-dashboard', label: 'Overview', icon: FiBookOpen, group: 'bootcamp' },
      { path: '/student-learning', label: 'Learn', icon: FiTerminal, group: 'bootcamp' },
      { path: '/student-resources', label: 'Resources', icon: FiBookOpen, group: 'bootcamp' },
      { path: '/student-quiz-material', label: 'Quiz Material', icon: FiCheckCircle, group: 'bootcamp' },
      { path: '/student-bootcamp', label: 'Bootcamp', icon: FiLayers, group: 'bootcamp' },
      { path: '/student-payments', label: 'Payments', icon: FiCreditCard, group: 'bootcamp' },
      { path: '/community', label: 'Community', icon: FiMessageSquare, group: 'default' },
      { path: '/settings', label: 'Settings', icon: FiUsers, group: 'default' }
    ]
  },

  /** Public pages */
  public: [
    { path: '/', label: 'Home', icon: FiShield },
    { path: '/services', label: 'Services', icon: FiTool },
    { path: '/about', label: 'About', icon: FiUsers }
  ],

  /** Desktop quick links when authenticated */
  desktopAuth: {
    corporate: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/corporate-dashboard', label: 'Overview', icon: FiBarChart2 },
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
      { path: '/pentester', label: 'Overview', icon: FiBarChart2 },
      { path: '/pentester/engagements', label: 'Engagements', icon: FiShield },
      { path: '/pentester/reports', label: 'Reports', icon: FiFileText },
      { path: '/pentester/profiles', label: 'Pentester Profiles', icon: FiUsers },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ],
    admin: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/mr-robot', label: 'Mr. Robot', icon: FiCpu },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ],
    student: [
      { path: '/', label: 'Home', icon: FiShield },
      { path: '/student-dashboard', label: 'Overview', icon: FiBookOpen, group: 'bootcamp' },
      { path: '/student-learning', label: 'Learn', icon: FiTerminal, group: 'bootcamp' },
      { path: '/student-resources', label: 'Resources', icon: FiBookOpen, group: 'bootcamp' },
      { path: '/student-quiz-material', label: 'Quiz Material', icon: FiCheckCircle, group: 'bootcamp' },
      { path: '/student-bootcamp', label: 'Bootcamp', icon: FiLayers, group: 'bootcamp' },
      { path: '/student-payments', label: 'Payments', icon: FiCreditCard, group: 'bootcamp' },
      { path: '/settings', label: 'Settings', icon: FiUsers }
    ]
  },

  /** Desktop quick links when not authenticated */
  desktopPublic: [
    { path: '/', label: 'Home', icon: FiShield },
    { path: '/services', label: 'Services', icon: FiTool },
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
