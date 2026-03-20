import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { getLeaderboard } from '../../../features/leaderboard/services/leaderboard.service';
import {
  extractLeaderboardEntries,
  buildLeaderboard,
} from '../../../features/leaderboard/services/leaderboard.utils';
import badgeRank1 from '../../../assets/images/badges/Script-Kiddie-badge-rank1.png';
import badgeRank2 from '../../../assets/images/badges/Exploit-Apprentice-Rank2.png';
import badgeRank3 from '../../../assets/images/badges/Payload-Architect-rank3.png';
import badgeRank4 from '../../../assets/images/badges/Red-Team_operative-Rank4.png';
import badgeRank5 from '../../../assets/images/badges/ZeroDay-hunter-Rank5.png';

const BADGE_IMAGES = {
  1: badgeRank1,
  2: badgeRank2,
  3: badgeRank3,
  4: badgeRank4,
  5: badgeRank5,
};

const badgeForEntry = (entry) => {
  if (!entry) return null;
  return {
    id: entry.id,
    label: `Rank ${entry.position || 1}`,
    subtitle: entry.rankTitle || 'Top Operator',
    image: BADGE_IMAGES[entry.position] || BADGE_IMAGES[1],
    entry,
  };
};

const normalizeKey = (value) => {
  if (!value) return '';
  return String(value).trim().replace(/^@/, '').toLowerCase();
};

const collectIdentifiers = (entity) => {
  if (!entity) return [];
  const keys = new Set();
  const fields = ['id', 'userId', 'profileId', 'handle', 'hackerHandle', 'username', 'email', 'name'];
  fields.forEach((key) => {
    const normalized = normalizeKey(entity[key]);
    if (normalized) keys.add(normalized);
  });
  if (entity.user) {
    fields.forEach((key) => {
      const normalized = normalizeKey(entity.user[key]);
      if (normalized) keys.add(normalized);
    });
  }
  if (entity.profile) {
    fields.forEach((key) => {
      const normalized = normalizeKey(entity.profile[key]);
      if (normalized) keys.add(normalized);
    });
  }
  return Array.from(keys);
};

const RankBadgeContext = createContext(null);

export const RankBadgeProvider = ({ children }) => {
  const [topEntry, setTopEntry] = useState(null);

  useEffect(() => {
    let isActive = true;
    const fetchTopEntry = async () => {
      const response = await getLeaderboard(5);
      if (!isActive || !response.success) return;
      const entries = extractLeaderboardEntries(response.data);
      const normalized = buildLeaderboard(entries);
      if (!isActive) return;
      setTopEntry(normalized[0] || null);
    };

    fetchTopEntry();
    const intervalId = typeof window !== 'undefined'
      ? window.setInterval(fetchTopEntry, 5 * 60 * 1000)
      : null;

    return () => {
      isActive = false;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  const topBadge = useMemo(() => badgeForEntry(topEntry), [topEntry]);

  const matchesTopEntry = useCallback(
    (subject) => {
      if (!topEntry || !subject) return false;
      const entryKeys = new Set(collectIdentifiers(topEntry));
      const subjectKeys = collectIdentifiers(subject);
      return subjectKeys.some((key) => entryKeys.has(key));
    },
    [topEntry]
  );

  const getBadgeForProfile = useCallback(
    (subject) => (matchesTopEntry(subject) ? topBadge : null),
    [matchesTopEntry, topBadge]
  );

  const value = useMemo(
    () => ({
      topEntry,
      topBadge,
      matchesTopEntry,
      getBadgeForProfile,
    }),
    [topEntry, topBadge, matchesTopEntry, getBadgeForProfile]
  );

  return (
    <RankBadgeContext.Provider value={value}>
      {children}
    </RankBadgeContext.Provider>
  );
};

export const useRankBadge = () => {
  const context = useContext(RankBadgeContext);
  if (!context) {
    throw new Error('useRankBadge must be used within a RankBadgeProvider');
  }
  return context;
};

export default RankBadgeProvider;
