import React, { useEffect, useMemo, useState } from 'react';
import { FiHeart, FiMessageCircle, FiMessageSquare } from 'react-icons/fi';
import { getGithubAvatarDataUri } from '../../../shared/utils/avatar';
import Skeleton from '../../../shared/components/ui/Skeleton';
import cpIcon from '../../../assets/icons/CP/cp-icon.png';
import { COMMUNITY_PROFILES_DATA } from '../../../data/landing/communityProfilesData';
import '../../../styles/landing/community-profiles.css';

const AUTO_ROTATE_MS = COMMUNITY_PROFILES_DATA.autoRotateMs;

const CommunityProfilesSection = ({ title, subtitle, profiles = [], loading = false, error = '' }) => {
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

  const formatMetric = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return value;
  };

  return (
    <section className="community-profiles" id="community-profiles">
      <div className="community-profiles-inner">
        <div className="community-profiles-header">
          <span className="eyebrow">{COMMUNITY_PROFILES_DATA.sectionEyebrow}</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        {loading ? (
          <div className="community-profiles-skeleton">
            {Array.from({ length: cardsPerView }).map((_, index) => (
              <div key={`skeleton-${index}`} className="community-profile-card">
                <header>
                  <Skeleton variant="circle" className="community-profile-avatar-skeleton" />
                  <div className="community-profile-skeleton-text">
                    <Skeleton className="community-profile-skeleton-line" />
                    <Skeleton className="community-profile-skeleton-line short" />
                  </div>
                </header>
                <Skeleton className="community-profile-skeleton-line" />
                <Skeleton className="community-profile-skeleton-line long" />
                <div className="community-profile-metrics">
                  {Array.from({ length: 3 }).map((_, metricIndex) => (
                    <Skeleton
                      key={`metric-${metricIndex}`}
                      className="community-profile-skeleton-metric"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : count === 0 ? (
          <div className="community-profiles-empty">
            {error || COMMUNITY_PROFILES_DATA.emptyStateText}
          </div>
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
                      : profile.name
                      ? `@${profile.name.split(' ')[0].toLowerCase()}`
                      : 'Handle unavailable';
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
                            <h3>{profile.name || 'Name unavailable'}</h3>
                            <span className="community-profile-role">{profile.role || 'Role unavailable'}</span>
                          </div>
                        </header>

                        <p className="community-profile-bio">
                          {profile.bio || 'Bio unavailable.'}
                        </p>

                        <div className="community-profile-metrics">
                          <div className="community-profile-cp">
                            <img src={cpIcon} alt="CP" className="community-profile-cp-icon" />
                            <span>
                              {formatMetric(profile.xpSummary?.totalXp)} CP
                            </span>
                          </div>
                          <div>
                            <FiMessageSquare size={14} />
                            <span>{formatMetric(profile.stats?.messages)} messages</span>
                          </div>
                          <div>
                            <FiHeart size={14} />
                            <span>{formatMetric(profile.stats?.likesReceived)} likes</span>
                          </div>
                          <div>
                            <FiMessageCircle size={14} />
                            <span>{formatMetric(profile.stats?.commentsMade)} comments</span>
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
