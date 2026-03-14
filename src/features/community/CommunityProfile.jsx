import React from 'react';
import { FiHash, FiMessageSquare, FiUsers } from 'react-icons/fi';
import { COMMUNITY_UI } from '../../data/community/communityUiData';
import '@styles/sections/community/header.css';

const CommunityProfile = ({
  activeChannels = [],
  room,
  onRoomChange,
  overviewStats,
  connected = false,
}) => {
  const learners = Number(overviewStats?.learners || 0).toLocaleString();
  const posts = Number(overviewStats?.questions || 0).toLocaleString();

  return (
    <header className="community-header">
      <div className="community-header-top">
        <div className="community-header-title-group">
          <p className="community-header-eyebrow">{COMMUNITY_UI.header.brand}</p>
          <h1 className="community-header-title">{COMMUNITY_UI.header.title}</h1>
        </div>

        <div className="community-header-right">
          <span className="community-header-stat">
            <FiUsers size={12} aria-hidden="true" />
            {learners}
          </span>
          <span className="community-header-stat">
            <FiMessageSquare size={12} aria-hidden="true" />
            {posts}
          </span>
          <span
            className={`community-header-live-badge${connected ? ' live' : ''}`}
            aria-label={connected ? 'Connected — live' : 'Connecting'}
          >
            <span className="community-header-live-dot" aria-hidden="true" />
            {connected ? 'Live' : 'Connecting'}
          </span>
        </div>
      </div>

      {activeChannels.length > 0 && (
        <nav
          className="community-header-tabs"
          role="tablist"
          aria-label={COMMUNITY_UI.header.channelsLabel}
        >
          {activeChannels.map((channel) => (
            <button
              key={channel.id}
              type="button"
              role="tab"
              aria-selected={room === channel.id}
              className={`community-header-tab${room === channel.id ? ' active' : ''}`}
              onClick={() => onRoomChange(channel.id)}
            >
              <FiHash size={12} aria-hidden="true" />
              {channel.name || channel.id}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};

export default CommunityProfile;
