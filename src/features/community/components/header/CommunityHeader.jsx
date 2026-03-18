import React from 'react';
import { FiArrowLeft, FiMessageSquare, FiUsers } from 'react-icons/fi';
import { COMMUNITY_UI } from '../../../../data/community/communityUiData';
import '../../../../styles/features/community/index.css';

const CommunityHeader = ({ overviewStats, connected = false, onBack }) => {
  const learners = Number(overviewStats?.learners || 0).toLocaleString();
  const posts = Number(overviewStats?.questions || 0).toLocaleString();

  return (
    <header className="community-header">
      <div className="community-header-top">
        <div className="community-header-left">
          {onBack && (
            <button
              type="button"
              className="community-header-back"
              onClick={onBack}
              aria-label="Back"
            >
              <FiArrowLeft size={14} aria-hidden="true" />
            </button>
          )}
          <div className="community-header-title-group">
            <p className="community-header-eyebrow">{COMMUNITY_UI.header.brand}</p>
            <h1 className="community-header-title">{COMMUNITY_UI.header.title}</h1>
          </div>
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
    </header>
  );
};

export default CommunityHeader;
