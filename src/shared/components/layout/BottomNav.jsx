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
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg-secondary/90 backdrop-blur-md md:hidden"
      style={{ height: 'var(--bottom-nav-height, 64px)' }}
      aria-label="Bottom navigation"
    >
      <div className="bottom-nav-track flex h-full min-w-full items-center justify-evenly gap-2 overflow-x-auto px-3">
        {navItems.map((link) => {
          const Icon = iconOverrides[link.path] || link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex min-w-16 flex-col items-center justify-center gap-1 rounded-md border border-transparent px-2 py-1 text-center text-text-secondary transition-colors duration-150 hover:bg-bg-tertiary hover:text-text-primary ${
                  isActive ? 'border-brand/30 bg-brand/10 text-brand' : ''
                }`
              }
              aria-label={link.label}
              title={link.label}
            >
              {link.isProfile ? (
                <span className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-bg-tertiary">
                  <img
                    src={link.avatarSrc || link.avatarFallback}
                    alt="Profile"
                    onError={(e) => {
                      if (link.avatarFallback && e.currentTarget.src !== link.avatarFallback) {
                        e.currentTarget.src = link.avatarFallback;
                      }
                    }}
                    className="h-full w-full object-cover"
                  />
                </span>
              ) : (
                <Icon size={20} />
              )}
              <span className="text-xs font-semibold">{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
