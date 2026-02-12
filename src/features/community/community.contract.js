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

export const normalizeCommunityOverview = (data = {}, role = 'student') => ({
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
  tags: data.tags || ['#career-switch', '#ctf', '#web-security', '#blue-team', '#owasp', '#interview-prep'],
  posts: data.posts || [],
  mentor: data.mentor || {
    id: 'ria',
    name: 'Ria N.',
    role: 'Blue Team Lead',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  challenge: data.challenge || {
    id: 'weekly',
    title: role === 'corporate' ? 'Top Learner Highlights' : 'Challenge of the Week',
    description: role === 'corporate'
      ? 'See the most active learners and award mentorship credits.'
      : 'Break down a real-world phishing sample and map it to MITRE.'
  }
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
