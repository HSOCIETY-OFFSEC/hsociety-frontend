/**
 * Navigation Configuration
 * Centralized nav links used by Navbar and Sidebar.
 * Location: src/config/navigation/navigation.config.js
 */

import {
  LuChartBar,
  LuBriefcase,
  LuBell,
  LuCreditCard,
  LuFileText,
  LuMessageCircle,
  LuShield,
  LuWrench,
  LuUsers,
  LuCode,
  LuBookOpen,
  LuLayers,
  LuDollarSign,
  LuCpu,
  LuTrophy
} from 'react-icons/lu';

export const NAV_LINKS = {
  /** Authenticated workspace nav (sidebar) */
  workspace: {
    corporate: [
      { path: '/corporate-dashboard', label: 'Dashboard', icon: LuChartBar },
      { path: '/engagements', label: 'Engagements', icon: LuShield },
      { path: '/reports', label: 'Reports', icon: LuFileText },
      { path: '/remediation', label: 'Vulnerabilities', icon: LuWrench },
      { path: '/assets', label: 'Assets', icon: LuLayers },
      { path: '/billing', label: 'Billing', icon: LuCreditCard },
      { path: '/notifications', label: 'Notifications', icon: LuBell }
    ],
    pentester: [
      { path: '/pentester', label: 'Overview', icon: LuChartBar },
      { path: '/pentester/engagements', label: 'Engagements', icon: LuShield },
      { path: '/pentester/reports', label: 'Reports', icon: LuFileText },
      { path: '/pentester/profiles', label: 'Pentester Profiles', icon: LuUsers },
      { path: '/notifications', label: 'Notifications', icon: LuBell },
      { path: '/community', label: 'Community', icon: LuMessageCircle },
      { path: '/settings', label: 'Settings', icon: LuUsers }
    ],
    admin: [
      { path: '/mr-robot', label: 'Mr. Robot', icon: LuCpu },
      { path: '/notifications', label: 'Notifications', icon: LuBell },
      { path: '/community', label: 'Community', icon: LuMessageCircle },
      { path: '/settings', label: 'Settings', icon: LuUsers }
    ],
    student: [
      { path: '/student-dashboard', label: 'Dashboard', icon: LuBookOpen, group: 'default' },
      { path: '/student-bootcamps', label: 'Bootcamp', icon: LuLayers, group: 'default' },
      { path: '/student-resources', label: 'Resources', icon: LuBookOpen, group: 'default' },
      { path: '/student-payments', label: 'Payments', icon: LuCreditCard, group: 'default' },
      { path: '/notifications', label: 'Notifications', icon: LuBell, group: 'default' },
      { path: '/community', label: 'Community', icon: LuMessageCircle, group: 'default' }
    ]
  },

  /** Public pages */
  public: [
    { path: '/', label: 'Home', icon: LuShield },
    { path: '/courses', label: 'Courses', icon: LuBookOpen },
    { path: '/services', label: 'Services', icon: LuWrench },
    { path: '/cp-points', label: 'CP Points', icon: LuTrophy },
    { path: '/leaderboard', label: 'Leaderboard', icon: LuChartBar },
    { path: '/about', label: 'About', icon: LuUsers },
    { path: '/pricing', label: 'Pricing', icon: LuDollarSign },
    { path: '/terms', label: 'Terms', icon: LuFileText }
  ],

  /** Desktop quick links when authenticated */
  desktopAuth: {
    corporate: [
      { path: '/', label: 'Home', icon: LuShield },
      { path: '/corporate-dashboard', label: 'Overview', icon: LuChartBar },
      { path: '/engagements', label: 'Engagements', icon: LuShield },
      { path: '/reports', label: 'Reports', icon: LuFileText },
      { path: '/remediation', label: 'Remediation', icon: LuWrench },
      { path: '/assets', label: 'Assets', icon: LuLayers },
      { path: '/billing', label: 'Billing', icon: LuCreditCard },
      { path: '/notifications', label: 'Notifications', icon: LuBell },
      { path: '/cp-points', label: 'CP Points', icon: LuTrophy },
      { path: '/leaderboard', label: 'Leaderboard', icon: LuChartBar },
      { path: '/about', label: 'About Us', icon: LuUsers },
      { path: '/team', label: 'Meet the Team', icon: LuUsers },
      { path: '/developer', label: 'Meet the Developer', icon: LuCode },
      { path: '/pricing', label: 'Pricing', icon: LuDollarSign },
      { path: '/terms', label: 'Terms', icon: LuFileText }
    ],
    pentester: [
      { path: '/', label: 'Home', icon: LuShield },
      { path: '/pentester', label: 'Overview', icon: LuChartBar },
      { path: '/pentester/engagements', label: 'Engagements', icon: LuShield },
      { path: '/pentester/reports', label: 'Reports', icon: LuFileText },
      { path: '/pentester/profiles', label: 'Pentester Profiles', icon: LuUsers },
      { path: '/notifications', label: 'Notifications', icon: LuBell },
      { path: '/cp-points', label: 'CP Points', icon: LuTrophy },
      { path: '/leaderboard', label: 'Leaderboard', icon: LuChartBar },
      { path: '/settings', label: 'Settings', icon: LuUsers },
      { path: '/pricing', label: 'Pricing', icon: LuDollarSign },
      { path: '/terms', label: 'Terms', icon: LuFileText }
    ],
    admin: [
      { path: '/', label: 'Home', icon: LuShield },
      { path: '/mr-robot', label: 'Mr. Robot', icon: LuCpu },
      { path: '/notifications', label: 'Notifications', icon: LuBell },
      { path: '/cp-points', label: 'CP Points', icon: LuTrophy },
      { path: '/leaderboard', label: 'Leaderboard', icon: LuChartBar },
      { path: '/settings', label: 'Settings', icon: LuUsers },
      { path: '/pricing', label: 'Pricing', icon: LuDollarSign },
      { path: '/terms', label: 'Terms', icon: LuFileText }
    ],
    student: [
      { path: '/', label: 'Home', icon: LuShield },
      { path: '/student-dashboard', label: 'Dashboard', icon: LuBookOpen, group: 'default' },
      { path: '/student-bootcamps', label: 'Bootcamp', icon: LuLayers, group: 'learn' },
      { path: '/student-resources', label: 'Resources', icon: LuBookOpen, group: 'learn' },
      { path: '/student-payments', label: 'Payments', icon: LuCreditCard, group: 'learn' },
      { path: '/community', label: 'Community', icon: LuMessageCircle, group: 'learn' },
      { path: '/notifications', label: 'Notifications', icon: LuBell },
      { path: '/cp-points', label: 'CP Points', icon: LuTrophy },
      { path: '/leaderboard', label: 'Leaderboard', icon: LuChartBar },
      { path: '/settings', label: 'Settings', icon: LuUsers },
      { path: '/pricing', label: 'Pricing', icon: LuDollarSign },
      { path: '/terms', label: 'Terms', icon: LuFileText }
    ]
  },

  /** Desktop quick links when not authenticated */
  desktopPublic: [
    { path: '/', label: 'Home', icon: LuShield },
    { path: '/courses', label: 'Courses', icon: LuBookOpen },
    { path: '/services', label: 'Services', icon: LuWrench },
    { path: '/cp-points', label: 'CP Points', icon: LuTrophy },
    { path: '/leaderboard', label: 'Leaderboard', icon: LuChartBar },
    { path: '/about', label: 'About', icon: LuUsers },
    { path: '/careers', label: 'Careers', icon: LuBriefcase },
    { path: '/pricing', label: 'Pricing', icon: LuDollarSign },
    { path: '/terms', label: 'Terms', icon: LuFileText }
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
  return NAV_LINKS.workspace[normalizedRole] || NAV_LINKS.public;
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
