import { PROFILE_BADGE_MAP } from '../../../data/badges/profileBadges';

const RANK_LEVELS = [
  { id: 'rank-1', min: 0, max: 500, title: 'Script Kiddie' },
  { id: 'rank-2', min: 500, max: 1000, title: 'Exploit Apprentice' },
  { id: 'rank-3', min: 1000, max: 2000, title: 'Payload Architect' },
  { id: 'rank-4', min: 2000, max: 3000, title: 'Red Team Operative' },
  { id: 'rank-5', min: 3000, max: Infinity, title: 'Zero-Day Hunter' },
];

const normalizeRankTitle = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const RANK_TITLE_MAP = RANK_LEVELS.reduce((acc, level) => {
  acc[normalizeRankTitle(level.title)] = level.id;
  return acc;
}, {});

export const normalizeBadges = (rawBadges) => {
  if (!Array.isArray(rawBadges)) return [];
  return rawBadges
    .map((badge) => {
      if (!badge) return null;
      if (typeof badge === 'string') return PROFILE_BADGE_MAP[badge] || null;
      if (badge.id && PROFILE_BADGE_MAP[badge.id]) {
        return { ...PROFILE_BADGE_MAP[badge.id], ...badge };
      }
      if (badge.icon && (badge.name || badge.title)) {
        return { ...badge, name: badge.name || badge.title };
      }
      return null;
    })
    .filter(Boolean);
};

export const getRankBadgeFromXp = (xp) => {
  const totalXp = Number(xp);
  if (Number.isNaN(totalXp)) return null;
  const level = RANK_LEVELS.find((entry) => totalXp >= entry.min && totalXp < entry.max) || RANK_LEVELS[0];
  const badge = PROFILE_BADGE_MAP[level.id];
  if (!badge) return null;
  return {
    ...badge,
    description: `Rank: ${level.title}.`,
  };
};

export const getRankBadgeFromTitle = (title) => {
  if (!title) return null;
  const id = RANK_TITLE_MAP[normalizeRankTitle(title)];
  if (!id) return null;
  const badge = PROFILE_BADGE_MAP[id];
  if (!badge) return null;
  return {
    ...badge,
    description: `Rank: ${badge.name}.`,
  };
};

export const buildProfileBadges = ({ xpSummary, badges = [], rankTitle }) => {
  const rankBadge =
    xpSummary?.totalXp != null
      ? getRankBadgeFromXp(xpSummary.totalXp)
      : getRankBadgeFromTitle(rankTitle || xpSummary?.rank);

  const normalized = normalizeBadges(badges);
  const unique = new Map();
  if (rankBadge) unique.set(rankBadge.id || rankBadge.name, rankBadge);
  normalized.forEach((badge) => {
    const key = badge.id || badge.name;
    if (!unique.has(key)) unique.set(key, badge);
  });
  return Array.from(unique.values());
};
