import React from 'react';
import { FiHash, FiMenu, FiMessageSquare, FiUsers } from 'react-icons/fi';
import { getDisplayName, getUserAvatar } from '../../utils/community.utils';

const CommunityHeader = ({
  activeChannels = [],
  room,
  onRoomChange,
  overviewStats,
  user,
  role,
  onMenuOpen,
}) => {
  const learners = Number(overviewStats?.learners || 0).toLocaleString();
  const posts = Number(overviewStats?.questions || 0).toLocaleString();

  return (
    <header className="community-header">
      <div className="community-header-top">
        <div className="community-header-title">
          <button
            type="button"
            className="community-feed-menu-btn"
            onClick={onMenuOpen}
            aria-label="Open channels"
          >
            <FiMenu size={16} />
          </button>
          <div>
            <p className="community-header-kicker">HSOCIETY</p>
            <h1>Community</h1>
          </div>
        </div>

        <div className="community-header-meta">
          <span className="community-header-stat">
            <FiUsers size={13} aria-hidden="true" />
            {learners} online
          </span>
          <span className="community-header-stat">
            <FiMessageSquare size={13} aria-hidden="true" />
            {posts} posts
          </span>
          {user && (
            <div className="community-header-user">
              <img
                src={getUserAvatar(user)}
                alt={getDisplayName(user?.name || user?.username)}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div>
                <span className="community-header-user-name">
                  {getDisplayName(user?.name || user?.username)}
                </span>
                <span className="community-header-user-role">{role}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="community-channel-tabs" role="tablist" aria-label="Channels">
        {activeChannels.map((channel) => (
          <button
            key={channel.id}
            type="button"
            className={`community-channel-tab${room === channel.id ? ' active' : ''}`}
            onClick={() => onRoomChange(channel.id)}
            aria-current={room === channel.id ? 'true' : undefined}
          >
            <FiHash size={13} aria-hidden="true" />
            {channel.name || channel.id}
          </button>
        ))}
      </div>
    </header>
  );
};

export default CommunityHeader;
