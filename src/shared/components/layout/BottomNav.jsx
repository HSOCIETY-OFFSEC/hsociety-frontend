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
import '../../../styles/shared/components/layout/BottomNav.css';

const BottomNav = ({ links = [] }) => {
  if (!links.length) return null;

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

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <div className="bottom-nav-track">
        {links.map((link) => {
          const Icon = iconOverrides[link.path] || link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `bottom-nav-item ${isActive ? 'active' : ''}`
              }
              aria-label={link.label}
              title={link.label}
            >
              <Icon size={20} />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
