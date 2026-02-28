import React, { useEffect, useMemo, useState } from 'react';
import { FiHeart, FiMessageCircle, FiMessageSquare } from 'react-icons/fi';
import { getGithubAvatarDataUri } from '../../../shared/utils/avatar';
import '../../../styles/landing/community-profiles.css';

const AUTO_ROTATE_MS = 4500;

const CommunityProfilesSection = ({ title, subtitle, profiles = [] }) => {
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  const slides = useMemo(() => profiles.filter(Boolean), [profiles]);
  const count = slides.length;

  useEffect(() => {
    const calcCards = () => {
      const width = window.innerWidth;
      if (width < 640) return 1;
      if (width < 1024) return 2;
      return 3;
    };
    const update = () => setCardsPerView(calcCards());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const groups = useMemo(() => {
    if (!count) return [];
    const groupSize = Math.max(1, cardsPerView);
    const result = [];
    for (let i = 0; i < count; i += groupSize) {
      result.push(slides.slice(i, i + groupSize));
    }
    return result.length ? result : [slides];
  }, [count, slides, cardsPerView]);

  const groupCount = groups.length;
  const activeIndex = groupCount ? index % groupCount : 0;

  useEffect(() => {
    if (groupCount <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % groupCount);
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [groupCount]);

  return (
    <section className="community-profiles" id="community-profiles">
      <div className="community-profiles-inner">
        <div className="community-profiles-header">
          <span className="eyebrow">Community Profiles</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        {count === 0 ? (
          <div className="community-profiles-empty">Community profiles will appear here.</div>
        ) : (
          <div className="community-profiles-carousel" role="region" aria-label="Community profiles">
            <div
              className="community-profiles-track"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {groups.map((group, groupIndex) => (
                <div className="community-profiles-slide" key={`group-${groupIndex}`}>
                  {group.map((profile) => {
                    const avatarFallback = getGithubAvatarDataUri(
                      profile.name || profile.hackerHandle || profile.id || 'member'
                    );
                    const handle = profile.hackerHandle
                      ? `@${profile.hackerHandle}`
                      : `@${(profile.name || 'member').split(' ')[0].toLowerCase()}`;
                    return (
                      <article className="community-profile-card" key={profile.id || handle}>
                        <header>
                          <img
                            src={profile.avatarUrl || avatarFallback}
                            alt={profile.name || 'Community member'}
                            onError={(e) => {
                              if (e.currentTarget.src !== avatarFallback) {
                                e.currentTarget.src = avatarFallback;
                              }
                            }}
                          />
                          <div>
                            <p className="community-profile-handle">{handle}</p>
                            <h3>{profile.name || 'Community Member'}</h3>
                            <span className="community-profile-role">{profile.role || 'member'}</span>
                          </div>
                        </header>

                        <p className="community-profile-bio">
                          {profile.bio || 'Focused on sharpening offensive skills and sharing findings.'}
                        </p>

                        <div className="community-profile-metrics">
                          <div>
                            <FiMessageSquare size={14} />
                            <span>{profile.stats?.messages || 0} messages</span>
                          </div>
                          <div>
                            <FiHeart size={14} />
                            <span>{profile.stats?.likesReceived || 0} likes</span>
                          </div>
                          <div>
                            <FiMessageCircle size={14} />
                            <span>{profile.stats?.commentsMade || 0} comments</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="community-profiles-dots" role="tablist" aria-label="Profile slides">
              {groups.map((_, i) => (
                <button
                  type="button"
                  key={`dot-${i}`}
                  className={`community-profiles-dot ${i === activeIndex ? 'is-active' : ''}`}
                  aria-label={`Go to profile ${i + 1}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunityProfilesSection;
