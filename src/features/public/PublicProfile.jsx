import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiCopy,
  FiHeart,
  FiMail,
  FiMessageCircle,
  FiMessageSquare,
  FiShare2,
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiActivity,
} from 'react-icons/fi';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaRedditAlien,
  FaTelegramPlane,
  FaWhatsapp,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import cpIcon from '../../assets/icons/CP/cp-icon.webp';
import PageLoader from '../../shared/components/ui/PageLoader';
import { getGithubAvatarDataUri } from '../../shared/utils/avatar';
import { getPublicProfileByHandle } from './publicProfile.service';
import '../../styles/sections/public-profile/index.css';

/* ── Helpers ─────────────────────────────────────────────── */

const normalizeHandle = (handle) => {
  if (!handle) return '';
  return String(handle).trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9._-]/g, '');
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

const getUTCDateKey = (value = new Date()) => {
  const d = new Date(value);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
};

const formatUTCDateLabel = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const resolveContributionLevel = (count = 0) => {
  if (count >= 4) return 4;
  if (count >= 3) return 3;
  if (count >= 2) return 2;
  if (count >= 1) return 1;
  return 0;
};

const buildContributionGrid = (visitDates = [], days = 52 * 7) => {
  const visitSet = new Set((visitDates || []).filter(Boolean));
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startDate = new Date(todayUtc.getTime() - (days - 1) * 86400000);
  const startWeek = new Date(startDate);
  startWeek.setUTCDate(startWeek.getUTCDate() - startWeek.getUTCDay());

  const weekCount = Math.ceil((days + startDate.getUTCDay()) / 7);
  const weeks = Array.from({ length: weekCount }, () => Array(7).fill(null));
  let total = 0;

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 86400000);
    const dateKey = getUTCDateKey(date);
    const count = visitSet.has(dateKey) ? 1 : 0;
    if (count) total += count;
    const weekIndex = Math.floor((date.getTime() - startWeek.getTime()) / (7 * 86400000));
    const dayIndex = date.getUTCDay();
    if (weeks[weekIndex]) weeks[weekIndex][dayIndex] = { date, dateKey, count };
  }

  return { weeks, total };
};

/* Month labels for the contribution grid */
const buildMonthLabels = (weeks) => {
  const labels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstCell = week.find(Boolean);
    if (!firstCell) return;
    const month = firstCell.date.getUTCMonth();
    if (month !== lastMonth) {
      labels.push({ weekIndex: wi, label: firstCell.date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' }) });
      lastMonth = month;
    }
  });
  return labels;
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ── Component ───────────────────────────────────────────── */

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
    (async () => {
      setLoading(true);
      setError('');
      const response = await getPublicProfileByHandle(normalizedHandle);
      if (!mounted) return;
      if (response.success) setProfile(response.data);
      else setError(response.error || 'Profile unavailable.');
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [normalizedHandle]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePath = normalizedHandle ? `/@${normalizedHandle}` : window.location.pathname;
    setShareUrl(`${window.location.origin}${handlePath}`);
  }, [normalizedHandle]);

  const fallbackAvatar = getGithubAvatarDataUri(profile?.name || profile?.hackerHandle || profile?.id || 'member');
  const visitDates = Array.isArray(profile?.activity?.visitDates) ? profile.activity.visitDates : [];
  const contributionData = useMemo(() => buildContributionGrid(visitDates, 364), [visitDates]);
  const monthLabels = useMemo(() => buildMonthLabels(contributionData.weeks), [contributionData.weeks]);

  if (loading) return <PageLoader message="Loading profile..." durationMs={0} />;

  if (error) {
    return (
      <section className="pp-state" aria-live="polite">
        <div className="pp-state-card">
          <h1>Profile not found</h1>
          <p>{error}</p>
          <Link className="pp-state-back" to="/">Back to home</Link>
        </div>
      </section>
    );
  }

  const displayHandle = formatHandle(profile?.hackerHandle || profile?.handle || normalizedHandle);
  const shareTitle = profile?.name ? `${profile.name} • HSOCIETY Profile` : 'HSOCIETY Public Profile';
  const shareText = profile?.bio || 'View this HSOCIETY public profile.';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = [
    { label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, icon: FaXTwitter },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: FaLinkedinIn },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: FaFacebookF },
    { label: 'Reddit', href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, icon: FaRedditAlien },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`, icon: FaWhatsapp },
    { label: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, icon: FaTelegramPlane },
  ];

  const handleShare = async () => {
    if (navigator?.share) {
      try { await navigator.share({ title: shareTitle, text: shareText, url: shareUrl }); return; } catch {}
    }
    setShareOpen(true);
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <>
      <div className="pp-root">
        <div className="pp-layout">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="pp-sidebar">
            {/* Avatar */}
            <div className="pp-avatar-wrap">
              <div className="pp-avatar">
                <img
                  src={profile?.avatarUrl || fallbackAvatar}
                  alt={profile?.name || 'Member'}
                  onError={(e) => { if (e.currentTarget.src !== fallbackAvatar) e.currentTarget.src = fallbackAvatar; }}
                />
              </div>
            </div>

            {/* Identity */}
            <div className="pp-identity">
              <h1 className="pp-name">{profile?.name || 'Community Member'}</h1>
              <p className="pp-handle">{displayHandle}</p>
              {profile?.bio && <p className="pp-bio">{profile.bio}</p>}
            </div>

            {/* CTA buttons */}
            <div className="pp-cta-row">
              <button type="button" className="pp-btn pp-btn--outline" onClick={handleShare}>
                <FiShare2 size={13} /> Share
              </button>
              <Link className="pp-btn pp-btn--ghost" to="/community">
                <FiUsers size={13} /> Community
              </Link>
            </div>

            {/* Meta info */}
            <ul className="pp-meta-list">
              {profile?.role && (
                <li><FiActivity size={14} /><span>{profile.role}</span></li>
              )}
              {profile?.organization && (
                <li><FiMapPin size={14} /><span>{profile.organization}</span></li>
              )}
              {profile?.joinedDate && (
                <li><FiCalendar size={14} /><span>Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></li>
              )}
            </ul>

            {/* Stats sidebar card */}
            <div className="pp-stats-card">
              <div className="pp-stat-row">
                <div className="pp-stat-icon">
                  <img src={cpIcon} alt="CP" className="pp-cp-icon" />
                </div>
                <div className="pp-stat-info">
                  <span className="pp-stat-label">CP</span>
                  <strong className="pp-stat-val">{formatValue(profile?.xpSummary?.totalXp || profile?.stats?.totalXp || 0)}</strong>
                </div>
              </div>
              <div className="pp-stat-row">
                <FiMessageSquare size={15} className="pp-stat-fi" />
                <div className="pp-stat-info">
                  <span className="pp-stat-label">Messages</span>
                  <strong className="pp-stat-val">{formatValue(profile?.stats?.messages || 0)}</strong>
                </div>
              </div>
              <div className="pp-stat-row">
                <FiHeart size={15} className="pp-stat-fi" />
                <div className="pp-stat-info">
                  <span className="pp-stat-label">Likes received</span>
                  <strong className="pp-stat-val">{formatValue(profile?.stats?.likesReceived || 0)}</strong>
                </div>
              </div>
              <div className="pp-stat-row">
                <FiMessageCircle size={15} className="pp-stat-fi" />
                <div className="pp-stat-info">
                  <span className="pp-stat-label">Comments</span>
                  <strong className="pp-stat-val">{formatValue(profile?.stats?.commentsMade || 0)}</strong>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT MAIN ── */}
          <main className="pp-main">

            {/* Contribution graph — GitHub style */}
            <section className="pp-panel pp-contrib-panel">
              <div className="pp-contrib-header">
                <h2 className="pp-section-title">
                  <strong>{formatValue(contributionData.total)}</strong> logins in the last year
                </h2>
                <span className="pp-streak-badge">
                  {formatValue(profile?.xpSummary?.streakDays || 0)} day streak
                </span>
              </div>

              <div className="pp-contrib-scroll">
                <div className="pp-contrib-inner">
                  {/* Month labels row */}
                  <div className="pp-contrib-months" style={{ '--week-count': contributionData.weeks.length }}>
                    {monthLabels.map((ml) => (
                      <span
                        key={`month-${ml.weekIndex}`}
                        className="pp-month-label"
                        style={{ gridColumn: ml.weekIndex + 1 }}
                      >
                        {ml.label}
                      </span>
                    ))}
                  </div>

                  {/* Day labels + grid */}
                  <div className="pp-contrib-body">
                    <div className="pp-day-labels" aria-hidden="true">
                      {DAY_LABELS.map((d, i) => (
                        <span key={d} className={`pp-day-label${i % 2 === 1 ? ' visible' : ''}`}>{d}</span>
                      ))}
                    </div>

                    <div
                      className="pp-contrib-grid"
                      role="grid"
                      aria-label="Login activity over the last year"
                      style={{ '--week-count': contributionData.weeks.length }}
                    >
                      {contributionData.weeks.map((week, wi) => (
                        <div className="pp-contrib-week" role="row" key={`w-${wi}`}>
                          {week.map((cell, di) => {
                            const level = cell ? resolveContributionLevel(cell.count) : 0;
                            const label = cell
                              ? `${formatUTCDateLabel(cell.date)}: ${cell.count} login${cell.count === 1 ? '' : 's'}`
                              : 'No data';
                            return (
                              <span
                                key={`c-${wi}-${di}`}
                                className={`pp-cell level-${level}${!cell ? ' empty' : ''}`}
                                role="gridcell"
                                aria-label={label}
                                title={cell ? label : ''}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="pp-contrib-legend" aria-hidden="true">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((l) => (
                    <span key={l} className={`pp-cell level-${l}`} />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </section>

            {/* Overview */}
            <section className="pp-panel">
              <h2 className="pp-section-title">Overview</h2>
              <p className="pp-overview-text">
                {profile?.summary || profile?.bio || 'This member is building offensive security skills and contributing to the HSOCIETY community.'}
              </p>
              <div className="pp-overview-grid">
                <div className="pp-overview-item">
                  <span>Role</span>
                  <strong>{profile?.role || 'Member'}</strong>
                </div>
                <div className="pp-overview-item">
                  <span>Organization</span>
                  <strong>{profile?.organization || 'Independent'}</strong>
                </div>
                <div className="pp-overview-item">
                  <span>Rank</span>
                  <strong>{formatValue(profile?.xpSummary?.rank || '—')}</strong>
                </div>
                <div className="pp-overview-item">
                  <span>CP Total</span>
                  <strong>{formatValue(profile?.xpSummary?.totalXp || 0)}</strong>
                </div>
              </div>
            </section>

            {/* Activity */}
            <section className="pp-panel">
              <h2 className="pp-section-title">Activity</h2>
              <div className="pp-activity-grid">
                <div className="pp-activity-item">
                  <strong>{formatValue(profile?.xpSummary?.streakDays || 0)}</strong>
                  <span>Day streak</span>
                </div>
                <div className="pp-activity-item">
                  <strong>{formatValue(profile?.stats?.roomsActive || 0)}</strong>
                  <span>Rooms active</span>
                </div>
                <div className="pp-activity-item">
                  <strong>{formatValue(profile?.stats?.imagesShared || 0)}</strong>
                  <span>Images shared</span>
                </div>
                <div className="pp-activity-item">
                  <strong>{formatValue(profile?.stats?.engagements || 0)}</strong>
                  <span>Engagements</span>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* ── SHARE MODAL ── */}
      {shareOpen && (
        <div className="pp-share-overlay" role="dialog" aria-modal="true" aria-label="Share profile">
          <button type="button" className="pp-share-backdrop" aria-label="Close" onClick={() => setShareOpen(false)} />
          <div className="pp-share-card">
            <header className="pp-share-header">
              <h2>Share profile</h2>
              <p>Share this public profile on any platform.</p>
            </header>

            <div className="pp-share-preview">
              <div className="pp-share-avatar">
                <img
                  src={profile?.avatarUrl || fallbackAvatar}
                  alt={profile?.name || 'Member'}
                  onError={(e) => { if (e.currentTarget.src !== fallbackAvatar) e.currentTarget.src = fallbackAvatar; }}
                />
              </div>
              <div className="pp-share-identity">
                <strong>{profile?.name || 'Community Member'}</strong>
                <span>{displayHandle}</span>
                <span className="pp-share-role">{profile?.role || 'Member'}</span>
              </div>
            </div>

            <div className="pp-share-links">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  className="pp-share-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                >
                  <link.icon size={16} aria-hidden="true" />
                </a>
              ))}
              <a
                className="pp-share-link"
                href={`mailto:?subject=${encodedTitle}&body=${encodedText}%0A${encodedUrl}`}
                aria-label="Email"
                title="Email"
              >
                <FiMail size={16} aria-hidden="true" />
              </a>
              <button
                type="button"
                className="pp-share-link"
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : 'Copy link'}
                title={copied ? 'Copied' : 'Copy link'}
              >
                <FiCopy size={16} aria-hidden="true" />
              </button>
            </div>

            <footer className="pp-share-footer">
              <button type="button" className="pp-btn pp-btn--outline" onClick={() => setShareOpen(false)}>Close</button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicProfile;
