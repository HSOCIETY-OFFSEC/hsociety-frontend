import React from 'react';
import { FiHash, FiMessageSquare, FiUsers, FiWifi } from 'react-icons/fi';
import { getDisplayName, getUserAvatar } from '../../utils/community.utils';

const CommunityHeader = ({
  activeChannels,
  room,
  onRoomChange,
  overviewStats,
  connected,
  user,
  role
}) => {
  return (
    <header className="community-header">
      <div className="community-header-top">
        <div className="community-header-title">
          <div>
            <p className="community-header-kicker">HSOCIETY</p>
            <h1>Community</h1>
          </div>
          <span className={`community-conn-badge ${connected ? 'live' : 'away'}`}>
            <FiWifi size={12} />
            {connected ? 'Live' : 'Reconnecting'}
          </span>
        </div>

        <div className="community-header-meta" id="community-stats">
          <div className="community-header-stat">
            <FiUsers size={14} />
            <span>{Number(overviewStats?.learners || 0).toLocaleString()} online</span>
          </div>
          <div className="community-header-stat">
            <FiMessageSquare size={14} />
            <span>{Number(overviewStats?.questions || 0).toLocaleString()} posts</span>
          </div>
        </div>

        {user && (
          <div className="community-header-user">
            <img
              src={getUserAvatar(user)}
              alt={`${getDisplayName(user.name || user.username)} avatar`}
              onError={(e) => {
                e.currentTarget.src = getUserAvatar({
                  name: user?.name,
                  username: user?.username,
                  email: user?.email
                });
              }}
            />
            <div>
              <span className="community-header-user-name">
                {getDisplayName(user.name || user.username || user.email)}
              </span>
              <span className="community-header-user-role">{role}</span>
            </div>
          </div>
        )}
      </div>

      <nav className="community-channel-tabs" aria-label="Channel list">
        {activeChannels.map((channel) => (
          <button
            key={channel.id}
            type="button"
            className={`community-channel-tab ${room === channel.id ? 'active' : ''}`}
            onClick={() => onRoomChange(channel.id)}
            aria-current={room === channel.id ? 'true' : undefined}
          >
            <FiHash size={14} />
            <span>{channel.name || channel.id}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};

export default CommunityHeader;
