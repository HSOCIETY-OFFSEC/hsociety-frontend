import badgeRank1 from '../../assets/badges/Script-Kiddie-badge-rank1.png';
import badgeRank2 from '../../assets/badges/Exploit-Apprentice-Rank2.png';
import badgeRank3 from '../../assets/badges/Payload-Architect-rank3.png';
import badgeRank4 from '../../assets/badges/Red-Team_operative-Rank4.png';
import badgeRank5 from '../../assets/badges/ZeroDay-hunter-Rank5.png';

export const PROFILE_BADGES = [
  {
    id: 'rank-1',
    name: 'Script Kiddie',
    icon: badgeRank1,
    description: 'Reached Level 1.',
  },
  {
    id: 'rank-2',
    name: 'Exploit Apprentice',
    icon: badgeRank2,
    description: 'Reached Level 2.',
  },
  {
    id: 'rank-3',
    name: 'Payload Architect',
    icon: badgeRank3,
    description: 'Reached Level 3.',
  },
  {
    id: 'rank-4',
    name: 'Red Team Operative',
    icon: badgeRank4,
    description: 'Reached Level 4.',
  },
  {
    id: 'rank-5',
    name: 'Zero Day Hunter',
    icon: badgeRank5,
    description: 'Reached Level 5.',
  },
];

export const PROFILE_BADGE_MAP = PROFILE_BADGES.reduce((acc, badge) => {
  acc[badge.id] = badge;
  return acc;
}, {});
