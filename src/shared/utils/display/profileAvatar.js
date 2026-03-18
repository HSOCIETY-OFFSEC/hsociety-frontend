import { getGithubAvatarDataUri } from './avatar';

export const getProfileFallbackSeed = (profile = {}) => {
  if (!profile) return 'user';
  return (
    profile.hackerHandle ||
    profile.handle ||
    profile.username ||
    profile.email ||
    profile.name ||
    profile.id ||
    profile.userId ||
    'user'
  );
};

export const getProfileAvatarUrl = (profile = {}) =>
  profile?.avatarUrl ||
  profile?.photoUrl ||
  profile?.imageUrl ||
  profile?.profilePhoto ||
  profile?.avatar ||
  profile?.userAvatar ||
  '';

export const resolveProfileAvatar = (profile = {}) => {
  const avatarUrl = getProfileAvatarUrl(profile);
  const fallbackSeed = getProfileFallbackSeed(profile);
  const fallback = getGithubAvatarDataUri(fallbackSeed);
  const src = avatarUrl || fallback;
  const isFallback = !avatarUrl || avatarUrl === fallback;

  return {
    src,
    fallback,
    isFallback,
    fallbackSeed,
    avatarUrl,
  };
};

