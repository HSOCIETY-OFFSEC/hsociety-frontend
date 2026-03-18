import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUsers, FiMessageSquare, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../core/auth/AuthContext';
import {
  createCommunitySocket,
  getCommunityMessages,
  getCommunityOverview,
} from './community.service';
import CommunityHeader from './components/header/CommunityHeader';
import CommunityMessageList from './components/messages/CommunityMessageList';
import CommunityCompose from './components/compose/CommunityCompose';
import { resolveProfileAvatar } from '../../shared/utils/display/profileAvatar';
import { getProfile } from '../account/account.service';
import cpIcon from '../../assets/icons/CP/cp-icon.webp';
import { COMMUNITY_HUB_DATA } from '../../data/community/communityHubData';
import { getPublicErrorMessage } from '../../shared/utils/errors/publicError';
import '@styles/sections/community/index.css';
import '@styles/sections/community/header.css';
import '@styles/sections/community/messages.css';
import '@styles/sections/community/compose.css';

const CommunityHub = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ channels: [], stats: {}, posts: [], reactionConfig: {} });
  const [room, setRoom] = useState(COMMUNITY_HUB_DATA.defaults.room);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [cpTotal, setCpTotal] = useState(0);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const pendingMessageScrollRef = useRef(null);
  const initialRoomLoadRef = useRef(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimersRef = useRef(new Map());
  const location = useLocation();
  const navigate = useNavigate();

  const role = useMemo(() => {
    if (user?.role === 'client' || user?.role === 'admin') return 'corporate';
    return user?.role || 'student';
  }, [user?.role]);

  const normalizeRoomId = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return COMMUNITY_HUB_DATA.defaults.room;
    return raw.startsWith('#') ? raw.slice(1) : raw;
  };

  const displayRoom = (value) => {
    const safe = normalizeRoomId(value);
    return safe || COMMUNITY_HUB_DATA.defaults.room;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search || '');
    const messageId = params.get('messageId');
    const roomParam = params.get('room');
    if (roomParam) {
      const normalized = normalizeRoomId(roomParam);
      if (normalized && normalized !== room) {
        setRoom(normalized);
      }
    }
    if (messageId) {
      pendingMessageScrollRef.current = String(messageId);
    }
  }, [location.search]);

  /* ── Initial load + socket ── */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const [overviewRes, msgRes] = await Promise.all([
        getCommunityOverview(role, 'popular'),
        getCommunityMessages(room, 50),
      ]);
      if (!mounted) return;

      if (overviewRes.success) setOverview(overviewRes.data);
      else setError(getPublicErrorMessage({ action: 'load', response: overviewRes }));

      if (msgRes.success) setMessages(msgRes.data.messages || []);
      else setError(getPublicErrorMessage({ action: 'load', response: msgRes }));

      setLoading(false);
      initialRoomLoadRef.current = false;
    };

    load();

    const socket = createCommunitySocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('joinRoom', room);
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('receiveMessage', (message) => {
      if (message.room !== room) return;
      setMessages((prev) => {
        if (message.tempId) {
          const index = prev.findIndex((item) => item.id === message.tempId);
          if (index >= 0) {
            const next = [...prev];
            next[index] = message;
            return next;
          }
        }
        return [...prev, message];
      });
    });
    socket.on('messageLiked', (payload) => {
      if (payload.room !== room) return;
      setMessages((prev) =>
        prev.map((item) =>
          item.id === payload.messageId
            ? { ...item, likes: payload.likes, likedBy: payload.likedBy }
            : item
        )
      );
    });
    socket.on('commentAdded', (payload) => {
      if (payload.room !== room) return;
      setMessages((prev) =>
        prev.map((item) =>
          item.id === payload.messageId
            ? {
                ...item,
                comments: (() => {
                  const existing = item.comments || [];
                  const incoming = payload.comment;
                  if (existing.some((c) => c.id && c.id === incoming.id)) return existing;
                  if (incoming.userId && incoming.content) {
                    const tempIndex = existing.findIndex(
                      (c) =>
                        String(c.id || '').startsWith('temp-') &&
                        c.userId === incoming.userId &&
                        c.content === incoming.content
                    );
                    if (tempIndex >= 0) {
                      const next = [...existing];
                      next[tempIndex] = incoming;
                      return next;
                    }
                  }
                  return [...existing, incoming];
                })(),
              }
            : item
        )
      );
    });
    socket.on('messageReacted', (payload) => {
      if (payload.room !== room) return;
      setMessages((prev) =>
        prev.map((item) =>
          item.id === payload.messageId
            ? { ...item, reactions: payload.reactions || {} }
            : item
        )
      );
    });
    socket.on('typing', (payload) => {
      if (payload.room !== room) return;
      if (!payload.userId || payload.userId === user?.id) return;
      setTypingUsers((prev) => {
        const exists = prev.some((item) => item.userId === payload.userId);
        if (payload.isTyping) {
          if (exists) {
            return prev.map((item) =>
              item.userId === payload.userId ? { ...item, username: payload.username } : item
            );
          }
          return [...prev, { userId: payload.userId, username: payload.username }];
        }
        return prev.filter((item) => item.userId !== payload.userId);
      });

      if (payload.isTyping) {
        const timers = typingTimersRef.current;
        if (timers.has(payload.userId)) {
          window.clearTimeout(timers.get(payload.userId));
        }
        const timeout = window.setTimeout(() => {
          setTypingUsers((prev) => prev.filter((item) => item.userId !== payload.userId));
          timers.delete(payload.userId);
        }, 2400);
        timers.set(payload.userId, timeout);
      }
    });

    return () => {
      mounted = false;
      socket.emit('leaveRoom', room);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  /* ── Room switch ── */
  useEffect(() => {
    if (initialRoomLoadRef.current) return;
    const loadRoom = async () => {
      setLoading(true);
      setMessages([]);
      setTypingUsers([]);
      const msgRes = await getCommunityMessages(room, 50);
      if (!msgRes.success) {
        setError(getPublicErrorMessage({ action: 'load', response: msgRes }));
        setLoading(false);
        return;
      }
      setMessages(msgRes.data.messages || []);
      setLoading(false);
    };

    loadRoom();

    const socket = socketRef.current;
    if (!socket) return;
    socket.emit('joinRoom', room);
    return () => socket.emit('leaveRoom', room);
  }, [room]);

  /* ── Auto-scroll on new messages ── */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;

    const updateStickiness = () => {
      const distance = container.scrollHeight - container.scrollTop - container.clientHeight;
      stickToBottomRef.current = distance < 120;
    };

    updateStickiness();
    container.addEventListener('scroll', updateStickiness, { passive: true });
    return () => container.removeEventListener('scroll', updateStickiness);
  }, []);

  /* ── Auto-scroll on new messages ── */
  useEffect(() => {
    if (!scrollRef.current) return;
    if (stickToBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!pendingMessageScrollRef.current) return;
    const messageId = pendingMessageScrollRef.current;
    const element = document.getElementById(`community-message-${messageId}`);
    if (!element) return;
    stickToBottomRef.current = false;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    pendingMessageScrollRef.current = null;
  }, [messages, room]);

  /* ── Hash navigation to stats ── */
  useEffect(() => {
    if (location.hash !== '#stats') return;
    const target = document.getElementById('community-stats');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [location.hash]);

  useEffect(() => {
    let mounted = true;
    const loadProfilePoints = async () => {
      if (!user?.id) return;
      const response = await getProfile();
      if (!mounted || !response.success) return;
      setCpTotal(Number(response.data?.xpSummary?.totalXp || 0));
    };
    loadProfilePoints();
    return () => { mounted = false; };
  }, [user?.id]);

  /* ── Send ── */
  const sendMessage = () => {
    const content = draft.trim();
    const imagePayload = imageUrl;
    const socket = socketRef.current;
    if ((!content && !imagePayload) || !socket) return;

    const tempId = `temp-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        tempId,
        userId: user?.id || '',
        username: currentUsername,
        hackerHandle: user?.hackerHandle || '',
        userRole: role,
        userAvatar: currentUserAvatar,
        room,
        content,
        imageUrl: imagePayload,
        likes: 0,
        likedBy: [],
        reactions: {},
        pinned: false,
        comments: [],
        createdAt: new Date().toISOString(),
      },
    ]);

    socket.emit('sendMessage', { room, content, imageUrl: imagePayload, tempId });
    socket.emit('typing', { room, isTyping: false });

    setDraft('');
    setImageUrl('');
    setImageError('');
  };

  const isOwn = (msg) => msg.userId === user?.id || msg.username === user?.username;
  const currentUserId = user?.id;
  const currentUsername = user?.name || user?.username || 'You';
  const { src: currentUserAvatar, fallback: currentUserAvatarFallback } = resolveProfileAvatar(user);

  const handleLike = (messageId) => {
    if (!messageId) return;
    if (currentUserId) {
      setMessages((prev) =>
        prev.map((item) => {
          if (item.id !== messageId) return item;
          const likedBy = Array.isArray(item.likedBy) ? [...item.likedBy] : [];
          const alreadyLiked = likedBy.includes(currentUserId);
          const nextLikedBy = alreadyLiked
            ? likedBy.filter((id) => id !== currentUserId)
            : [...likedBy, currentUserId];
          const nextLikes = Math.max(0, Number(item.likes || 0) + (alreadyLiked ? -1 : 1));
          return { ...item, likes: nextLikes, likedBy: nextLikedBy };
        })
      );
    }
    socketRef.current?.emit('likeMessage', { messageId });
  };

  const handleAddComment = (messageId, content) => {
    if (!messageId || !content) return;
    if (currentUserId) {
      const tempComment = {
        id: `temp-${Date.now()}`,
        userId: currentUserId,
        username: currentUsername,
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) =>
        prev.map((item) =>
          item.id === messageId
            ? { ...item, comments: [...(item.comments || []), tempComment] }
            : item
        )
      );
    }
    socketRef.current?.emit('addComment', { messageId, content });
  };

  const reactionLimit = Number(
    overview.reactionConfig?.maxPerUser || COMMUNITY_HUB_DATA.defaults.reactionLimit
  );
  const fallbackReactions = COMMUNITY_HUB_DATA.defaults.reactions;

  const handleReact = (messageId, emoji) => {
    if (!messageId || !emoji || !currentUserId) return;
    setMessages((prev) =>
      prev.map((item) => {
        if (item.id !== messageId) return item;
        const reactions = item.reactions || {};
        const current = reactions[emoji] || { count: 0, users: [] };
        const users = Array.isArray(current.users) ? [...current.users] : [];
        const alreadyReacted = users.includes(currentUserId);
        const currentUserReactions = Object.values(reactions).filter((entry) =>
          Array.isArray(entry.users) && entry.users.includes(currentUserId)
        ).length;
        if (!alreadyReacted && currentUserReactions >= reactionLimit) return item;
        const nextUsers = alreadyReacted
          ? users.filter((id) => id !== currentUserId)
          : [...users, currentUserId];
        const nextCount = Math.max(0, Number(current.count || 0) + (alreadyReacted ? -1 : 1));
        return {
          ...item,
          reactions: {
            ...reactions,
            [emoji]: { count: nextCount, users: nextUsers },
          },
        };
      })
    );
    socketRef.current?.emit('reactMessage', { messageId, emoji });
  };

  const handleRoomChange = (newRoom) => {
    setRoom(normalizeRoomId(newRoom));
  };

  const activeChannels = useMemo(() => {
    const source = overview.channels?.length
      ? overview.channels
      : [...COMMUNITY_HUB_DATA.defaults.roomFallbackChannels];

    return source
      .map((channel) => ({
        ...channel,
        id: normalizeRoomId(channel.id || channel.name),
        name: channel.name || displayRoom(channel.id || channel.name),
      }))
      .filter((channel) => channel.id);
  }, [overview.channels]);

  useEffect(() => {
    if (!activeChannels.length) return;
    const exists = activeChannels.some((channel) => channel.id === room);
    if (!exists) setRoom(activeChannels[0].id);
  }, [activeChannels, room]);

  const currentReactionEmojis = (() => {
    const channel = activeChannels.find((ch) => ch.id === room);
    if (channel?.emojis?.length) return channel.emojis;
    if (overview.reactionConfig?.emojis?.length) return overview.reactionConfig.emojis;
    return fallbackReactions;
  })();

  return (
    <div className="community-root">
      {/* ── MAIN FEED (X/Twitter style) ── */}
      <main className="community-main" aria-label={`#${displayRoom(room)} channel`}>
        {/* Sticky header with channel tabs */}
        <CommunityHeader
          activeChannels={activeChannels}
          room={room}
          onRoomChange={handleRoomChange}
          overviewStats={overview.stats}
          connected={connected}
          onBack={() => navigate(-1)}
        />

        {/* Message feed */}
        <CommunityMessageList
          messages={messages}
          loading={loading}
          error={error}
          isOwn={isOwn}
          containerRef={scrollRef}
          onLike={handleLike}
          onAddComment={handleAddComment}
          onReact={handleReact}
          reactionEmojis={currentReactionEmojis}
          reactionLimit={reactionLimit}
          currentUserId={currentUserId}
          typingUsers={typingUsers}
        />

        {/* Compose bar */}
        <CommunityCompose
          user={user}
          room={room}
          draft={draft}
          onDraftChange={setDraft}
          onSend={sendMessage}
          onTyping={(isTyping) => {
            socketRef.current?.emit('typing', { room, isTyping });
          }}
          imageUrl={imageUrl}
          onImageChange={setImageUrl}
          imageError={imageError}
          onImageError={setImageError}
        />
      </main>

      <aside className="community-aside" aria-label="Community overview">
        <div className="community-aside-widget" id="community-stats">
          <div className="community-aside-widget-header">
            <FiUsers size={14} aria-hidden="true" />
            <span>{COMMUNITY_HUB_DATA.aside.communityTitle}</span>
          </div>
          <div className="community-aside-stats-grid">
            <div className="community-aside-stat-cell">
              <strong>{Number(overview.stats?.learners || 0).toLocaleString()}</strong>
              <span>{COMMUNITY_HUB_DATA.aside.onlineNowLabel}</span>
            </div>
            <div className="community-aside-stat-cell">
              <strong>{Number(overview.stats?.questions || 0).toLocaleString()}</strong>
              <span>{COMMUNITY_HUB_DATA.aside.totalPostsLabel}</span>
            </div>
          </div>
        </div>

        {user && (
          <button
            type="button"
            className="community-aside-user-card"
            onClick={() => navigate('/settings')}
            aria-label={COMMUNITY_HUB_DATA.userCard.openAccountAria}
          >
            <img
              src={currentUserAvatar}
              alt={user?.username || COMMUNITY_HUB_DATA.userCard.defaultName}
              className="community-aside-user-avatar"
              onError={(e) => {
                if (e.currentTarget.src !== currentUserAvatarFallback) {
                  e.currentTarget.src = currentUserAvatarFallback;
                }
              }}
            />
            <div className="community-aside-user-info">
              <span className="community-aside-user-name">
                {user?.name || user?.username || COMMUNITY_HUB_DATA.userCard.defaultName}
              </span>
              <span className="community-aside-user-meta">
                <span className="community-aside-user-role">{role}</span>
                <span className="community-aside-user-cp">
                  <img src={cpIcon} alt="CP" className="community-aside-cp-icon" />
                  {cpTotal}
                </span>
              </span>
            </div>
            <div className="community-aside-user-right">
              <span className="community-aside-user-cp">
                <img src={cpIcon} alt="CP" className="community-aside-cp-icon" />
                {cpTotal}
              </span>
              <FiSettings size={13} className="community-aside-settings-icon" aria-hidden="true" />
            </div>
          </button>
        )}

        <div className="community-aside-widget">
          <div className="community-aside-widget-header">
            <FiMessageSquare size={14} aria-hidden="true" />
            <span>Channels</span>
          </div>
          <div className="community-aside-channel-list">
            {activeChannels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                className={`community-aside-channel-item ${channel.id === room ? 'active' : ''}`}
                onClick={() => handleRoomChange(channel.id)}
              >
                <span className="community-aside-channel-hash">#</span>
                <span className="community-aside-channel-item-name">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CommunityHub;
