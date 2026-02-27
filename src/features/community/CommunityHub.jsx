import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const location = useLocation();

  const role = useMemo(() => {
    if (user?.role === 'client') return 'corporate';
    return user?.role || 'student';
  }, [user?.role]);

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

  /* ── Send ── */
  const sendMessage = () => {
    const content = draft.trim();
    if (!content || !socketRef.current) return;
    socketRef.current.emit('sendMessage', { room, content });
    setDraft('');
  };

  /* ── Room change (closes drawer on mobile) ── */
  const handleRoomChange = (newRoom) => {
    setRoom(newRoom);
    setMobileSidebarOpen(false);
  };

  /* ── Close drawer on Escape ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && mobileSidebarOpen) setMobileSidebarOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileSidebarOpen]);

  const activeChannels = overview.channels?.length
    ? overview.channels
    : [
        { id: 'general', name: 'General' },
        { id: 'ctf', name: 'CTF Talk' },
        { id: 'tools', name: 'Tools & Scripts' },
        { id: 'offtopic', name: 'Off-Topic' },
      ];

  const isOwn = (msg) => msg.userId === user?.id || msg.username === user?.username;

  return (
    <div className="community-root">

      {/* ── Left Sidebar / Mobile Drawer ── */}
      <CommunitySidebar
        activeChannels={activeChannels}
        room={room}
        onRoomChange={handleRoomChange}
        overviewStats={overview.stats}
        connected={connected}
        user={user}
        role={role}
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Backdrop — only rendered when drawer is open ──
          Using inline visibility so it doesn't interfere with the grid
          and never causes a blank overlay when closed.             ── */}
      {mobileSidebarOpen && (
        <div
          className="community-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main feed column ── */}
      <main className="community-main" aria-label={`#${room} channel`}>
        <CommunityHeader
          activeChannels={activeChannels}
          room={room}
          onRoomChange={handleRoomChange}
          overviewStats={overview.stats}
          connected={connected}
          user={user}
          role={role}
          onMenuOpen={() => setMobileSidebarOpen(true)}
        />

        <CommunityMessageList
          messages={messages}
          loading={loading}
          error={error}
          isOwn={isOwn}
          containerRef={scrollRef}
        />

        <CommunityCompose
          user={user}
          room={room}
          draft={draft}
          onDraftChange={setDraft}
          onSend={sendMessage}
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
          <div className="community-aside-user">
            <img
              src={
                user?.avatarUrl ||
                user?.photoUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  user?.username || user?.email || 'u'
                )}`
              }
              alt={user?.username || 'User'}
              className="community-aside-user-avatar"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="community-aside-user-info">
              <span className="community-aside-user-name">
                {user?.name || user?.username || 'User'}
              </span>
              <span className="community-aside-user-role">{role}</span>
            </div>
            <span className={`community-status-dot ${connected ? 'online' : 'offline'}`} />
          </div>
        )}
      </aside>

      {/* ── Mobile bottom tab bar (≤768px) ── */}
      <nav className="community-mobile-tabs" aria-label="Channels">
        {activeChannels.slice(0, 4).map((ch) => (
          <button
            key={ch.id}
            type="button"
            className={`community-mobile-tab ${room === ch.id ? 'active' : ''}`}
            onClick={() => handleRoomChange(ch.id)}
            aria-current={room === ch.id ? 'true' : undefined}
          >
            <span className="community-mobile-tab-hash">#</span>
            <span className="community-mobile-tab-name">{ch.name || ch.id}</span>
          </button>
        ))}
      </nav>

    </div>
  );
};

export default CommunityHub;
