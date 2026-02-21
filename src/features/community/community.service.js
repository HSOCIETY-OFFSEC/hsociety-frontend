/**
 * Community service
 * Location: src/features/community/community.service.js
 */

import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../../shared/services/api.client';
import { buildEndpoint } from '../../config/api.config';
import { buildCreatePostDTO, normalizeCommunityOverview, normalizePosts } from './community.contract';
import { io } from 'socket.io-client';
import { envConfig } from '../../config/env.config';
import { sessionManager } from '../../core/auth/session.manager';

const mockPostsByFeed = {
  popular: [
    {
      id: '1',
      author: 'Lena O.',
      role: 'Junior Analyst',
      time: '2h ago',
      title: 'Best first CTF for absolute beginners?',
      body: 'I know basics of networking and Linux. Any friendly CTF to build confidence?',
      likes: 42,
      replies: 8,
      tags: ['#OffSecAfrica', '#EthicalHackingAfrica'],
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: '2',
      author: 'Dev K.',
      role: 'Security Student',
      time: '5h ago',
      title: 'How do you explain CVSS to non-technical stakeholders?',
      body: 'Any frameworks or analogies that help in presentations?',
      likes: 28,
      replies: 6,
      tags: ['#OffSecAfrica', '#EthicalHackingAfrica'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    }
  ],
  new: [
    {
      id: '3',
      author: 'Ari P.',
      role: 'SOC Intern',
      time: '1h ago',
      title: 'Resources for learning web pentesting in 60 days?',
      body: 'Looking for a structured path with modules and real-world practice.',
      likes: 3,
      replies: 1,
      tags: ['#OffSecAfrica', '#EthicalHackingAfrica'],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    }
  ],
  saved: []
};

const getMockOverview = (role, feed) => {
  const posts = mockPostsByFeed[feed] || mockPostsByFeed.popular;
  return normalizeCommunityOverview({ posts }, role);
};

const resolveSocketBaseURL = () => {
  const baseURL = envConfig.api.baseURL;
  if (!baseURL || baseURL.startsWith('/')) {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }

  try {
    const parsed = new URL(baseURL);
    return `${parsed.protocol}//${parsed.host}`;
  } catch (_err) {
    return baseURL;
  }
};

let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(resolveSocketBaseURL(), {
      autoConnect: false,
      auth: {
        token: sessionManager.getToken()
      }
    });
  }
  return socketInstance;
};

const connectSocket = () => {
  const socket = getSocket();
  socket.auth = { token: sessionManager.getToken() };
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const getCommunityOverview = async ({ role = 'student', feed = 'popular' } = {}) => {
  const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITY.OVERVIEW}?role=${role}&feed=${feed}`);
  if (response.success) {
    return {
      success: true,
      data: normalizeCommunityOverview(response.data, role)
    };
  }

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: getMockOverview(role, feed),
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to load community overview'
  };
};

export const getCommunityMessages = async ({ room = 'general', limit = 50 } = {}) => {
  const query = `?room=${encodeURIComponent(room)}&limit=${encodeURIComponent(limit)}`;
  const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITY.MESSAGES}${query}`);
  if (response.success) {
    return {
      success: true,
      data: response.data
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to load community messages'
  };
};

export const joinRoom = (room = 'general') => {
  const socket = connectSocket();
  socket.emit('joinRoom', room);
};

export const leaveRoom = (room = 'general') => {
  const socket = connectSocket();
  socket.emit('leaveRoom', room);
};

export const sendMessage = ({ room = 'general', content }) => {
  const socket = connectSocket();
  socket.emit('sendMessage', { room, content });
};

export const sendTyping = ({ room = 'general', isTyping }) => {
  const socket = connectSocket();
  socket.emit('typing', { room, isTyping: Boolean(isTyping) });
};

export const onReceiveMessage = (callback) => {
  const socket = connectSocket();
  socket.on('receiveMessage', callback);
  return () => socket.off('receiveMessage', callback);
};

export const onTyping = (callback) => {
  const socket = connectSocket();
  socket.on('typing', callback);
  return () => socket.off('typing', callback);
};

export const disconnectCommunitySocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
  }
};

export const createCommunityPost = async ({ content, role }) => {
  const payload = buildCreatePostDTO({ content, role });
  const response = await apiClient.post(API_ENDPOINTS.COMMUNITY.POSTS, payload);
  if (response.success) {
    return {
      success: true,
      data: response.data
    };
  }

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: {
        id: `mock-${Date.now()}`,
        author: 'You',
        role: role === 'corporate' ? 'Corporate Member' : 'Student Member',
        time: 'just now',
        title: 'New community post',
        body: payload.content,
        likes: 0,
        replies: 0,
        tags: [],
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80'
      },
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to create post'
  };
};

export const reactToPost = async ({ postId, reaction = 'like' }) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.COMMUNITY.POST_REACT, { id: postId });
  const response = await apiClient.post(endpoint, { reaction });
  return {
    success: response.success,
    error: response.error
  };
};

export const savePost = async ({ postId, saved = true }) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.COMMUNITY.POST_SAVE, { id: postId });
  const response = await apiClient.post(endpoint, { saved });
  return {
    success: response.success,
    error: response.error
  };
};

export const normalizeFeedPosts = (posts) => normalizePosts(posts);

export default {
  getCommunityOverview,
  getCommunityMessages,
  joinRoom,
  leaveRoom,
  sendMessage,
  sendTyping,
  onReceiveMessage,
  onTyping,
  disconnectCommunitySocket,
  createCommunityPost,
  reactToPost,
  savePost,
  normalizeFeedPosts
};
