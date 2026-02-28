import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import {
  createCommunitySocket,
  getCommunityMessages,
  getCommunityOverview,
} from './community.service';
import CommunityHeader from './components/header/CommunityHeader';
import CommunityMessageList from './components/messages/CommunityMessageList';
import CommunityCompose from './components/compose/CommunityCompose';
import CommunitySidebar from './components/sidebar/CommunitySidebar';
import { getUserAvatar } from './utils/community.utils';
import { getGithubAvatarDataUri } from '../../shared/utils/avatar';
import '../../styles/sections/community/base.css';
import '../../styles/sections/community/header.css';
import '../../styles/sections/community/messages.css';
import '../../styles/sections/community/compose.css';

const CommunityHub = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ channels: [], stats: {}, posts: [] });
  const [room, setRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const role = useMemo(() => {
    if (user?.role === 'client') return 'corporate';
    return user?.role || 'student';
  }, [user?.role]);

  const normalizeRoomId = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return 'general';
    return raw.startsWith('#') ? raw.slice(1) : raw;
  };

  const displayRoom = (value) => {
    const safe = normalizeRoomId(value);
    return safe || 'general';
  };

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
      else setError(overviewRes.error || 'Failed to load community');

      if (msgRes.success) setMessages(msgRes.data.messages || []);
      else setError(msgRes.error || 'Failed to load messages');

      setLoading(false);
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
      setMessages((prev) => [...prev, message]);
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
            ? { ...item, comments: [...(item.comments || []), payload.comment] }
            : item
        )
      );
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
    const loadRoom = async () => {
      setMessages([]);
      const msgRes = await getCommunityMessages(room, 50);
      if (!msgRes.success) {
        setError(msgRes.error || 'Failed to load room');
        return;
      }
      setMessages(msgRes.data.messages || []);
    };

    loadRoom();

    const socket = socketRef.current;
    if (!socket) return;
    socket.emit('joinRoom', room);
    return () => socket.emit('leaveRoom', room);
  }, [room]);

  /* ── Auto-scroll on new messages ── */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  /* ── Hash navigation to stats ── */
  useEffect(() => {
    if (location.hash !== '#stats') return;
    const target = document.getElementById('community-stats');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [location.hash]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname, room]);

  /* ── Send ── */
  const sendMessage = () => {
    const content = draft.trim();
    const imagePayload = imageUrl;
    if ((!content && !imagePayload) || !socketRef.current) return;
    socketRef.current.emit('sendMessage', { room, content, imageUrl: imagePayload });
    setDraft('');
    setImageUrl('');
    setImageError('');
  };

  /* ── Room change ── */
  const handleRoomChange = (newRoom) => {
    setRoom(normalizeRoomId(newRoom));
  };

  const activeChannels = useMemo(() => {
    const source = overview.channels?.length
      ? overview.channels
      : [
          { id: 'general', name: 'General' },
          { id: 'ctf', name: 'CTF Talk' },
          { id: 'tools', name: 'Tools & Scripts' },
          { id: 'offtopic', name: 'Off-Topic' },
        ];

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
    if (!exists) {
      setRoom(activeChannels[0].id);
    }
  }, [activeChannels, room]);

  const isOwn = (msg) => msg.userId === user?.id || msg.username === user?.username;
  const currentUserAvatar = getUserAvatar(user);
  const currentUserAvatarFallback = getGithubAvatarDataUri(
    user?.email || user?.name || user?.username || 'user'
  );

  return (
    <div className="community-root">

      {/* ── Left Sidebar / Mobile Top Nav ── */}
      <CommunitySidebar
        role={role}
        mobileOpen={mobileNavOpen}
        onCloseMobileNav={() => setMobileNavOpen(false)}
      />

      {/* ── Main feed column ── */}
      <main className="community-main" aria-label={`#${displayRoom(room)} channel`}>
        <CommunityHeader
          activeChannels={activeChannels}
          room={room}
          onRoomChange={handleRoomChange}
          overviewStats={overview.stats}
          mobileNavOpen={mobileNavOpen}
          onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
        />

        <CommunityMessageList
          messages={messages}
          loading={loading}
          error={error}
          isOwn={isOwn}
          containerRef={scrollRef}
          onLike={(messageId) => socketRef.current?.emit('likeMessage', { messageId })}
          onAddComment={(messageId, content) =>
            socketRef.current?.emit('addComment', { messageId, content })
          }
          currentUserId={user?.id}
        />

        {user && (
          <button
            type="button"
            className="community-aside-user community-aside-user-mobile"
            onClick={() => navigate('/settings')}
            aria-label="Open account settings"
          >
            <img
              src={currentUserAvatar}
              alt={user?.username || 'User'}
              className="community-aside-user-avatar"
              onError={(e) => {
                if (e.currentTarget.src !== currentUserAvatarFallback) {
                  e.currentTarget.src = currentUserAvatarFallback;
                }
              }}
            />
            <div className="community-aside-user-info">
              <span className="community-aside-user-name">
                {user?.name || user?.username || 'User'}
              </span>
              <span className="community-aside-user-role">{role}</span>
            </div>
            <span className={`community-status-dot ${connected ? 'online' : 'offline'}`} />
          </button>
        )}

        <CommunityCompose
          user={user}
          room={room}
          draft={draft}
          onDraftChange={setDraft}
          onSend={sendMessage}
          imageUrl={imageUrl}
          onImageChange={setImageUrl}
          imageError={imageError}
          onImageError={setImageError}
        />
      </main>

      {/* ── Right aside (desktop ≥1024px only) ── */}
      <aside className="community-aside" id="community-stats">
        <div className="community-aside-card">
          <h2 className="community-aside-title">Community</h2>
          <div className="community-aside-stats">
            <div className="community-aside-stat">
              <span className="community-aside-stat-value">
                {Number(overview.stats?.learners || 0).toLocaleString()}
              </span>
              <span className="community-aside-stat-label">Online now</span>
            </div>
            <div className="community-aside-stat">
              <span className="community-aside-stat-value">
                {Number(overview.stats?.questions || 0).toLocaleString()}
              </span>
              <span className="community-aside-stat-label">Total posts</span>
            </div>
          </div>
        </div>

        <div className="community-aside-card">
          <h2 className="community-aside-title">Channels</h2>
          <div className="community-aside-channels">
            {activeChannels.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className={`community-aside-channel ${room === ch.id ? 'active' : ''}`}
                onClick={() => handleRoomChange(ch.id)}
              >
                <span className="community-aside-hash">#</span>
                {ch.name || ch.id}
              </button>
            ))}
          </div>
        </div>

        {user && (
          <button
            type="button"
            className="community-aside-user"
            onClick={() => navigate('/settings')}
            aria-label="Open account settings"
          >
            <img
              src={currentUserAvatar}
              alt={user?.username || 'User'}
              className="community-aside-user-avatar"
              onError={(e) => {
                if (e.currentTarget.src !== currentUserAvatarFallback) {
                  e.currentTarget.src = currentUserAvatarFallback;
                }
              }}
            />
            <div className="community-aside-user-info">
              <span className="community-aside-user-name">
                {user?.name || user?.username || 'User'}
              </span>
              <span className="community-aside-user-role">{role}</span>
            </div>
            <span className={`community-status-dot ${connected ? 'online' : 'offline'}`} />
          </button>
        )}
      </aside>

      {mobileNavOpen && (
        <button
          type="button"
          className="community-mobile-nav-overlay"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close community navigation"
        />
      )}

    </div>
  );
};

export default CommunityHub;
