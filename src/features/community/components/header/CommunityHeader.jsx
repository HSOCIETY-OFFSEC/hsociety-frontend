import React from 'react';
import { FiMessageSquare, FiUsers } from 'react-icons/fi';
import { COMMUNITY_UI } from '../../../../data/community/communityUiData';
import '../../../../styles/sections/community/header.css';

const CommunityHeader = ({
  overviewStats,
  connected = false,
}) => {
  const learners = Number(overviewStats?.learners || 0).toLocaleString();
  const posts = Number(overviewStats?.questions || 0).toLocaleString();

  return (
    <header className="community-header">
      <div className="community-header-top">
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
          <span className={`community-header-conn${connected ? ' live' : ''}`} aria-label={connected ? 'Live' : 'Connecting'}>
            <span className="community-header-conn-dot" aria-hidden="true" />
            {connected ? 'Live' : 'Connecting'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default CommunityHeader;
