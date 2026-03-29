import React, { useEffect, useMemo, useState } from 'react';
import { FiMessageSquare, FiStar, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getCommunityProfilesList } from '../services/community.service';
import { resolveProfileAvatar } from '../../../shared/utils/display/profileAvatar';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';

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
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 pb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-bg-secondary">
              <FiUsers size={20} className="text-brand" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary">
                <span className="font-semibold text-text-secondary">HSOCIETY</span>
                <span>/</span>
                <span className="font-semibold text-text-secondary">community-profiles</span>
                <span className="rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold text-text-secondary">
                  Private
                </span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">
                Community operators actively posting in HSOCIETY channels.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
            <FiMessageSquare size={13} className="text-text-tertiary" />
            <span>Messages</span>
            <strong className="text-text-primary">{totals.messages}</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
            <FiStar size={13} className="text-text-tertiary" />
            <span>Likes</span>
            <strong className="text-text-primary">{totals.likes}</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
            <FiUsers size={13} className="text-text-tertiary" />
            <span>Profiles</span>
            <strong className="text-text-primary">{profiles.length}</strong>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0">
          <section className="py-4">
            <h2 className="text-base font-semibold text-text-primary">Active profiles</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Open a profile to view public stats and highlights.
            </p>

            <div className="mt-4 overflow-hidden rounded-sm border border-border">
              {loading && <div className="bg-bg-secondary px-4 py-4 text-sm text-text-tertiary">Loading profiles...</div>}
              {!loading && error && <div className="bg-bg-secondary px-4 py-4 text-sm text-status-danger">{error}</div>}
              {!loading && !error && profiles.length === 0 && (
                <div className="bg-bg-secondary px-4 py-4 text-sm text-text-tertiary">No community profiles yet.</div>
              )}
              {!loading && !error && profiles.map((profile) => {
                const handle = String(profile.hackerHandle || profile.id || '').trim();
                const displayHandle = String(profile.name || profile.hackerHandle || '').trim();
                const { src: avatarSrc, fallback: avatarFallback } = resolveProfileAvatar(profile);
                return (
                  <article key={profile.id || handle} className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarSrc}
                        alt={profile.name}
                        className="h-11 w-11 rounded-full object-cover"
                        onError={(e) => {
                          if (e.currentTarget.src !== avatarFallback) {
                            e.currentTarget.src = avatarFallback;
                          }
                        }}
                      />
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-text-primary">
                          {profile.name || 'Community Member'}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {profile.organization || 'Independent'}
                          {displayHandle ? ` · @${displayHandle}` : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold text-text-secondary">
                        <span>Messages</span>
                        <strong className="text-text-primary">{profile.stats?.messages || 0}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold text-text-secondary">
                        <span>Likes</span>
                        <strong className="text-text-primary">{profile.stats?.likesReceived || 0}</strong>
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-tertiary"
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

        <aside className="hidden flex-col gap-4 lg:flex">
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-semibold text-text-primary">About</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Profiles are ranked by recent community activity and engagement.
            </p>
            <div className="my-3 h-px bg-border" />
            <ul className="flex flex-col gap-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2"><FiMessageSquare size={13} />Message volume</li>
              <li className="flex items-center gap-2"><FiStar size={13} />Likes received</li>
              <li className="flex items-center gap-2"><FiUsers size={13} />Active members</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CommunityProfiles;
