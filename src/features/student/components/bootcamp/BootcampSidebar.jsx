import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LuActivity,
  LuBookOpen,
  LuChevronsLeft,
  LuChevronsRight,
  LuCirclePlay,
  LuLayers,
  LuTrendingUp,
} from 'react-icons/lu';
import { HACKER_PROTOCOL_BOOTCAMP } from '../../../../data/static/bootcamps/hackerProtocolData';

const links = [
  { to: '/student-bootcamps/overview', label: 'Overview', icon: LuActivity },
  { to: '/student-bootcamps/modules', label: 'Modules', icon: LuLayers },
  { to: '/student-bootcamps/live-class', label: 'Live Class', icon: LuCirclePlay },
  { to: '/student-bootcamps/resources', label: 'Resources', icon: LuBookOpen },
  { to: '/student-bootcamps/progress', label: 'Progress', icon: LuTrendingUp }
];

const BootcampSidebar = ({ collapsed = false, onToggleCollapse = null }) => {
  const containerClassName = `flex h-full flex-col gap-2 overflow-y-auto border-r border-border bg-bg-secondary ${collapsed ? 'px-2' : 'px-3'} py-4`;
  const brandClassName = 'mb-2 flex flex-col gap-1 px-2';
  const kickerClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const navClassName = 'flex flex-1 flex-col gap-1';
  const navLinkBase =
    'flex items-center gap-3 rounded-sm border border-transparent px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-border hover:bg-bg-tertiary hover:text-text-primary';
  const navLinkActive = 'border-border bg-bg-secondary text-text-primary font-semibold';
  const footerClassName = 'mt-auto border-t border-border pt-3';
  const collapseButtonClassName =
    'flex w-full items-center gap-3 rounded-sm border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary';
  const labelClassName = collapsed ? 'hidden' : 'inline-flex';

  return (
    <div className={containerClassName}>
      <div className={brandClassName}>
        <span className={kickerClassName}>Bootcamp</span>
        {!collapsed && <strong className="text-sm font-semibold text-text-primary">{HACKER_PROTOCOL_BOOTCAMP.title}</strong>}
      </div>
      <nav className={navClassName} aria-label="Bootcamp navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${navLinkBase}${isActive ? ` ${navLinkActive}` : ''}${collapsed ? ' justify-center px-2' : ''}`
            }
            aria-label={link.label}
          >
            <link.icon size={16} />
            <span className={labelClassName}>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      {onToggleCollapse && (
        <div className={footerClassName}>
          <button
            type="button"
            className={`${collapseButtonClassName}${collapsed ? ' justify-center px-2' : ''}`}
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <LuChevronsRight size={16} /> : <LuChevronsLeft size={16} />}
            <span className={labelClassName}>
              {collapsed ? 'Expand' : 'Collapse'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BootcampSidebar;
