/**
 * Community contract
 * Location: src/features/community/community.contract.js
 */

export const buildCreatePostDTO = ({ content, role }) => ({
  content: content.trim(),
  visibility: 'public',
  roleContext: role || 'student',
  attachments: [],
  metadata: {
    source: 'web',
    version: '1'
  }
});

export const normalizeCommunityOverview = (data = {}) => ({
  stats: data.stats || {
    learners: 12000,
    questions: 4000,
    answered: 1300
  },
  channels: data.channels || [
    { id: 'intro', name: 'Introductions' },
    { id: 'beginner', name: 'Beginner Q&A' },
    { id: 'ctf', name: 'CTF Talk' },
    { id: 'blue-team', name: 'Blue Team' },
    { id: 'red-team', name: 'Red Team' }
  ],
  tags: data.tags || ['#OffSecAfrica', '#EthicalHackingAfrica'],
  posts: data.posts || []
});

export const normalizePosts = (posts = []) =>
  posts.map((post, index) => ({
    id: post.id || `post-${index + 1}`,
    author: post.author || 'Community Member',
    role: post.role || 'Security Learner',
    time: post.time || 'just now',
    title: post.title || 'Untitled post',
    body: post.body || post.content || '',
    likes: Number(post.likes || 0),
    replies: Number(post.replies || 0),
    tags: post.tags || [],
    avatar: post.avatar || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    isSaved: Boolean(post.isSaved)
  }));

export default {
  buildCreatePostDTO,
  normalizeCommunityOverview,
  normalizePosts
};
