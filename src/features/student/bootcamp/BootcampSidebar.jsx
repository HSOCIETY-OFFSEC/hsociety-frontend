import React from 'react';
import { NavLink } from 'react-router-dom';
import { LuActivity, LuBookOpen, LuCirclePlay, LuLayers, LuTrendingUp } from 'react-icons/lu';
import { HACKER_PROTOCOL_BOOTCAMP } from '../../../data/bootcamps/hackerProtocolData';

const links = [
  { to: '/student-bootcamps/overview', label: 'Overview', icon: LuActivity },
  { to: '/student-bootcamps/modules', label: 'Modules', icon: LuLayers },
  { to: '/student-bootcamps/live-class', label: 'Live Class', icon: LuCirclePlay },
  { to: '/student-bootcamps/resources', label: 'Resources', icon: LuBookOpen },
  { to: '/student-bootcamps/progress', label: 'Progress', icon: LuTrendingUp }
];

const BootcampSidebar = ({ collapsed = false }) => {
  return (
    <div className={`bootcamp-sidebar-inner ${collapsed ? 'collapsed' : ''}`}>
      <div className="bootcamp-sidebar-brand" data-tooltip={collapsed ? 'Bootcamp' : undefined}>
        <span className="bootcamp-sidebar-kicker">Bootcamp</span>
        <strong>{HACKER_PROTOCOL_BOOTCAMP.title}</strong>
      </div>
      <nav className="bootcamp-nav" aria-label="Bootcamp navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `bootcamp-nav-link ${isActive ? 'active' : ''}`
            }
            data-tooltip={collapsed ? link.label : undefined}
            aria-label={link.label}
          >
            <link.icon size={16} />
            <span className="bootcamp-nav-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BootcampSidebar;
