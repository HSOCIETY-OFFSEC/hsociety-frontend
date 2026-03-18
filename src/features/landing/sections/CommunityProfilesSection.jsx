import React from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveProfileAvatar } from '../../../shared/utils/display/profileAvatar';
import { COMMUNITY_PROFILES_DATA } from '../../../data/landing/communityProfilesData';
import './community-profiles.css';

const CommunityProfilesSection = ({ title, subtitle, profiles = [], error = '' }) => {
  const navigate = useNavigate();
  const items = profiles.slice(0, 6);

  return (
    <section className="community-section reveal-on-scroll" id="community">
      <div className="section-container">
        <div className="community-grid">
          <div className="community-left">
            <p className="section-eyebrow"><span className="eyebrow-dot" />Community</p>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
            <button
              type="button"
              className="community-cta"
              onClick={() => navigate('/community')}
            >
              Join Community
            </button>
            {error && <p className="community-error">{error}</p>}
          </div>

          <div className="community-right">
            {items.length > 0 ? (
              <div className="community-cards">
                {items.map((profile) => {
                  const { src } = resolveProfileAvatar(profile);
                  return (
                    <article key={profile.id || profile.hackerHandle} className="community-card">
                      <div className="community-avatar">
                        <img
                          src={src}
                          alt={profile.name || COMMUNITY_PROFILES_DATA.fallbackName}
                          width={44}
                          height={44}
                          loading="lazy"
                        />
                      </div>
                      <div className="community-meta">
                        <span className="community-handle">@{profile.hackerHandle || 'operator'}</span>
                        <h3>{profile.name || COMMUNITY_PROFILES_DATA.fallbackName}</h3>
                        <span className="community-rank">{profile.rank || profile.role || COMMUNITY_PROFILES_DATA.fallbackRole}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="community-empty">
                {COMMUNITY_PROFILES_DATA.emptyStateText}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityProfilesSection;
