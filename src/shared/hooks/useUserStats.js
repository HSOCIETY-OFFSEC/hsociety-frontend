import { useEffect, useMemo, useState } from 'react';
import { getProfile } from '../../features/account/account.service';
import { getStudentXpSummary } from '../../features/student/services/learn.service';

const CACHE_TTL_MS = 60 * 1000;

const subscribers = new Set();
const cache = {
  userId: null,
  role: null,
  cpTotal: 0,
  streakDays: 0,
  updatedAt: 0,
  inFlightKey: null,
  inFlight: null,
};

const isFresh = (userId, role) =>
  cache.userId === userId &&
  cache.role === role &&
  Date.now() - cache.updatedAt < CACHE_TTL_MS;

const notify = () => {
  subscribers.forEach((fn) => fn({ cpTotal: cache.cpTotal, streakDays: cache.streakDays }));
};

const updateCache = ({ userId, role, cpTotal, streakDays }) => {
  cache.userId = userId;
  cache.role = role;
  cache.cpTotal = Number(cpTotal || 0);
  cache.streakDays = Number(streakDays || 0);
  cache.updatedAt = Date.now();
  notify();
};

const fetchUserStats = async (userId, role, { force = false } = {}) => {
  const requestKey = `${userId || 'anon'}:${role || 'none'}`;

  if (!userId) {
    updateCache({ userId: null, role: null, cpTotal: 0, streakDays: 0 });
    return { cpTotal: 0, streakDays: 0 };
  }

  if (!force && isFresh(userId, role)) {
    return { cpTotal: cache.cpTotal, streakDays: cache.streakDays };
  }

  if (cache.inFlight && cache.inFlightKey === requestKey) {
    return cache.inFlight;
  }

  cache.inFlightKey = requestKey;
  cache.inFlight = (async () => {
    const [profileResponse, streakResponse] = await Promise.all([
      getProfile(),
      role === 'student' ? getStudentXpSummary() : Promise.resolve({ success: true, data: { streakDays: 0 } }),
    ]);

    const cpTotal = profileResponse.success ? Number(profileResponse.data?.xpSummary?.totalXp || 0) : 0;
    const streakDays =
      role === 'student' && streakResponse.success
        ? Number(streakResponse.data?.streakDays || 0)
        : 0;

    updateCache({ userId, role, cpTotal, streakDays });
    return { cpTotal, streakDays };
  })()
    .finally(() => {
      cache.inFlightKey = null;
      cache.inFlight = null;
    });

  return cache.inFlight;
};

export const useUserStats = (userId, role) => {
  const [stats, setStats] = useState(() => ({ cpTotal: cache.cpTotal, streakDays: cache.streakDays }));

  useEffect(() => {
    const listener = (nextStats) => setStats(nextStats);
    subscribers.add(listener);
    return () => subscribers.delete(listener);
  }, []);

  useEffect(() => {
    fetchUserStats(userId, role).catch(() => {
      if (!userId) {
        setStats({ cpTotal: 0, streakDays: 0 });
      }
    });
  }, [userId, role]);

  const refreshUserStats = useMemo(
    () => () => fetchUserStats(userId, role, { force: true }),
    [userId, role]
  );

  return {
    cpTotal: stats.cpTotal,
    streakDays: stats.streakDays,
    refreshUserStats,
  };
};

export default useUserStats;
