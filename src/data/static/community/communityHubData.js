export const COMMUNITY_HUB_DATA = {
  defaults: {
    room: 'general',
    roomFallbackChannels: [
      { id: 'general', name: 'General' },
      { id: 'ctf', name: 'CTF Talk' },
      { id: 'tools', name: 'Tools & Scripts' },
      { id: 'offtopic', name: 'Off-Topic' },
    ],
    reactions: ['🔥', '💯', '👏', '😂', '😮', '❤️'],
    reactionLimit: 3,
  },
  loadErrors: {
    community: 'Failed to load community',
    messages: 'Failed to load messages',
    room: 'Failed to load room',
  },
  aside: {
    communityTitle: 'Community',
    onlineNowLabel: 'Online now',
    totalPostsLabel: 'Total posts',
    channelsTitle: 'Channels',
    socialTitle: 'Follow HSOCIETY',
  },
  userCard: {
    openAccountAria: 'Open account settings',
    defaultName: 'User',
  },
  mobileNav: {
    closeAria: 'Close community navigation',
  },
};

export default COMMUNITY_HUB_DATA;
