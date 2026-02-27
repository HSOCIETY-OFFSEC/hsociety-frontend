import { getGithubAvatarDataUri } from '../../../shared/utils/avatar';

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
  getAvatarSrc(
    user?.avatarUrl || user?.photoUrl || user?.imageUrl || user?.profilePhoto,
    user?.email || user?.name || user?.username
  );

export const getMessageAvatar = (message) =>
  getAvatarSrc(
    message?.avatarUrl ||
      message?.userAvatar ||
      message?.profilePhoto ||
      message?.user?.avatarUrl ||
      message?.user?.photoUrl,
    message?.username || message?.user?.name || message?.user?.username
  );
