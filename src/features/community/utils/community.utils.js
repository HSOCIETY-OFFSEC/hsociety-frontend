import { getGithubAvatarDataUri } from '../../../shared/utils/avatar';
import { getProfileFallbackSeed, getProfileAvatarUrl } from '../../../shared/utils/profileAvatar';

export const formatMessageTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const getDisplayName = (value) => value || 'User';

export const getAvatarSrc = (value, fallbackSeed) => {
  if (value) return value;
  return getGithubAvatarDataUri(fallbackSeed || 'user');
};

export const getUserAvatar = (user) =>
  getAvatarSrc(getProfileAvatarUrl(user), getProfileFallbackSeed(user));

export const getMessageAvatar = (message) =>
  getAvatarSrc(
    getProfileAvatarUrl(message) || getProfileAvatarUrl(message?.user),
    (() => {
      const messageSeed = getProfileFallbackSeed(message);
      if (messageSeed === 'user' && message?.user) {
        return getProfileFallbackSeed(message.user);
      }
      return messageSeed;
    })()
  );
