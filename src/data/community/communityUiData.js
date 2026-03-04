export const COMMUNITY_UI = {
  header: {
    brand: 'HSOCIETY',
    title: 'Community',
    learnersSuffix: 'online',
    postsSuffix: 'posts',
    channelsLabel: 'Channels',
  },
  sidebar: {
    brandName: 'HSOCIETY',
    navigationTitle: 'Navigation',
    bootcampTitle: 'Bootcamp',
    settingsLabel: 'Settings',
  },
  messages: {
    loadingText: 'Loading messages…',
    emptyText: 'No messages yet. Say hello!',
    pinnedTitle: 'Pinned',
    loadOlderText: 'Load older messages',
    noCommentsText: 'No comments yet.',
    addCommentPlaceholder: 'Add a comment',
    sendCommentAria: 'Send comment',
    initialVisibleCount: 40,
    loadMoreStep: 40,
  },
  compose: {
    maxChars: 1000,
    maxImageBytes: 2 * 1024 * 1024,
    emojis: ['🔥', '🚀', '✅', '⚡', '🧠', '🎯', '🛡️', '🧪', '💡', '🛰️', '📡', '🌍', '💬', '👏', '😂', '🙌', '😮', '😎', '🤝', '❤️'],
    invalidImageText: 'Please select an image file.',
    imageTooLargeText: 'Image is too large. Use a file under 2 MB.',
    uploadFailedText: 'Failed to upload image. Please try again.',
    uploadingText: 'Uploading image…',
  },
  reactions: {
    inlineVisibleCount: 5,
    moreLabel: 'More reactions',
    panelLabel: 'More emoji reactions',
  },
};

export default COMMUNITY_UI;
