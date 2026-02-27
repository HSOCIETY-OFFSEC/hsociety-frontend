import React from 'react';
import { FiHash, FiUsers, FiMessageSquare, FiX } from 'react-icons/fi';
import { getDisplayName, getUserAvatar } from '../../utils/community.utils';
import '../../../../styles/sections/community/sidebar.css';


const CommunitySidebar = ({
  activeChannels = [],
  room,
  onRoomChange,
  overviewStats,
  connected,
  user,
  role,
  open,
  onClose,
}) => {
  return (
    <aside className={`community-sidebar${open ? ' open' : ''}`}>

      {/* Close button — only visible on mobile via CSS */}
      <button
        className="community-sidebar-close"
        onClick={onClose}
        aria-label="Close menu"
      >
        <FiX size={16} />
      </button>

      {/* Brand */}
      <div className="community-sidebar-brand">
        <div className="community-sidebar-logo" aria-hidden="true">H</div>
        <div>
          <p className="community-sidebar-kicker">HSOCIETY</p>
          <h2 className="community-sidebar-title">Community</h2>
        </div>
      </div>

      {/* Live status */}
      <div className="community-sidebar-status">
        <span className={`community-status-dot ${connected ? 'online' : 'offline'}`} aria-hidden="true" />
        <span>{connected ? 'Live' : 'Reconnecting…'}</span>
      </div>

      {/* Stats */}
      <div className="community-sidebar-stats">
        <div className="community-sidebar-stat-item">
          <FiUsers size={13} aria-hidden="true" />
          <span>{Number(overviewStats?.learners || 0).toLocaleString()} online</span>
        </div>
        <div className="community-sidebar-stat-item">
          <FiMessageSquare size={13} aria-hidden="true" />
          <span>{Number(overviewStats?.questions || 0).toLocaleString()} posts</span>
        </div>
      </div>

      {/* Divider */}
      <div className="community-sidebar-divider" aria-hidden="true" />

      {/* Channel list */}
      <nav className="community-channel-nav" aria-label="Channels">
        <p className="community-channel-group-label">Channels</p>
        {activeChannels.map((channel) => (
          <button
            key={channel.id}
            type="button"
            className={`community-channel-btn${room === channel.id ? ' active' : ''}`}
            onClick={() => onRoomChange(channel.id)}
            aria-current={room === channel.id ? 'true' : undefined}
          >
            <FiHash size={14} className="community-channel-icon" aria-hidden="true" />
            <span className="community-channel-name">{channel.name || channel.id}</span>
            {room === channel.id && (
              <span className="community-channel-active-pip" aria-hidden="true" />
            )}
          </button>
        ))}
      </nav>

      {/* Spacer pushes user badge to bottom */}
      <div style={{ flex: 1 }} />

      {/* User badge */}
      {user && (
        <div className="community-user-badge">
          <img
            className="community-user-avatar"
            src={getUserAvatar(user)}
            alt={getDisplayName(user?.name || user?.username)}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="community-user-info">
            <span className="community-user-name">
              {getDisplayName(user?.name || user?.username)}
            </span>
            <span className="community-user-role">{role}</span>
          </div>
          <span
            className={`community-status-dot ${connected ? 'online' : 'offline'}`}
            aria-label={connected ? 'Connected' : 'Disconnected'}
          />
        </div>
      )}
    </aside>
  );
};

export default CommunitySidebar;
