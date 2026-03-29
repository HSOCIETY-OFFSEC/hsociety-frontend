import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCommunityProfile } from '../services/community.service';
import ProfileBadgeSection from '../../../shared/components/ui/ProfileBadgeSection';
import { buildProfileBadges } from '../../../shared/utils/display/profileBadges';
import { resolveProfileAvatar } from '../../../shared/utils/display/profileAvatar';

const formatCount = (value) => Number(value || 0).toLocaleString();
const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown';

const CommunityProfile = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const profileXpSummary = useMemo(() => {
    if (profileData?.xpSummary) return profileData.xpSummary;
    if (profileData?.stats?.totalXp != null) {
      return { totalXp: profileData.stats.totalXp, rank: profileData?.xpSummary?.rank };
    }
    return null;
  }, [profileData]);

  const profileBadges = useMemo(
    () => buildProfileBadges({
      xpSummary: profileXpSummary,
      rankTitle: profileXpSummary?.rank,
      badges: profileData?.badges || profileData?.achievements?.badges || profileData?.unlockedBadges || [],
    }),
    [profileData, profileXpSummary]
  );
  const { src: heroAvatarSrc, fallback: heroAvatarFallback } = resolveProfileAvatar(profileData?.user);

  const loadProfile = useCallback(async () => {
    if (!handle) return;
    setLoading(true);
    setError('');
    try {
      const response = await getCommunityProfile(handle);
      if (!response.success) {
        setError(response.error || 'Profile not found');
        setProfileData(null);
        return;
      }
      setProfileData(response.data || null);
    } finally {
      setLoading(false);
    }
  }, [handle]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const metrics = useMemo(() => {
    if (!profileData?.stats) return [];
    return [
      { label: 'Messages', value: formatCount(profileData.stats.messages) },
      { label: 'Likes received', value: formatCount(profileData.stats.likesReceived) },
      { label: 'Comments', value: formatCount(profileData.stats.commentsMade) },
      { label: 'Images shared', value: formatCount(profileData.stats.imagesShared) },
      { label: 'Rooms active', value: formatCount(profileData.stats.roomsActive) },
    ];
  }, [profileData]);

  const xpDetails = useMemo(() => {
    if (!profileData?.xpSummary) return [];
    return [
      { label: 'Total XP', value: formatCount(profileData.xpSummary.totalXp) },
      { label: 'Rank', value: profileData.xpSummary.rank || 'Candidate' },
      { label: 'Streak', value: `${profileData.xpSummary.streakDays || 0} days` },
      { label: 'Visits', value: formatCount(profileData.xpSummary.visits) },
    ];
  }, [profileData]);

  const handleBack = () => navigate('/community');

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-tertiary"
          onClick={handleBack}
        >
          ← Back to community
        </button>
        <h1 className="text-base font-semibold text-text-primary">Community profile</h1>
      </div>

      {loading && <p className="text-sm text-text-secondary">Loading profile…</p>}
      {error && <p className="text-sm text-status-danger">{error}</p>}

      {!loading && !error && profileData && (
        <>
          <section className="flex flex-col gap-4 rounded-lg border border-border bg-bg-secondary p-6 sm:flex-row sm:items-start">
            <img
              src={heroAvatarSrc}
              alt={profileData.user.name || profileData.user.hackerHandle}
              className="h-24 w-24 rounded-full object-cover"
              onError={(e) => {
                if (e.currentTarget.src !== heroAvatarFallback) {
                  e.currentTarget.src = heroAvatarFallback;
                }
              }}
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-text-tertiary">
                @{profileData.user.name || profileData.user.hackerHandle || profileData.user.id}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-text-primary">
                {profileData.user.name || 'Community member'}
              </h2>
              <div className="mt-3 grid gap-2" aria-label="Profile badges">
                <p className="text-xs uppercase tracking-widest text-text-tertiary">Badges</p>
                <ProfileBadgeSection badges={profileBadges} />
              </div>
              {profileData.user.organization && (
                <p className="mt-2 text-sm text-text-secondary">{profileData.user.organization}</p>
              )}
              <p className="text-sm text-text-secondary">
                Joined {formatDate(profileData.user.joinedAt)}
              </p>
              {profileData.user.bio && (
                <p className="mt-2 text-sm text-text-secondary">{profileData.user.bio}</p>
              )}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-bg-secondary p-4 sm:grid-cols-5" aria-label="Interaction metrics">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-md border border-border bg-bg-primary px-3 py-2 text-center">
                <strong className="block text-lg font-semibold text-text-primary">{metric.value}</strong>
                <span className="text-xs text-text-tertiary">{metric.label}</span>
              </article>
            ))}
          </section>

          <section className="rounded-lg border border-border bg-bg-secondary p-4" aria-label="XP summary">
            <h3 className="text-sm font-semibold text-text-primary">XP streak & rank</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {xpDetails.map((item) => (
                <article key={item.label} className="rounded-md border border-border bg-bg-primary px-3 py-2 text-center">
                  <span className="text-xs text-text-tertiary">{item.label}</span>
                  <strong className="mt-1 block text-sm font-semibold text-text-primary">{item.value}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-bg-secondary p-4" aria-label="Unlocked emblems">
            <h3 className="text-sm font-semibold text-text-primary">Unlocked emblems</h3>
            <p className="mt-2 text-sm text-text-secondary">
              {profileData.emblems?.unlockedModules?.length
                ? `${profileData.emblems.unlockedModules.length} modules unlocked`
                : 'No emblems earned yet.'}
            </p>
          </section>
        </>
      )}

      {!loading && !error && !profileData && (
        <p className="text-sm text-text-tertiary">No profile data available.</p>
      )}
    </div>
  );
};

export default CommunityProfile;
