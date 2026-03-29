import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUsers, FiMessageSquare, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import {
  createCommunitySocket,
  getCommunityMessages,
  getCommunityOverview,
  reportCommunityMessage,
} from '../services/community.service';
import CommunityHeader from '../components/header/CommunityHeader';
import CommunityMessageList from '../components/messages/CommunityMessageList';
import CommunityCompose from '../components/compose/CommunityCompose';
import { resolveProfileAvatar } from '../../../shared/utils/display/profileAvatar';
import { getProfile } from '../../account/services/account.service';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import { COMMUNITY_HUB_DATA } from '../../../data/static/community/communityHubData';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';

const CommunityHub = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ channels: [], stats: {}, posts: [], reactionConfig: {} });
  const [room, setRoom] = useState(COMMUNITY_HUB_DATA.defaults.room);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
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
    const socket = socketRef.current;
    if (!content || !socket) return;

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
        likes: 0,
        likedBy: [],
        reactions: {},
        pinned: false,
        comments: [],
        createdAt: new Date().toISOString(),
      },
    ]);

    socket.emit('sendMessage', { room, content, tempId });
    socket.emit('typing', { room, isTyping: false });

    setDraft('');
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

  const handleReport = async (messageId) => {
    if (!messageId) return;
    const reason = window.prompt('Why are you reporting this message?') || '';
    const response = await reportCommunityMessage(messageId, reason);
    if (!response.success) {
      setError(response.error || 'Unable to submit report.');
      return;
    }
    setError('');
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
    <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-4 pb-10 pt-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* ── MAIN FEED (X/Twitter style) ── */}
      <main className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-bg-primary" aria-label={`#${displayRoom(room)} channel`}>
        {/* Sticky header with channel tabs */}
        <CommunityHeader
          activeChannels={activeChannels}
          room={room}
          onRoomChange={handleRoomChange}
          overviewStats={overview.stats}
          connected={connected}
          onBack={() => navigate(-1)}
          onMedia={() => navigate('/community/media')}
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
          onReport={handleReport}
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
        />
      </main>

      <aside className="hidden flex-col gap-4 lg:flex" aria-label="Community overview">
        <div className="rounded-lg border border-border bg-bg-secondary p-4" id="community-stats">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary">
            <FiUsers size={14} aria-hidden="true" />
            <span>{COMMUNITY_HUB_DATA.aside.communityTitle}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-border bg-bg-primary px-3 py-2 text-center">
              <strong className="block text-lg font-semibold text-text-primary">
                {Number(overview.stats?.learners || 0).toLocaleString()}
              </strong>
              <span className="text-xs text-text-tertiary">{COMMUNITY_HUB_DATA.aside.onlineNowLabel}</span>
            </div>
            <div className="rounded-md border border-border bg-bg-primary px-3 py-2 text-center">
              <strong className="block text-lg font-semibold text-text-primary">
                {Number(overview.stats?.questions || 0).toLocaleString()}
              </strong>
              <span className="text-xs text-text-tertiary">{COMMUNITY_HUB_DATA.aside.totalPostsLabel}</span>
            </div>
          </div>
        </div>

        {user && (
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg border border-border bg-bg-secondary p-3 text-left transition hover:border-brand/30"
            onClick={() => navigate('/settings')}
            aria-label={COMMUNITY_HUB_DATA.userCard.openAccountAria}
          >
            <img
              src={currentUserAvatar}
              alt={user?.username || COMMUNITY_HUB_DATA.userCard.defaultName}
              className="h-11 w-11 rounded-full object-cover"
              onError={(e) => {
                if (e.currentTarget.src !== currentUserAvatarFallback) {
                  e.currentTarget.src = currentUserAvatarFallback;
                }
              }}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-text-primary">
                {user?.name || user?.username || COMMUNITY_HUB_DATA.userCard.defaultName}
              </span>
              <span className="flex items-center gap-2 text-xs text-text-tertiary">
                <span className="rounded-full border border-border bg-bg-primary px-2 py-0.5 uppercase tracking-widest">
                  {role}
                </span>
                <span className="inline-flex items-center gap-1">
                  <img src={cpIcon} alt="CP" className="h-4 w-4" />
                  {cpTotal}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-text-tertiary">
              <FiSettings size={13} aria-hidden="true" />
            </div>
          </button>
        )}

        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary">
            <FiMessageSquare size={14} aria-hidden="true" />
            <span>Channels</span>
          </div>
          <div className="mt-3 flex flex-col gap-1">
            {activeChannels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  channel.id === room
                    ? 'bg-bg-primary text-text-primary'
                    : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                }`}
                onClick={() => handleRoomChange(channel.id)}
              >
                <span className="text-text-tertiary">#</span>
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CommunityHub;
