import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiActivity, FiBookOpen, FiLayers, FiPlayCircle, FiTrendingUp } from 'react-icons/fi';
import { HACKER_PROTOCOL_BOOTCAMP } from '../../../data/bootcamps/hackerProtocolData';

const links = [
  { to: '/student-bootcamps/overview', label: 'Overview', icon: FiActivity },
  { to: '/student-bootcamps/modules', label: 'Modules', icon: FiLayers },
  { to: '/student-bootcamps/live-class', label: 'Live Class', icon: FiPlayCircle },
  { to: '/student-bootcamps/resources', label: 'Resources', icon: FiBookOpen },
  { to: '/student-bootcamps/progress', label: 'Progress', icon: FiTrendingUp }
];

const BootcampSidebar = () => {
  return (
    <div className="bootcamp-sidebar-inner">
      <div className="bootcamp-sidebar-brand">
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
          >
            <link.icon size={16} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BootcampSidebar;
