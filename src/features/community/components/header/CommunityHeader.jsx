import React from 'react';
import { FiHash, FiMessageSquare, FiUsers } from 'react-icons/fi';

const CommunityHeader = ({
  activeChannels = [],
  room,
  onRoomChange,
  overviewStats,
}) => {
  const learners = Number(overviewStats?.learners || 0).toLocaleString();
  const posts = Number(overviewStats?.questions || 0).toLocaleString();

  return (
    <header className="community-header">
      <div className="community-header-top">
        <div className="community-header-title">
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
