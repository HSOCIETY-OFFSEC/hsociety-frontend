import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiCopy,
  FiHeart,
  FiMail,
  FiMessageCircle,
  FiMessageSquare,
  FiShare2,
  FiUsers
} from 'react-icons/fi';
import cpIcon from '../../assets/icons/CP/cp-icon.webp';
import PageLoader from '../../shared/components/ui/PageLoader';
import { getGithubAvatarDataUri } from '../../shared/utils/avatar';
import { getPublicProfileByHandle } from './publicProfile.service';
import '../../styles/sections/public-profile/index.css';

const normalizeHandle = (handle) => {
  if (!handle) return '';
  const raw = String(handle).trim().replace(/^@/, '').toLowerCase();
  return raw.replace(/[^a-z0-9._-]/g, '');
};

const formatHandle = (handle) => {
  const safe = normalizeHandle(handle);
  return safe ? `@${safe}` : '@member';
};

const formatValue = (value, fallback = '—') => {
  if (value === null || value === undefined || Number.isNaN(value)) return fallback;
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
};

const PublicProfile = () => {
  const { handle } = useParams();
  const normalizedHandle = useMemo(() => normalizeHandle(handle), [handle]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      const response = await getPublicProfileByHandle(normalizedHandle);
      if (!mounted) return;
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.error || 'Profile unavailable.');
      }
      setLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [normalizedHandle]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const origin = window.location.origin;
    const handlePath = normalizedHandle ? `/@${normalizedHandle}` : window.location.pathname;
    setShareUrl(`${origin}${handlePath}`);
  }, [normalizedHandle]);

  const fallbackAvatar = getGithubAvatarDataUri(
    profile?.name || profile?.hackerHandle || profile?.id || 'member'
  );

  if (loading) {
    return <PageLoader message="Loading public profile..." durationMs={0} />;
  }

  if (error) {
    return (
      <section className="public-profile-state" aria-live="polite">
        <div className="public-profile-state-card">
          <h1>Profile not found</h1>
          <p>{error}</p>
          <Link className="public-profile-back" to="/">
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  const displayHandle = formatHandle(profile?.hackerHandle || profile?.handle || normalizedHandle);
  const shareTitle = profile?.name
    ? `${profile.name} • HSOCIETY Profile`
    : 'HSOCIETY Public Profile';
  const shareText = profile?.bio
    ? `${profile.bio}`
    : 'View this HSOCIETY public profile.';

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = [
    { label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'Reddit', href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
    { label: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` }
  ];

  const handleShare = async () => {
    if (typeof navigator === 'undefined') return setShareOpen(true);
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch {
        // Fall back to modal share panel
      }
    }
    setShareOpen(true);
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <section className="public-profile" aria-label="Public profile">
      <div className="public-profile-hero">
        <div className="public-profile-card">
          <div className="public-profile-avatar">
            <img
              src={profile?.avatarUrl || fallbackAvatar}
              alt={profile?.name || 'Community member'}
              onError={(e) => {
                if (e.currentTarget.src !== fallbackAvatar) {
                  e.currentTarget.src = fallbackAvatar;
                }
              }}
            />
            <span className="public-profile-ring" aria-hidden="true" />
          </div>

          <div className="public-profile-identity">
            <p className="public-profile-handle">{displayHandle}</p>
            <h1>{profile?.name || 'Community Member'}</h1>
            <p className="public-profile-role">{profile?.role || 'Member'}</p>
            {profile?.bio && <p className="public-profile-bio">{profile.bio}</p>}

            <div className="public-profile-actions">
              <button type="button" className="public-profile-action" onClick={handleShare}>
                <FiShare2 size={14} />
                Share
              </button>
              <Link className="public-profile-action ghost" to="/community">
                <FiUsers size={14} />
                Community
              </Link>
            </div>
          </div>
        </div>

        <div className="public-profile-stats">
          <div className="public-profile-stat">
            <div className="public-profile-stat-icon">
              <img src={cpIcon} alt="CP" />
            </div>
            <div>
              <span>Cyber Points</span>
              <strong>{formatValue(profile?.xpSummary?.totalXp || profile?.stats?.totalXp || 0)}</strong>
            </div>
          </div>
          <div className="public-profile-stat">
            <FiMessageSquare size={16} />
            <div>
              <span>Messages</span>
              <strong>{formatValue(profile?.stats?.messages || 0)}</strong>
            </div>
          </div>
          <div className="public-profile-stat">
            <FiHeart size={16} />
            <div>
              <span>Likes</span>
              <strong>{formatValue(profile?.stats?.likesReceived || 0)}</strong>
            </div>
          </div>
          <div className="public-profile-stat">
            <FiMessageCircle size={16} />
            <div>
              <span>Comments</span>
              <strong>{formatValue(profile?.stats?.commentsMade || 0)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="public-profile-panels">
        <section className="public-profile-panel">
          <h2>Overview</h2>
          <p>
            {profile?.summary ||
              profile?.bio ||
              'This member is building offensive security skills and contributing to the HSOCIETY community.'}
          </p>
          <div className="public-profile-meta">
            <div>
              <span>Role</span>
              <strong>{profile?.role || 'Member'}</strong>
            </div>
            <div>
              <span>Organization</span>
              <strong>{profile?.organization || 'Independent'}</strong>
            </div>
            <div>
              <span>Rank</span>
              <strong>{formatValue(profile?.xpSummary?.rank || '—')}</strong>
            </div>
          </div>
        </section>

        <section className="public-profile-panel">
          <h2>Activity</h2>
          <div className="public-profile-activity-grid">
            <div>
              <span>Streak</span>
              <strong>{formatValue(profile?.xpSummary?.streakDays || 0)} days</strong>
            </div>
            <div>
              <span>Rooms Active</span>
              <strong>{formatValue(profile?.stats?.roomsActive || 0)}</strong>
            </div>
            <div>
              <span>Images Shared</span>
              <strong>{formatValue(profile?.stats?.imagesShared || 0)}</strong>
            </div>
            <div>
              <span>Engagements</span>
              <strong>{formatValue(profile?.stats?.engagements || 0)}</strong>
            </div>
          </div>
        </section>
      </div>
      </section>

      {shareOpen && (
        <div className="public-profile-share" role="dialog" aria-modal="true">
          <button
            type="button"
            className="public-profile-share-overlay"
            aria-label="Close share panel"
            onClick={() => setShareOpen(false)}
          />
          <div className="public-profile-share-card">
            <header>
              <h2>Share profile</h2>
              <p>Share this public profile on any platform.</p>
            </header>

            <div className="public-profile-share-preview">
              <div className="public-profile-share-avatar">
                <img
                  src={profile?.avatarUrl || fallbackAvatar}
                  alt={profile?.name || 'Community member'}
                  onError={(e) => {
                    if (e.currentTarget.src !== fallbackAvatar) {
                      e.currentTarget.src = fallbackAvatar;
                    }
                  }}
                />
              </div>
              <div>
                <strong>{profile?.name || 'Community Member'}</strong>
                <span>{displayHandle}</span>
                <span className="public-profile-share-role">{profile?.role || 'Member'}</span>
              </div>
            </div>

            <div className="public-profile-share-actions">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  className="public-profile-share-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
              <a
                className="public-profile-share-link"
                href={`mailto:?subject=${encodedTitle}&body=${encodedText}%0A${encodedUrl}`}
              >
                <FiMail size={14} />
                Email
              </a>
              <button type="button" className="public-profile-share-link" onClick={handleCopy}>
                <FiCopy size={14} />
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>

            <div className="public-profile-share-footer">
              <button type="button" onClick={() => setShareOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicProfile;
