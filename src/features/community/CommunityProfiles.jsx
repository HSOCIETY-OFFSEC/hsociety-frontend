import React, { useEffect, useMemo, useState } from 'react';
import { FiMessageSquare, FiStar, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getCommunityProfilesList } from './community.service';
import { resolveProfileAvatar } from '../../shared/utils/display/profileAvatar';
import { getPublicErrorMessage } from '../../shared/utils/errors/publicError';
import '@styles/sections/community/profiles.css';

const CommunityProfiles = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      const response = await getCommunityProfilesList(12);
      if (!mounted) return;
      if (response.success) {
        const data = response.data?.profiles || response.data || [];
        setProfiles(data);
      } else {
        setError(getPublicErrorMessage({ action: 'load', response }));
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const totals = useMemo(() => {
    return profiles.reduce(
      (acc, profile) => {
        acc.messages += Number(profile.stats?.messages || 0);
        acc.likes += Number(profile.stats?.likesReceived || 0);
        acc.images += Number(profile.stats?.imagesShared || 0);
        return acc;
      },
      { messages: 0, likes: 0, images: 0 }
    );
  }, [profiles]);

  return (
    <div className="cpr-page">
      <header className="cpr-page-header">
        <div className="cpr-page-header-inner">
          <div className="cpr-header-left">
            <div className="cpr-header-icon-wrap">
              <FiUsers size={20} className="cpr-header-icon" />
            </div>
            <div>
              <div className="cpr-header-breadcrumb">
                <span className="cpr-breadcrumb-org">HSOCIETY</span>
                <span className="cpr-breadcrumb-sep">/</span>
                <span className="cpr-breadcrumb-page">community-profiles</span>
                <span className="cpr-header-visibility">Private</span>
              </div>
              <p className="cpr-header-desc">Community operators actively posting in HSOCIETY channels.</p>
            </div>
          </div>
        </div>
        <div className="cpr-header-meta">
          <span className="cpr-meta-pill">
            <FiMessageSquare size={13} className="cpr-meta-icon" />
            <span className="cpr-meta-label">Messages</span>
            <strong className="cpr-meta-value">{totals.messages}</strong>
          </span>
          <span className="cpr-meta-pill">
            <FiStar size={13} className="cpr-meta-icon" />
            <span className="cpr-meta-label">Likes</span>
            <strong className="cpr-meta-value">{totals.likes}</strong>
          </span>
          <span className="cpr-meta-pill">
            <FiUsers size={13} className="cpr-meta-icon" />
            <span className="cpr-meta-label">Profiles</span>
            <strong className="cpr-meta-value">{profiles.length}</strong>
          </span>
        </div>
      </header>

      <div className="cpr-layout">
        <main className="cpr-main">
          <section className="cpr-section">
            <h2 className="cpr-section-title">Active profiles</h2>
            <p className="cpr-section-desc">Open a profile to view public stats and highlights.</p>

            <div className="cpr-item-list">
              {loading && <div className="cpr-empty">Loading profiles...</div>}
              {!loading && error && <div className="cpr-empty">{error}</div>}
              {!loading && !error && profiles.length === 0 && (
                <div className="cpr-empty">No community profiles yet.</div>
              )}
              {!loading && !error && profiles.map((profile) => {
                const handle = String(profile.hackerHandle || '').trim();
                const { src: avatarSrc, fallback: avatarFallback } = resolveProfileAvatar(profile);
                return (
                  <article key={profile.id || handle} className="cpr-item-row">
                    <div className="cpr-item-main cpr-profile-main">
                      <img
                        src={avatarSrc}
                        alt={profile.name}
                        className="cpr-avatar"
                        onError={(e) => {
                          if (e.currentTarget.src !== avatarFallback) {
                            e.currentTarget.src = avatarFallback;
                          }
                        }}
                      />
                      <div className="cpr-profile-copy">
                        <span className="cpr-item-title">{profile.name || 'Community Member'}</span>
                        <span className="cpr-item-subtitle">
                          {profile.organization || 'Independent'}
                          {handle ? ` · @${handle}` : ''}
                        </span>
                      </div>
                    </div>
                    <div className="cpr-item-meta">
                      <span className="cpr-metric-pill">
                        <span className="cpr-metric-label">Messages</span>
                        <strong>{profile.stats?.messages || 0}</strong>
                      </span>
                      <span className="cpr-metric-pill">
                        <span className="cpr-metric-label">Likes</span>
                        <strong>{profile.stats?.likesReceived || 0}</strong>
                      </span>
                      <button
                        type="button"
                        className="cpr-btn cpr-btn-secondary"
                        onClick={() => {
                          if (!handle) return;
                          navigate(`/@${encodeURIComponent(handle)}`);
                        }}
                        disabled={!handle}
                      >
                        View profile
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>

        <aside className="cpr-sidebar">
          <div className="cpr-sidebar-box">
            <h3 className="cpr-sidebar-heading">About</h3>
            <p className="cpr-sidebar-about">
              Profiles are ranked by recent community activity and engagement.
            </p>
            <div className="cpr-sidebar-divider" />
            <ul className="cpr-sidebar-list">
              <li><FiMessageSquare size={13} className="cpr-sidebar-icon" />Message volume</li>
              <li><FiStar size={13} className="cpr-sidebar-icon" />Likes received</li>
              <li><FiUsers size={13} className="cpr-sidebar-icon" />Active members</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CommunityProfiles;
