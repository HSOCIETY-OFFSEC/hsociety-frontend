import React from 'react';
import '../../../styles/components/ui/profile-badges.css';

const ProfileBadgeItem = ({ badge }) => {
  const titleText = badge.description ? `${badge.name} — ${badge.description}` : badge.name;
  return (
    <div className="profile-badge" title={titleText} aria-label={titleText}>
      <span className="profile-badge-icon" aria-hidden="true">
        <img src={badge.icon} alt={badge.name} />
      </span>
      <span className="profile-badge-name">{badge.name}</span>
    </div>
  );
};

const ProfileBadgeSection = ({ badges = [], emptyText = 'No badges earned yet.' }) => {
  if (!badges.length) {
    return (
      <div className="profile-badges-empty">
        <span>{emptyText}</span>
      </div>
    );
  }

  return (
    <div className="profile-badges" role="list">
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
