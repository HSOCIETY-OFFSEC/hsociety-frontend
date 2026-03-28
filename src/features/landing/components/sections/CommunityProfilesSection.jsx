import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveProfileAvatar } from '../../../../shared/utils/display/profileAvatar';
import { COMMUNITY_PROFILES_DATA } from '../../../../data/static/landing/communityProfilesData';
import ImageWithLoader from '../../../../shared/components/ui/ImageWithLoader';

const CommunityProfilesSection = ({ title, subtitle, profiles = [], error = '' }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const items = profiles.slice(0, 6);

  return (
    <section className="reveal-on-scroll border-t border-border bg-bg-secondary py-16" id="community" ref={sectionRef}>
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--navbar-height,64px)+1.5rem)]">
            <p className="section-eyebrow"><span className="eyebrow-dot" />Community</p>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
            <button
              type="button"
              className="inline-flex w-fit items-center gap-1 rounded-sm border border-border px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-brand hover:text-brand"
              onClick={() => navigate('/community')}
            >
              Join Community
            </button>
            {error && <p className="text-xs text-text-tertiary">{error}</p>}
          </div>

          <div className="flex flex-col">
            {items.length > 0 ? (
              <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((profile, index) => {
                  const { src } = resolveProfileAvatar(profile);
                  const displayHandle = (profile.name || profile.hackerHandle || 'operator').trim();
                  return (
                    <article
                      key={profile.id || profile.hackerHandle}
                      className={`group relative flex h-full flex-col gap-3 overflow-hidden rounded-md border border-border bg-bg-secondary p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary-color)_45%,var(--border-color))] hover:shadow-md motion-reduce:transform-none ${
                        isVisible
                          ? 'animate-why-in-y'
                          : 'opacity-0 translate-y-3 motion-reduce:opacity-100 motion-reduce:translate-y-0'
                      }`}
                      style={isVisible ? { animationDelay: `${index * 60}ms` } : undefined}
                    >
                      <span className="pointer-events-none absolute left-0 right-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
                      <div className="h-11 w-11 overflow-hidden rounded-full border border-border transition-transform duration-200 group-hover:scale-105 group-hover:border-[color-mix(in_srgb,var(--primary-color)_55%,var(--border-color))]">
                        <ImageWithLoader
                          src={src}
                          alt={profile.name || COMMUNITY_PROFILES_DATA.fallbackName}
                          loading="lazy"
                          className="h-full w-full rounded-full bg-bg-tertiary"
                          imgClassName="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="truncate font-mono text-[0.62rem] uppercase tracking-[0.14em] text-text-tertiary">
                          @{displayHandle}
                        </span>
                        <h3 className="truncate text-sm font-semibold text-text-primary transition-colors group-hover:text-[color-mix(in_srgb,var(--primary-color)_65%,var(--text-primary))]">
                          {profile.name || COMMUNITY_PROFILES_DATA.fallbackName}
                        </h3>
                        <span className="mt-auto truncate pt-2 font-mono text-[0.72rem] tracking-[0.06em] text-text-tertiary transition-colors group-hover:text-[color-mix(in_srgb,var(--primary-color)_55%,var(--text-tertiary))]">
                          {profile.rank || profile.role || COMMUNITY_PROFILES_DATA.fallbackRole}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-md border border-border px-6 py-5 text-sm text-text-tertiary">
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
