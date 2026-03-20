import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCommunityProfile } from '../services/community.service';
import ProfileBadgeSection from '../../../shared/components/ui/ProfileBadgeSection';
import { buildProfileBadges } from '../../../shared/utils/display/profileBadges';
import { resolveProfileAvatar } from '../../../shared/utils/display/profileAvatar';
import '../styles/community.css';

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
    <div className="community-profile">
      <div className="community-profile-head">
        <button type="button" className="community-profile-back" onClick={handleBack}>
          ← Back to community
        </button>
        <h1>Community profile</h1>
      </div>

      {loading && <p className="community-profile-state">Loading profile…</p>}
      {error && <p className="community-profile-state error">{error}</p>}

      {!loading && !error && profileData && (
        <>
          <section className="community-profile-hero">
            <img
              src={heroAvatarSrc}
              alt={profileData.user.name || profileData.user.hackerHandle}
              onError={(e) => {
                if (e.currentTarget.src !== heroAvatarFallback) {
                  e.currentTarget.src = heroAvatarFallback;
                }
              }}
            />
            <div>
              <p className="community-profile-handle">
                @{profileData.user.name || profileData.user.hackerHandle || profileData.user.id}
              </p>
              <h2>{profileData.user.name || 'Community member'}</h2>
              <div className="community-profile-badges" aria-label="Profile badges">
                <p className="community-profile-badges-title">Badges</p>
                <ProfileBadgeSection badges={profileBadges} />
              </div>
              {profileData.user.organization && (
                <p className="community-profile-meta">{profileData.user.organization}</p>
              )}
              <p className="community-profile-meta">
                Joined {formatDate(profileData.user.joinedAt)}
              </p>
              {profileData.user.bio && (
                <p className="community-profile-bio">{profileData.user.bio}</p>
              )}
            </div>
          </section>

          <section className="community-profile-metrics" aria-label="Interaction metrics">
            {metrics.map((metric) => (
              <article key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </section>

          <section className="community-profile-xp" aria-label="XP summary">
            <h3>XP streak & rank</h3>
            <div className="community-profile-xp-grid">
              {xpDetails.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="community-profile-emblems" aria-label="Unlocked emblems">
            <h3>Unlocked emblems</h3>
            <p>
              {profileData.emblems?.unlockedModules?.length
                ? `${profileData.emblems.unlockedModules.length} modules unlocked`
                : 'No emblems earned yet.'}
            </p>
          </section>
        </>
      )}

      {!loading && !error && !profileData && (
        <p className="community-profile-state">No profile data available.</p>
      )}
    </div>
  );
};

export default CommunityProfile;
