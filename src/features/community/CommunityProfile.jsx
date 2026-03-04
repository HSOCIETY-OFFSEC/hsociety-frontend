import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiAward,
  FiHash,
  FiHeart,
  FiImage,
  FiMessageCircle,
  FiMessageSquare,
} from 'react-icons/fi';
import { IoFlameOutline } from 'react-icons/io5';
import cpIcon from '../../assets/icons/CP/cp-icon.png';
import { useAuth } from '../../core/auth/AuthContext';
import { getCommunityProfile } from './community.service';
import CommunitySidebar from './components/sidebar/CommunitySidebar';
import { getGithubAvatarDataUri } from '../../shared/utils/avatar';
import { COMMUNITY_PROFILE_DATA } from '../../data/community/communityProfileData';
import '../../styles/sections/community/base.css';
import '../../styles/sections/community/profile.css';

const CommunityProfile = () => {
  const { user } = useAuth();
  const { handle } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [xpSummary, setXpSummary] = useState(null);
  const [emblems, setEmblems] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const role = useMemo(() => {
    if (user?.role === 'client') return 'corporate';
    return user?.role || COMMUNITY_PROFILE_DATA.roleFallback;
  }, [user?.role]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      const response = await getCommunityProfile(handle);
      if (!mounted) return;

      if (response.success) {
        setProfile(response.data.user || null);
        setStats(response.data.stats || null);
        setXpSummary(response.data.xpSummary || null);
        setEmblems(response.data.emblems || null);
      } else {
        setError(response.error || COMMUNITY_PROFILE_DATA.loadError);
      }
      setLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [handle]);

  const fallbackAvatar = getGithubAvatarDataUri(
    profile?.name || profile?.hackerHandle || profile?.id || 'user'
  );

  const displayHandle = profile?.hackerHandle
    ? `@${profile.hackerHandle}`
      : profile?.name
      ? `@${profile.name.split(' ')[0].toLowerCase()}`
      : COMMUNITY_PROFILE_DATA.handleFallback;

  return (
    <div className="community-root">
      <CommunitySidebar
        role={role}
        mobileOpen={mobileNavOpen}
        onCloseMobileNav={() => setMobileNavOpen(false)}
      />

      <main className="community-main community-profile" aria-label="Community profile">
        <header className="community-profile-header">
          <button
            type="button"
            className="community-profile-back"
            onClick={() => navigate('/community')}
          >
            <FiArrowLeft size={16} />
            {COMMUNITY_PROFILE_DATA.backToCommunityLabel}
          </button>

          <button
            type="button"
            className="community-profile-menu"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-label={COMMUNITY_PROFILE_DATA.closeNavAria}
          >
            <FiHash size={16} />
          </button>
        </header>

        {loading ? (
          <div className="community-profile-state">{COMMUNITY_PROFILE_DATA.loadingText}</div>
        ) : error ? (
          <div className="community-profile-state error">{error}</div>
        ) : (
          <section className="community-profile-card">
            <div className="community-profile-identity">
              <img
                src={profile?.avatarUrl || fallbackAvatar}
                alt={profile?.name || COMMUNITY_PROFILE_DATA.memberFallback}
                onError={(e) => {
                  if (e.currentTarget.src !== fallbackAvatar) {
                    e.currentTarget.src = fallbackAvatar;
                  }
                }}
              />
              <div>
                <p className="community-profile-handle">{displayHandle}</p>
                <h1>{profile?.name || COMMUNITY_PROFILE_DATA.memberFallback}</h1>
                <div className="community-profile-meta">
                  <span className="community-profile-role">
                    {profile?.role || COMMUNITY_PROFILE_DATA.roleFallbackLabel}
                  </span>
                  {profile?.organization && <span>{profile.organization}</span>}
                </div>
              </div>
            </div>

            {profile?.bio && <p className="community-profile-bio">{profile.bio}</p>}

            <div className="community-profile-stats">
              <div className="community-profile-stat">
                <FiMessageSquare size={16} />
                <div>
                  <strong>{stats?.messages || 0}</strong>
                  <span>{COMMUNITY_PROFILE_DATA.statsLabels.messages}</span>
                </div>
              </div>
              <div className="community-profile-stat">
                <FiHeart size={16} />
                <div>
                  <strong>{stats?.likesReceived || 0}</strong>
                  <span>{COMMUNITY_PROFILE_DATA.statsLabels.likesReceived}</span>
                </div>
              </div>
              <div className="community-profile-stat">
                <FiMessageCircle size={16} />
                <div>
                  <strong>{stats?.commentsMade || 0}</strong>
                  <span>{COMMUNITY_PROFILE_DATA.statsLabels.commentsMade}</span>
                </div>
              </div>
              <div className="community-profile-stat">
                <FiImage size={16} />
                <div>
                  <strong>{stats?.imagesShared || 0}</strong>
                  <span>{COMMUNITY_PROFILE_DATA.statsLabels.imagesShared}</span>
                </div>
              </div>
              <div className="community-profile-stat">
                <FiHash size={16} />
                <div>
                  <strong>{stats?.roomsActive || 0}</strong>
                  <span>{COMMUNITY_PROFILE_DATA.statsLabels.roomsActive}</span>
                </div>
              </div>
              <div className="community-profile-stat">
                <FiAward size={16} />
                <div>
                  <strong>{xpSummary?.rank || COMMUNITY_PROFILE_DATA.rankFallback}</strong>
                  <span>{COMMUNITY_PROFILE_DATA.statsLabels.rank}</span>
                </div>
              </div>
              <div className="community-profile-stat">
                <IoFlameOutline size={16} />
                <div>
                  <strong>{xpSummary?.streakDays || 0} days</strong>
                  <span>{COMMUNITY_PROFILE_DATA.statsLabels.streak}</span>
                </div>
              </div>
              <div className="community-profile-stat">
                <img src={cpIcon} alt="CP" className="community-cp-icon" />
                <div>
                  <strong>{xpSummary?.totalXp || 0}</strong>
                  <span>{COMMUNITY_PROFILE_DATA.statsLabels.cp}</span>
                </div>
              </div>
              <div className="community-profile-stat">
                <FiAward size={16} />
                <div>
                  <strong>{Array.isArray(emblems?.unlockedModules) ? emblems.unlockedModules.length : 0}/5</strong>
                  <span>{COMMUNITY_PROFILE_DATA.statsLabels.emblems}</span>
                </div>
              </div>
            </div>

            <div className="community-profile-emblems">
              {[1, 2, 3, 4, 5].map((moduleId) => {
                const unlocked = Array.isArray(emblems?.unlockedModules)
                  ? emblems.unlockedModules.includes(moduleId)
                  : false;
                return (
                  <div
                    key={moduleId}
                    className={`community-profile-emblem ${unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <span>Phase {String(moduleId).padStart(2, '0')}</span>
                    <strong>{unlocked ? 'Unlocked' : 'Locked'}</strong>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {mobileNavOpen && (
        <button
          type="button"
          className="community-mobile-nav-overlay"
          onClick={() => setMobileNavOpen(false)}
          aria-label={COMMUNITY_PROFILE_DATA.mobileNavCloseAria}
        />
      )}
    </div>
  );
};

export default CommunityProfile;
