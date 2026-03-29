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
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import PageLoader from '../../../shared/components/ui/PageLoader';
import { resolveProfileAvatar } from '../../../shared/utils/display/profileAvatar';
import { getPublicProfileByHandle } from '../services/publicProfile.service';
import ProfileBadgeSection from '../../../shared/components/ui/ProfileBadgeSection';
import { buildProfileBadges } from '../../../shared/utils/display/profileBadges';
import {
  publicButtonBase,
  publicButtonGhost,
  publicButtonPrimary,
  publicButtonSmall,
  publicCardDesc,
  publicCardTitle,
  publicCtaCard,
  publicCtaInner,
  publicCtaSection,
  publicHeroActions,
  publicPage,
} from '../../../shared/styles/publicClasses';
import {
  profileAvatar,
  profileAvatarWrap,
  profileBadgeSection,
  profileBadgeTitle,
  profileBio,
  profileButtonBase as profileButtonBaseClass,
  profileButtonGhost as profileButtonGhostClass,
  profileButtonOutline,
  profileCtaRow,
  profileHandle,
  profileIdentity,
  profileLayout,
  profileMain,
  profileMetaItem,
  profileMetaList,
  profileName,
  profilePanel,
  profileRoot,
  profileRootStyle,
  profileSectionTitle,
  profileSidebar,
  profileStatFi,
  profileStatIcon,
  profileStatInfo,
  profileStatLabel,
  profileStatRow,
  profileStatValue,
  profileStatsCard,
} from '../../../shared/styles/profileClasses';

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

  const { src: avatarSrc, fallback: fallbackAvatar } = resolveProfileAvatar(profile);
  const visitDates = Array.isArray(profile?.activity?.visitDates) ? profile.activity.visitDates : [];
  const contributionData = useMemo(() => buildContributionGrid(visitDates, 364), [visitDates]);
  const monthLabels = useMemo(() => buildMonthLabels(contributionData.weeks), [contributionData.weeks]);
  const profileXpSummary = useMemo(() => {
    if (profile?.xpSummary) return profile.xpSummary;
    if (profile?.stats?.totalXp != null) {
      return { totalXp: profile.stats.totalXp, rank: profile?.xpSummary?.rank };
    }
    return null;
  }, [profile]);

  const profileBadges = useMemo(
    () => buildProfileBadges({
      xpSummary: profileXpSummary,
      rankTitle: profileXpSummary?.rank,
      badges: profile?.badges || profile?.unlockedBadges || profile?.achievements?.badges || [],
    }),
    [profile, profileXpSummary]
  );

  const cellBase =
    'h-[var(--pp-cell-size)] w-[var(--pp-cell-size)] rounded-[var(--pp-radius)] border border-[color:color-mix(in_srgb,var(--border-color)_40%,transparent)] bg-[var(--pp-cell-0)] transition-opacity duration-150 hover:opacity-80 hover:outline hover:outline-1 hover:outline-brand';
  const cellEmpty =
    'bg-transparent border-dashed border-[color:color-mix(in_srgb,var(--border-color)_30%,transparent)]';
  const cellLevels = [
    '',
    'bg-[var(--pp-cell-1)] border-[color:color-mix(in_srgb,var(--pp-cell-1)_60%,transparent)]',
    'bg-[var(--pp-cell-2)] border-[color:color-mix(in_srgb,var(--pp-cell-2)_60%,transparent)]',
    'bg-[var(--pp-cell-3)] border-[color:color-mix(in_srgb,var(--pp-cell-3)_60%,transparent)]',
    'bg-[var(--pp-cell-4)] border-[color:color-mix(in_srgb,var(--pp-cell-4)_70%,transparent)] shadow-[0_0_6px_color-mix(in_srgb,var(--primary-color)_35%,transparent)]',
  ];
  const legendCellBase =
    'h-[10px] w-[10px] rounded-[var(--pp-radius)] border border-[color:color-mix(in_srgb,var(--border-color)_40%,transparent)] bg-[var(--pp-cell-0)]';

  if (loading) return <PageLoader message="Loading profile..." durationMs={0} />;

  if (error) {
    return (
      <section className="grid min-h-[65vh] place-items-center px-6 py-12" aria-live="polite">
        <div className="w-full max-w-[420px] text-center">
          <h1 className="mb-2 text-xl font-semibold text-text-primary">Profile not found</h1>
          <p className="mb-6 text-text-secondary">{error}</p>
          <Link className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonPrimary}`} to="/">
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  const displayHandle = profile?.name
    ? `@${profile.name}`
    : formatHandle(profile?.hackerHandle || profile?.handle || normalizedHandle);
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
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        return;
      } catch {
        // no-op
      }
    }
    setShareOpen(true);
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // no-op
    }
  };

  return (
    <>
      <div
        className={`${publicPage} ${profileRoot} text-text-primary`}
        style={profileRootStyle}
      >
        <div className={profileLayout}>

          {/* ── LEFT SIDEBAR ── */}
          <aside className={`${profileSidebar} reveal-on-scroll`}>
            {/* Avatar */}
            <div className={profileAvatarWrap}>
              <div className={profileAvatar}>
                <img
                  src={avatarSrc}
                  alt={profile?.name || 'Member'}
                  onError={(e) => { if (e.currentTarget.src !== fallbackAvatar) e.currentTarget.src = fallbackAvatar; }}
                />
              </div>
            </div>

            {/* Identity */}
            <div className={profileIdentity}>
              <h1 className={profileName}>
                {profile?.name || 'Community Member'}
              </h1>
              <p className={profileHandle}>{displayHandle}</p>
              {profile?.bio && <p className={profileBio}>{profile.bio}</p>}
            </div>

            {/* CTA buttons */}
            <div className={profileCtaRow}>
              <button
                type="button"
                className={`${profileButtonBaseClass} ${profileButtonOutline}`}
                onClick={handleShare}
              >
                <FiShare2 size={13} /> Share
              </button>
              <Link className={`${profileButtonBaseClass} ${profileButtonGhostClass}`} to="/community">
                <FiUsers size={13} /> Community
              </Link>
            </div>

            {/* Meta info */}
            <ul className={profileMetaList}>
              {profile?.role && (
                <li className={profileMetaItem}><FiActivity size={14} /><span>{profile.role}</span></li>
              )}
              {profile?.organization && (
                <li className={profileMetaItem}><FiMapPin size={14} /><span>{profile.organization}</span></li>
              )}
              {profile?.joinedDate && (
                <li className={profileMetaItem}>
                  <FiCalendar size={14} />
                  <span>Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </li>
              )}
            </ul>

            <div className={profileBadgeSection} aria-label="Profile badges">
              <p className={profileBadgeTitle}>Badges</p>
              <ProfileBadgeSection badges={profileBadges} />
            </div>

            {/* Stats sidebar card */}
            <div className={profileStatsCard}>
              <div className={profileStatRow}>
                <div className={profileStatIcon}>
                  <img src={cpIcon} alt="CP" className="h-[18px] w-[18px] object-contain drop-shadow-[0_0_4px_color-mix(in_srgb,var(--primary-color)_55%,transparent)]" />
                </div>
                <div className={profileStatInfo}>
                  <span className={profileStatLabel}>CP</span>
                  <strong className={profileStatValue}>{formatValue(profile?.xpSummary?.totalXp || profile?.stats?.totalXp || 0)}</strong>
                </div>
              </div>
              <div className={profileStatRow}>
                <FiMessageSquare size={15} className={profileStatFi} />
                <div className={profileStatInfo}>
                  <span className={profileStatLabel}>Messages</span>
                  <strong className={profileStatValue}>{formatValue(profile?.stats?.messages || 0)}</strong>
                </div>
              </div>
              <div className={profileStatRow}>
                <FiHeart size={15} className={profileStatFi} />
                <div className={profileStatInfo}>
                  <span className={profileStatLabel}>Likes received</span>
                  <strong className={profileStatValue}>{formatValue(profile?.stats?.likesReceived || 0)}</strong>
                </div>
              </div>
              <div className={profileStatRow}>
                <FiMessageCircle size={15} className={profileStatFi} />
                <div className={profileStatInfo}>
                  <span className={profileStatLabel}>Comments</span>
                  <strong className={profileStatValue}>{formatValue(profile?.stats?.commentsMade || 0)}</strong>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT MAIN ── */}
          <main className={profileMain}>

            {/* Contribution graph — GitHub style */}
            <section className={`${profilePanel} overflow-hidden`}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-sm font-semibold text-text-primary">
                  <strong>{formatValue(contributionData.total)}</strong> logins in the last year
                </h2>
                <span className="rounded-full border border-[color-mix(in_srgb,var(--primary-color)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary-color)_12%,transparent)] px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-brand">
                  {formatValue(profile?.xpSummary?.streakDays || 0)} day streak
                </span>
              </div>

              <div className="w-full overflow-x-auto pb-1">
                <div className="flex min-w-max flex-col gap-1">
                  {/* Month labels row */}
                  <div
                    className="grid pl-[30px] [grid-template-columns:repeat(var(--week-count),calc(var(--pp-cell-size)+var(--pp-cell-gap)))]"
                    style={{ '--week-count': contributionData.weeks.length }}
                  >
                    {monthLabels.map((ml) => (
                      <span
                        key={`month-${ml.weekIndex}`}
                        className="text-[0.68rem] text-[color:var(--pp-muted)]"
                        style={{ gridColumn: ml.weekIndex + 1 }}
                      >
                        {ml.label}
                      </span>
                    ))}
                  </div>

                  {/* Day labels + grid */}
                  <div className="flex items-start gap-2">
                    <div
                      className="grid w-[26px] pr-1 [grid-template-rows:repeat(7,calc(var(--pp-cell-size)+var(--pp-cell-gap)))]"
                      aria-hidden="true"
                    >
                      {DAY_LABELS.map((d, i) => (
                        <span
                          key={d}
                          className={[
                            'text-right text-[0.62rem] leading-[calc(var(--pp-cell-size)+var(--pp-cell-gap))] text-transparent select-none',
                            i % 2 === 1 ? 'text-[color:var(--pp-muted)]' : '',
                          ].join(' ')}
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    <div
                      className="grid auto-cols-[var(--pp-cell-size)] grid-flow-col items-start gap-[var(--pp-cell-gap)]"
                      role="grid"
                      aria-label="Login activity over the last year"
                      style={{ '--week-count': contributionData.weeks.length }}
                    >
                      {contributionData.weeks.map((week, wi) => (
                        <div
                          className="grid [grid-template-rows:repeat(7,var(--pp-cell-size))] gap-[var(--pp-cell-gap)]"
                          role="row"
                          key={`w-${wi}`}
                        >
                          {week.map((cell, di) => {
                            const level = cell ? resolveContributionLevel(cell.count) : 0;
                            const label = cell
                              ? `${formatUTCDateLabel(cell.date)}: ${cell.count} login${cell.count === 1 ? '' : 's'}`
                              : 'No data';
                            return (
                              <span
                                key={`c-${wi}-${di}`}
                                className={[
                                  cellBase,
                                  cellLevels[level],
                                  !cell ? cellEmpty : '',
                                ].join(' ')}
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
                <div className="mt-2 flex items-center justify-end gap-2 text-[0.72rem] text-[color:var(--pp-muted)]" aria-hidden="true">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((l) => (
                    <span
                      key={l}
                      className={[
                        legendCellBase,
                        cellLevels[l],
                      ].join(' ')}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </section>

            {/* Overview */}
            <section className={profilePanel}>
              <h2 className={profileSectionTitle}>Overview</h2>
              <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                {profile?.summary || profile?.bio || 'This member is building offensive security skills and contributing to the HSOCIETY community.'}
              </p>
              <div className="grid grid-cols-2 overflow-hidden rounded-md border border-[color:var(--pp-border)]">
                <div className="flex flex-col gap-1 border-b border-r border-[color:var(--pp-border)] px-4 py-3">
                  <span className="text-[0.68rem] uppercase tracking-[0.1em] text-[color:var(--pp-muted)]">Role</span>
                  <strong className="text-sm font-semibold text-text-primary">{profile?.role || 'Member'}</strong>
                </div>
                <div className="flex flex-col gap-1 border-b border-[color:var(--pp-border)] px-4 py-3">
                  <span className="text-[0.68rem] uppercase tracking-[0.1em] text-[color:var(--pp-muted)]">Organization</span>
                  <strong className="text-sm font-semibold text-text-primary">{profile?.organization || 'Independent'}</strong>
                </div>
                <div className="flex flex-col gap-1 border-r border-[color:var(--pp-border)] px-4 py-3">
                  <span className="text-[0.68rem] uppercase tracking-[0.1em] text-[color:var(--pp-muted)]">Rank</span>
                  <strong className="text-sm font-semibold text-text-primary">{formatValue(profile?.xpSummary?.rank || '—')}</strong>
                </div>
                <div className="flex flex-col gap-1 px-4 py-3">
                  <span className="text-[0.68rem] uppercase tracking-[0.1em] text-[color:var(--pp-muted)]">CP Total</span>
                  <strong className="text-sm font-semibold text-text-primary">{formatValue(profile?.xpSummary?.totalXp || 0)}</strong>
                </div>
              </div>
            </section>

            {/* Activity */}
            <section className={profilePanel}>
              <h2 className={profileSectionTitle}>Activity</h2>
              <div className="grid grid-cols-4 overflow-hidden rounded-md border border-[color:var(--pp-border)] text-center max-md:grid-cols-2">
                <div className="flex flex-col gap-1 border-b border-r border-[color:var(--pp-border)] px-4 py-4 max-md:border-b max-md:border-r">
                  <strong className="text-[1.35rem] font-semibold tracking-[-0.02em] text-text-primary max-md:text-lg">
                    {formatValue(profile?.xpSummary?.streakDays || 0)}
                  </strong>
                  <span className="text-[0.72rem] uppercase tracking-[0.08em] text-[color:var(--pp-muted)]">Day streak</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-[color:var(--pp-border)] px-4 py-4">
                  <strong className="text-[1.35rem] font-semibold tracking-[-0.02em] text-text-primary max-md:text-lg">
                    {formatValue(profile?.stats?.roomsActive || 0)}
                  </strong>
                  <span className="text-[0.72rem] uppercase tracking-[0.08em] text-[color:var(--pp-muted)]">Rooms active</span>
                </div>
                <div className="flex flex-col gap-1 border-r border-[color:var(--pp-border)] px-4 py-4 max-md:border-r max-md:border-b-0">
                  <strong className="text-[1.35rem] font-semibold tracking-[-0.02em] text-text-primary max-md:text-lg">
                    {formatValue(profile?.stats?.imagesShared || 0)}
                  </strong>
                  <span className="text-[0.72rem] uppercase tracking-[0.08em] text-[color:var(--pp-muted)]">Images shared</span>
                </div>
                <div className="flex flex-col gap-1 px-4 py-4">
                  <strong className="text-[1.35rem] font-semibold tracking-[-0.02em] text-text-primary max-md:text-lg">
                    {formatValue(profile?.stats?.engagements || 0)}
                  </strong>
                  <span className="text-[0.72rem] uppercase tracking-[0.08em] text-[color:var(--pp-muted)]">Engagements</span>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicCtaSection}`}>
        <div className={`section-container ${publicCtaInner}`}>
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Join the community
            </p>
            <h2 className="section-title">Build your public operator profile.</h2>
            <p className="section-subtitle">Complete missions, earn CP points, and showcase your progress.</p>
            <div className={publicHeroActions}>
              <Link className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonPrimary}`} to="/register">
                Get started
              </Link>
              <Link className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonGhost}`} to="/community">
                Explore community
              </Link>
            </div>
          </div>
          <div className={publicCtaCard}>
            <h3 className={publicCardTitle}>Live profiles, real signals.</h3>
            <p className={publicCardDesc}>Your progress, streaks, and engagement history — all in one place.</p>
          </div>
        </div>
      </section>

      {/* ── SHARE MODAL ── */}
      {shareOpen && (
        <div className="fixed inset-0 z-[2000] grid place-items-center p-6" role="dialog" aria-modal="true" aria-label="Share profile">
          <button type="button" className="absolute inset-0 cursor-pointer border-0 bg-black/65" aria-label="Close" onClick={() => setShareOpen(false)} />
          <div className="relative z-10 flex w-full max-w-[520px] flex-col gap-4 rounded-lg border border-[color:var(--pp-border)] bg-bg-secondary p-6 shadow-xl">
            <header>
              <h2 className="text-lg font-semibold text-text-primary">Share profile</h2>
              <p className="text-sm text-text-secondary">Share this public profile on any platform.</p>
            </header>

            <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-md border border-[color:var(--pp-border)] bg-[color-mix(in_srgb,var(--bg-tertiary)_60%,transparent)] p-3">
              <div className="h-[52px] w-[52px] overflow-hidden rounded-full border border-[color-mix(in_srgb,var(--primary-color)_30%,var(--pp-border))] bg-bg-primary">
                <img
                  src={avatarSrc}
                  alt={profile?.name || 'Member'}
                  onError={(e) => { if (e.currentTarget.src !== fallbackAvatar) e.currentTarget.src = fallbackAvatar; }}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <strong className="text-sm text-text-primary">{profile?.name || 'Community Member'}</strong>
                <span className="text-xs text-text-tertiary">{displayHandle}</span>
                <span className="text-[0.7rem] uppercase tracking-[0.1em] text-text-tertiary">{profile?.role || 'Member'}</span>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(44px,1fr))] gap-2 max-sm:grid-cols-2">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[color:var(--pp-border)] bg-[color-mix(in_srgb,var(--bg-secondary)_80%,transparent)] text-text-secondary transition-colors hover:border-[color-mix(in_srgb,var(--primary-color)_50%,var(--pp-border))] hover:text-text-primary"
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
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[color:var(--pp-border)] bg-[color-mix(in_srgb,var(--bg-secondary)_80%,transparent)] text-text-secondary transition-colors hover:border-[color-mix(in_srgb,var(--primary-color)_50%,var(--pp-border))] hover:text-text-primary"
                href={`mailto:?subject=${encodedTitle}&body=${encodedText}%0A${encodedUrl}`}
                aria-label="Email"
                title="Email"
              >
                <FiMail size={16} aria-hidden="true" />
              </a>
              <button
                type="button"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[color:var(--pp-border)] bg-[color-mix(in_srgb,var(--bg-secondary)_80%,transparent)] text-text-secondary transition-colors hover:border-[color-mix(in_srgb,var(--primary-color)_50%,var(--pp-border))] hover:text-text-primary"
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : 'Copy link'}
                title={copied ? 'Copied' : 'Copy link'}
              >
                <FiCopy size={16} aria-hidden="true" />
              </button>
            </div>

            <footer className="flex justify-end">
              <button
                type="button"
                className={`${profileButtonBaseClass} ${profileButtonOutline}`}
                onClick={() => setShareOpen(false)}
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicProfile;
