import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiAward, FiLock, FiMail, FiMapPin, FiTrash2, FiTrendingUp, FiUser } from 'react-icons/fi';
import { IoFlameOutline } from 'react-icons/io5';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import Button from '../../../shared/components/ui/Button';
import PasswordInput from '../../../shared/components/ui/PasswordInput';
import PasswordStrengthIndicator from '../../../shared/components/ui/PasswordStrengthIndicator';
import { useAuth } from '../../../core/auth/AuthContext';
import { resolveProfileAvatar } from '../../../shared/utils/display/profileAvatar';
import { openNotificationTarget } from '../../../shared/utils/notificationNavigation';
import { validatePassword } from '../../../core/validation/input.validator';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import AccountNotificationsList from '../components/AccountNotificationsList';
import { ACCOUNT_UI } from '../../../data/static/account/accountUiData';
import ProfileBadgeSection from '../../../shared/components/ui/ProfileBadgeSection';
import { buildProfileBadges, normalizeBadges } from '../../../shared/utils/display/profileBadges';
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
import {
  changePassword as changePasswordService,
  deleteAccount,
  getProfile,
  removeAvatar,
  updateAvatar,
  updateProfile,
} from '../services/account.service';
import { listNotifications, markNotificationRead } from '../../student/services/notifications.service';

const normalizeHandle = (handle) => {
  if (!handle) return '';
  return String(handle).trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9._-]/g, '');
};

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarRemoving, setAvatarRemoving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [avatarFileName, setAvatarFileName] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState(() =>
    normalizeBadges(user?.badges || user?.unlockedBadges || [])
  );
  const [xpSummary, setXpSummary] = useState({
    totalXp: 0,
    rank: 'Candidate',
    streakDays: 0,
    visits: 0,
  });
  const [emblems, setEmblems] = useState({
    unlockedModules: [],
    graduationUnlocked: false,
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    organization: user?.organization || '',
    hackerHandle: user?.hackerHandle || '',
    bio: user?.bio || '',
  });
  const isPentester = user?.role === 'pentester';
  const normalizedHandle = normalizeHandle(profile.hackerHandle || user?.hackerHandle);
  const publicProfilePath = normalizedHandle ? `/@${normalizedHandle}` : '';
  const badgeList = useMemo(
    () => buildProfileBadges({ xpSummary, badges: earnedBadges, rankTitle: xpSummary.rank }),
    [earnedBadges, xpSummary]
  );

  const labelClass = 'text-xs uppercase tracking-widest text-text-tertiary';
  const inputClass =
    'w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary transition focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20';
  const textareaClass =
    'w-full min-h-[110px] rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary transition focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20';

  useEffect(() => {
    if (error) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [error]);

  useEffect(() => {
    setProfile({
      name: user?.name || '',
      organization: user?.organization || '',
      hackerHandle: user?.hackerHandle || '',
      bio: user?.bio || '',
    });
  }, [user?.name, user?.organization, user?.hackerHandle, user?.bio]);

  useEffect(() => {
    setEarnedBadges(normalizeBadges(user?.badges || user?.unlockedBadges || []));
  }, [user?.badges, user?.unlockedBadges]);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      setProfileLoading(true);
      const response = await getProfile();
      if (!mounted || !response.success) {
        setProfileLoading(false);
        return;
      }
      const data = response.data || {};
      setProfile({
        name: data.name || '',
        organization: data.organization || '',
        hackerHandle: data.hackerHandle || '',
        bio: data.bio || '',
      });
      setXpSummary({
        totalXp: Number(data?.xpSummary?.totalXp || 0),
        rank: data?.xpSummary?.rank || 'Candidate',
        streakDays: Number(data?.xpSummary?.streakDays || 0),
        visits: Number(data?.xpSummary?.visits || 0),
      });
      setEmblems({
        unlockedModules: Array.isArray(data?.emblems?.unlockedModules)
          ? data.emblems.unlockedModules
          : [],
        graduationUnlocked: Boolean(data?.emblems?.graduationUnlocked),
      });
      setEarnedBadges(
        normalizeBadges(
          data?.badges || data?.achievements?.badges || data?.unlockedBadges || []
        )
      );
      updateUser(data);
      setProfileLoading(false);
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let mounted = true;
    const loadNotifications = async () => {
      const response = await listNotifications();
      if (!mounted || !response.success) return;
      setNotifications(response.data || []);
    };
    loadNotifications();
    return () => {
      mounted = false;
    };
  }, []);

  const identiconFallback = useMemo(
    () => resolveProfileAvatar(user).fallback,
    [user]
  );

  const handleProfileSave = async () => {
    setError('');
    setProfileSaving(true);
    const response = await updateProfile(profile);
    if (response.success) {
      updateUser(response.data);
      setXpSummary({
        totalXp: Number(response.data?.xpSummary?.totalXp || xpSummary.totalXp || 0),
        rank: response.data?.xpSummary?.rank || xpSummary.rank || 'Candidate',
        streakDays: Number(response.data?.xpSummary?.streakDays || xpSummary.streakDays || 0),
        visits: Number(response.data?.xpSummary?.visits || xpSummary.visits || 0),
      });
      setEmblems({
        unlockedModules: Array.isArray(response.data?.emblems?.unlockedModules)
          ? response.data.emblems.unlockedModules
          : emblems.unlockedModules,
        graduationUnlocked:
          typeof response.data?.emblems?.graduationUnlocked === 'boolean'
            ? response.data.emblems.graduationUnlocked
            : emblems.graduationUnlocked,
      });
      setEarnedBadges(
        normalizeBadges(
          response.data?.badges ||
            response.data?.achievements?.badges ||
            response.data?.unlockedBadges ||
            earnedBadges
        )
      );
    } else {
      setError(getPublicErrorMessage({ action: 'save', response }));
    }
    setProfileSaving(false);
  };

  const handleAvatarFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result || '');
      setAvatarFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarSave = async () => {
    if (!avatarPreview) return;
    setError('');
    setAvatarSaving(true);
    const response = await updateAvatar(avatarPreview);
    if (response.success) {
      updateUser(response.data);
    } else {
      setError(getPublicErrorMessage({ action: 'save', response }));
    }
    setAvatarSaving(false);
  };

  const handleAvatarRemove = async () => {
    setError('');
    setAvatarRemoving(true);
    const response = await removeAvatar();
    if (response.success) {
      updateUser(response.data);
      setAvatarPreview('');
      setAvatarFileName('');
    } else {
      setError(getPublicErrorMessage({ action: 'submit', response }));
    }
    setAvatarRemoving(false);
  };

  const handleChangePassword = async () => {
    setError('');
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setPasswordSaving(true);
    const response = await changePasswordService(currentPassword, newPassword);
    if (response.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(getPublicErrorMessage({ action: 'submit', response }));
    }
    setPasswordSaving(false);
  };

  const handleDelete = async () => {
    setError('');
    if (confirmText.trim().toLowerCase() !== 'delete') {
      setError('Type DELETE to confirm.');
      return;
    }
    setLoading(true);
    const response = await deleteAccount();
    if (response.success) {
      await logout();
    } else {
      setError(getPublicErrorMessage({ action: 'submit', response }));
    }
    setLoading(false);
  };

  return (
    <div
      className={`${profileRoot} text-text-primary`}
      style={profileRootStyle}
    >
      <div className={profileLayout}>
        <aside className={profileSidebar}>
          <div className={profileAvatarWrap}>
            <div className={profileAvatar}>
              <img
                src={avatarPreview || identiconFallback}
                alt="Profile avatar"
                onError={(e) => {
                  if (e.currentTarget.src !== identiconFallback) {
                    e.currentTarget.src = identiconFallback;
                  }
                }}
              />
            </div>
          </div>

          <div className={profileIdentity}>
            <h1 className={profileName}>
              {profile.name || user?.name || 'Account Settings'}
            </h1>
            <p className={profileHandle}>{normalizedHandle ? `@${normalizedHandle}` : user?.email || '—'}</p>
            {profile.bio && <p className={profileBio}>{profile.bio}</p>}
          </div>

          <div className={profileCtaRow}>
            <button
              type="button"
              className={`${profileButtonBaseClass} ${profileButtonOutline}`}
              onClick={handleProfileSave}
              disabled={profileSaving}
            >
              {profileSaving ? 'Saving…' : 'Save Profile'}
            </button>
            {publicProfilePath ? (
              <Link className={`${profileButtonBaseClass} ${profileButtonGhostClass}`} to={publicProfilePath}>
                View Profile
              </Link>
            ) : (
              <button
                type="button"
                className={`${profileButtonBaseClass} ${profileButtonGhostClass}`}
                disabled
                title="Add a hacker handle to view your public profile."
              >
                View Profile
              </button>
            )}
          </div>

          <ul className={profileMetaList}>
            <li className={profileMetaItem}><FiUser size={14} /><span>{user?.role || 'Member'}</span></li>
            <li className={profileMetaItem}><FiMail size={14} /><span>{user?.email || '—'}</span></li>
            <li className={profileMetaItem}><FiMapPin size={14} /><span>{profile.organization || 'Independent'}</span></li>
          </ul>

          <div className={profileBadgeSection} aria-label="Profile badges">
            <p className={profileBadgeTitle}>Badges</p>
            <ProfileBadgeSection badges={badgeList} />
          </div>

          <div className={profileStatsCard}>
            <div className={profileStatRow}>
              <div className={profileStatIcon}>
                <img src={cpIcon} alt="CP" className="h-[18px] w-[18px] object-contain drop-shadow-[0_0_4px_color-mix(in_srgb,var(--primary-color)_55%,transparent)]" />
              </div>
              <div className={profileStatInfo}>
                <span className={profileStatLabel}>CP</span>
                <strong className={profileStatValue}>{xpSummary.totalXp || 0}</strong>
              </div>
            </div>
            <div className={profileStatRow}>
              <FiTrendingUp size={15} className={profileStatFi} />
              <div className={profileStatInfo}>
                <span className={profileStatLabel}>Rank</span>
                <strong className={profileStatValue}>{xpSummary.rank || 'Candidate'}</strong>
              </div>
            </div>
            <div className={profileStatRow}>
              <IoFlameOutline size={15} className={profileStatFi} />
              <div className={profileStatInfo}>
                <span className={profileStatLabel}>Streak</span>
                <strong className={profileStatValue}>{xpSummary.streakDays || 0} days</strong>
              </div>
            </div>
            <div className={profileStatRow}>
              <FiAward size={15} className={profileStatFi} />
              <div className={profileStatInfo}>
                <span className={profileStatLabel}>Emblems</span>
                <strong className={profileStatValue}>{emblems.unlockedModules.length}/5</strong>
              </div>
            </div>
          </div>
        </aside>

        <main className={profileMain}>
          {error && (
            <div className="rounded-md border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
              {error}
            </div>
          )}

          <section className={profilePanel}>
            <h2 className={profileSectionTitle}>Profile Overview</h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2">
                <FiTrendingUp size={15} />
                <div>
                  <span className="block text-xs uppercase tracking-widest text-text-tertiary">Rank</span>
                  <strong className="block text-sm text-text-primary">{xpSummary.rank || 'Candidate'}</strong>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2">
                <img
                  src={cpIcon}
                  alt="CP"
                  className="h-7 w-7 object-contain drop-shadow-[0_0_4px_color-mix(in_srgb,var(--primary-color)_40%,transparent)]"
                />
                <div>
                  <span className="block text-xs uppercase tracking-widest text-text-tertiary">CP</span>
                  <strong className="block text-lg text-status-success">
                    {xpSummary.totalXp || 0}
                  </strong>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2">
                <IoFlameOutline size={15} />
                <div>
                  <span className="block text-xs uppercase tracking-widest text-text-tertiary">Streak</span>
                  <strong className="block text-sm text-text-primary">{xpSummary.streakDays || 0} days</strong>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2">
                <FiAward size={15} />
                <div>
                  <span className="block text-xs uppercase tracking-widest text-text-tertiary">Emblems</span>
                  <strong className="block text-sm text-text-primary">{emblems.unlockedModules.length}/5</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]" aria-label="Unlocked module emblems">
              {[1, 2, 3, 4, 5].map((moduleId) => {
                const unlocked = emblems.unlockedModules.includes(moduleId);
                return (
                  <div
                    key={moduleId}
                    className={`rounded-md border px-2.5 py-2 ${
                      unlocked ? 'border-status-success/40' : 'border-border'
                    }`}
                  >
                    <span className="block truncate text-xs text-text-secondary">
                      Phase {String(moduleId).padStart(2, '0')}
                    </span>
                    <strong className="block truncate text-sm text-text-primary">
                      {unlocked ? 'Unlocked' : 'Locked'}
                    </strong>
                  </div>
                );
              })}
              <div
                className={`rounded-md border px-2.5 py-2 ${
                  emblems.graduationUnlocked ? 'border-status-success/40' : 'border-border'
                }`}
              >
                <span className="block truncate text-xs text-text-secondary">HP Badge</span>
                <strong className="block truncate text-sm text-text-primary">
                  {emblems.graduationUnlocked ? 'Unlocked' : 'Locked'}
                </strong>
              </div>
            </div>

            {profileLoading && (
              <p className="mt-3 text-sm text-text-secondary">{ACCOUNT_UI.profile.refreshingText}</p>
            )}
          </section>

          <section className={profilePanel}>
            <h2 className={profileSectionTitle}>Profile Details</h2>

            <div className="mb-5 grid grid-cols-1 gap-5">
              <div>
                <span className={labelClass}>Notifications</span>
                <AccountNotificationsList
                  notifications={notifications}
                  onOpen={async (item) => {
                    await markNotificationRead(item.id);
                    setNotifications((prev) =>
                      prev.map((entry) =>
                        entry.id === item.id ? { ...entry, read: true } : entry
                      )
                    );
                    openNotificationTarget(item, navigate);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-start gap-5">
              <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-full border border-border bg-bg-secondary text-lg font-semibold text-text-secondary">
                <img
                  src={avatarPreview || identiconFallback}
                  alt="Profile avatar"
                  onError={(e) => {
                    if (e.currentTarget.src !== identiconFallback) {
                      e.currentTarget.src = identiconFallback;
                    }
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div>
                  <span className={labelClass}>Profile Photo</span>
                  <p className="text-sm text-text-secondary">
                    {avatarFileName || user?.avatarUrl
                      ? 'Custom image selected.'
                      : 'Upload a photo.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm font-semibold text-text-primary">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarFile(e.target.files?.[0])}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    Choose Image
                  </label>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleAvatarSave}
                    disabled={avatarSaving || !avatarPreview}
                  >
                    {avatarSaving ? 'Saving…' : 'Save Photo'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleAvatarRemove}
                    disabled={avatarRemoving || (!avatarPreview && !user?.avatarUrl)}
                  >
                    {avatarRemoving ? 'Removing…' : 'Remove'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <span className={labelClass}>Name</span>
                <input
                  className={inputClass}
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className={labelClass}>Organization</span>
                <input
                  className={inputClass}
                  value={profile.organization}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, organization: e.target.value }))
                  }
                  placeholder="Company or school"
                />
              </div>

              {isPentester && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <span className={labelClass}>Hacker handle</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-secondary">@</span>
                      <input
                        className={inputClass}
                        value={profile.hackerHandle}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, hackerHandle: e.target.value }))
                        }
                        placeholder="ghost"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className={labelClass}>Description</span>
                    <textarea
                      className={textareaClass}
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      placeholder="Summarize your focus, strengths, or what you bring to engagements."
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1.5">
                <span className={labelClass}>Email</span>
                <strong className="text-sm text-text-primary">{user?.email || '—'}</strong>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className={labelClass}>Role</span>
                <strong className="text-sm text-text-primary">{user?.role || '—'}</strong>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="small"
                onClick={handleProfileSave}
                disabled={profileSaving}
              >
                {profileSaving ? 'Saving…' : 'Save Profile'}
              </Button>
            </div>
          </section>

          <section className={profilePanel}>
            <div className="mb-5 flex items-start gap-3">
              <FiLock size={20} className="text-brand" />
              <div>
                <h2 className="text-base font-semibold text-text-primary">Change Password</h2>
                <p className="text-sm text-text-secondary">
                  Use at least 8 characters with uppercase, lowercase, a number, and a special
                  character.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className={labelClass}>Current password</span>
                <PasswordInput
                  className={`${inputClass} max-w-[360px]`}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className={labelClass}>New password</span>
                <PasswordInput
                  className={`${inputClass} max-w-[360px]`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <PasswordStrengthIndicator
                  password={newPassword}
                  className="max-w-[360px]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className={labelClass}>Confirm new password</span>
                <PasswordInput
                  className={`${inputClass} max-w-[360px]`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="small"
                onClick={handleChangePassword}
                disabled={
                  passwordSaving || !currentPassword || !newPassword || !confirmPassword
                }
              >
                {passwordSaving ? 'Updating…' : 'Update Password'}
              </Button>
            </div>
          </section>

          <section className={`${profilePanel} border-status-danger/40 bg-status-danger/5`}>
            <div className="mb-5 flex items-start gap-3">
              <FiAlertTriangle size={18} className="text-status-danger" />
              <div>
                <h2 className="text-base font-semibold text-text-primary">Delete Account</h2>
                <p className="text-sm text-text-secondary">This is permanent. All your data will be removed.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <input
                className={`${inputClass} sm:max-w-[320px]`}
                placeholder='Type "DELETE" to confirm'
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={loading}
              />
              <Button variant="danger" size="small" disabled={loading} onClick={handleDelete}>
                <FiTrash2 size={14} />
                {loading ? 'Deleting…' : 'Delete Account'}
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AccountSettings;
