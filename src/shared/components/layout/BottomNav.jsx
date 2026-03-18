import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LuBookOpen,
  LuCreditCard,
  LuHouse,
  LuLayers,
  LuMessageCircle,
  LuSettings,
  LuShield,
  LuUser,
} from 'react-icons/lu';
import './BottomNav.css';

const BottomNav = ({ links = [], profile = null }) => {
  if (!links.length && !profile) return null;

  const iconOverrides = {
    '/': LuHouse,
    '/student-dashboard': LuHouse,
    '/corporate-dashboard': LuHouse,
    '/pentester': LuHouse,
    '/mr-robot': LuShield,
    '/student-bootcamps': LuLayers,
    '/student-bootcamps/overview': LuLayers,
    '/student-resources': LuBookOpen,
    '/student-payments': LuCreditCard,
    '/community': LuMessageCircle,
    '/settings': LuSettings,
    '/account': LuUser,
  };

  const baseLinks = profile?.path
    ? links.filter((link) => link.path !== profile.path)
    : links;
  const navItems = [...baseLinks];
  if (profile?.path) {
    navItems.push({
      path: profile.path,
      label: profile.label || 'Profile',
      icon: profile.icon,
      isProfile: true,
      avatarSrc: profile.avatarSrc,
      avatarFallback: profile.avatarFallback,
    });
  }

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <div className="bottom-nav-track">
        {navItems.map((link) => {
          const Icon = iconOverrides[link.path] || link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `bottom-nav-item ${link.isProfile ? 'is-profile' : ''} ${isActive ? 'active' : ''}`
              }
              aria-label={link.label}
              title={link.label}
            >
              {link.isProfile ? (
                <span className="bottom-nav-avatar">
                  <img
                    src={link.avatarSrc || link.avatarFallback}
                    alt="Profile"
                    onError={(e) => {
                      if (link.avatarFallback && e.currentTarget.src !== link.avatarFallback) {
                        e.currentTarget.src = link.avatarFallback;
                      }
                    }}
                  />
                </span>
              ) : (
                <Icon size={20} />
              )}
              <span className="bottom-nav-label">{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
