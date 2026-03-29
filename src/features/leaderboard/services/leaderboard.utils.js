export const extractLeaderboardEntries = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.leaderboard)) return payload.leaderboard;
  if (Array.isArray(payload.entries)) return payload.entries;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.profiles)) return payload.profiles;
  return [];
};

export const normalizeLeaderboardEntry = (entry = {}) => {
  const name = entry.name || entry.fullName || entry.username || entry.handle || 'Anonymous';
  const handle = entry.name || entry.handle || entry.hackerHandle || entry.username || '';
  const rankTitle = entry.rank || entry.rankTitle || entry.tier || 'Candidate';
  const totalCp = Number(
    entry.cpTotal ??
      entry.totalCp ??
      entry.cp ??
      entry.xpSummary?.totalCp ??
      entry.totalXp ??
      entry.xp ??
      0
  );
  const streakDays = Number(
    entry.streakDays ??
      entry.streak ??
      entry.xpSummary?.streakDays ??
      0
  );

  return {
    id: entry.id || entry.userId || entry.profileId || handle || name,
    name,
    handle,
    rankTitle,
    totalCp,
    streakDays,
    avatarUrl: entry.avatarUrl || entry.avatar || entry.profileImage || '',
  };
};

export const buildLeaderboard = (entries = []) => {
  const normalized = entries.map(normalizeLeaderboardEntry).filter(Boolean);
  const sorted = normalized
    .sort((a, b) => {
      if (b.totalCp !== a.totalCp) return b.totalCp - a.totalCp;
      if (b.streakDays !== a.streakDays) return b.streakDays - a.streakDays;
      return a.name.localeCompare(b.name);
    })
    .map((entry, index) => ({
      ...entry,
      position: index + 1
    }));

  return sorted;
};

export default {
  extractLeaderboardEntries,
  normalizeLeaderboardEntry,
  buildLeaderboard
};
