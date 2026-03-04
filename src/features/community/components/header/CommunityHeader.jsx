import React from 'react';
import { FiHash, FiMenu, FiMessageSquare, FiUsers, FiX } from 'react-icons/fi';
import { COMMUNITY_UI } from '../../../../data/community/communityUiData';

const CommunityHeader = ({
  activeChannels = [],
  room,
  onRoomChange,
  overviewStats,
  mobileNavOpen = false,
  onToggleMobileNav,
}) => {
  const learners = Number(overviewStats?.learners || 0).toLocaleString();
  const posts = Number(overviewStats?.questions || 0).toLocaleString();

  return (
    <header className="community-header">
      <div className="community-header-top">
        <button
          type="button"
          className="community-feed-menu-btn"
          onClick={onToggleMobileNav}
          aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileNavOpen}
        >
          {mobileNavOpen ? <FiX size={16} aria-hidden="true" /> : <FiMenu size={16} aria-hidden="true" />}
        </button>

        <div className="community-header-title">
          <div>
            <p className="community-header-kicker">{COMMUNITY_UI.header.brand}</p>
            <h1>{COMMUNITY_UI.header.title}</h1>
          </div>
        </div>

        <div className="community-header-meta">
          <span className="community-header-stat">
            <FiUsers size={13} aria-hidden="true" />
            {learners} {COMMUNITY_UI.header.learnersSuffix}
          </span>
          <span className="community-header-stat">
            <FiMessageSquare size={13} aria-hidden="true" />
            {posts} {COMMUNITY_UI.header.postsSuffix}
          </span>
        </div>
      </div>

      <div className="community-channel-tabs" role="tablist" aria-label={COMMUNITY_UI.header.channelsLabel}>
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
