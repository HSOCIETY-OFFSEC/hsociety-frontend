import React from 'react';

const ProfileBadgeItem = ({ badge }) => {
  const titleText = badge.description ? `${badge.name} — ${badge.description}` : badge.name;
  return (
    <div
      className="grid justify-items-start gap-2 text-left text-xs leading-tight text-text-secondary"
      title={titleText}
      aria-label={titleText}
    >
      <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-full max-md:h-20 max-md:w-20" aria-hidden="true">
        <img src={badge.icon} alt={badge.name} />
      </span>
      <span className="text-[0.7rem] text-text-secondary max-md:text-[0.65rem]">{badge.name}</span>
    </div>
  );
};

const ProfileBadgeSection = ({ badges = [], emptyText = 'No badges earned yet.' }) => {
  if (!badges.length) {
    return (
      <div className="rounded-xl border border-dashed border-[color-mix(in_srgb,var(--text-tertiary)_40%,transparent)] bg-[color-mix(in_srgb,var(--bg-tertiary)_65%,transparent)] px-4 py-3 text-sm text-text-secondary">
        <span>{emptyText}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(86px,1fr))] items-start gap-3.5 max-md:grid-cols-[repeat(auto-fit,minmax(70px,1fr))] max-md:gap-3" role="list">
      {badges.map((badge) => (
        <div key={badge.id || badge.name} role="listitem">
          <ProfileBadgeItem badge={badge} />
        </div>
      ))}
    </div>
  );
};

export { ProfileBadgeItem };
export default ProfileBadgeSection;
