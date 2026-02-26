import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiHash, FiMessageSquare, FiSend, FiUsers, FiWifi } from 'react-icons/fi';
import { useAuth } from '../../core/auth/AuthContext';
import Button from '../../shared/components/ui/Button';
import { createCommunitySocket, getCommunityMessages, getCommunityOverview } from './community.service';
import '../../styles/features/community.css';

const CommunityHub = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ channels: [], stats: {}, posts: [] });
  const [room, setRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const role = useMemo(() => {
    if (user?.role === 'client') return 'corporate';
    return user?.role || 'student';
  }, [user?.role]);

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
  }, [role]);

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

    return () => {
      socket.emit('leaveRoom', room);
    };
  }, [room]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    const content = draft.trim();
    if (!content || !socketRef.current) return;
    socketRef.current.emit('sendMessage', { room, content });
    setDraft('');
    inputRef.current?.focus();
  };

  const handleRoomSwitch = (channelId) => {
    setRoom(channelId);
    setSidebarOpen(false);
  };

  const activeChannels = overview.channels?.length
    ? overview.channels
    : [
        { id: 'general', name: 'General' },
        { id: 'ctf', name: 'CTF Talk' },
        { id: 'tools', name: 'Tools & Scripts' },
        { id: 'offtopic', name: 'Off-Topic' },
      ];

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '??';

  const isOwn = (msg) => msg.userId === user?.id || msg.username === user?.username;

  return (
    <div className="community-root">

      {/* ── Mobile top bar ───────────────────────────────────── */}
      <div className="community-topbar">
        <button
          className="community-topbar-channels"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle channels"
          aria-expanded={sidebarOpen}
        >
          <FiHash size={16} />
          <span>#{room}</span>
        </button>
        <div className="community-topbar-meta">
          <span className={`community-status-dot ${connected ? 'online' : 'offline'}`} aria-hidden="true" />
          <span className="community-topbar-title">Community</span>
        </div>
      </div>

      {/* ── Layout ───────────────────────────────────────────── */}
      <div className={`community-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <aside className="community-sidebar" aria-label="Channels">

          {/* Sidebar header */}
          <div className="community-sidebar-head">
            <p className="community-sidebar-kicker">HSOCIETY</p>
            <h2 className="community-sidebar-title">Community</h2>
            <div className="community-sidebar-stats">
              <span>
                <FiUsers size={12} />
                {Number(overview.stats?.learners || 0).toLocaleString()} online
              </span>
              <span>
                <FiMessageSquare size={12} />
                {Number(overview.stats?.questions || 0).toLocaleString()} posts
              </span>
            </div>
          </div>

          {/* Channel list */}
          <nav className="community-channel-nav" aria-label="Channel list">
            <p className="community-channel-group-label">Channels</p>
            {activeChannels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                className={`community-channel-btn ${room === channel.id ? 'active' : ''}`}
                onClick={() => handleRoomSwitch(channel.id)}
                aria-current={room === channel.id ? 'true' : undefined}
              >
                <FiHash size={14} className="community-channel-icon" />
                <span className="community-channel-name">{channel.name || channel.id}</span>
                {room === channel.id && (
                  <span className="community-channel-active-pip" aria-hidden="true" />
                )}
              </button>
            ))}
          </nav>

          {/* User badge */}
          {user && (
            <div className="community-user-badge">
              <div className="community-user-avatar" aria-hidden="true">
                {getInitials(user.name || user.username)}
              </div>
              <div className="community-user-info">
                <span className="community-user-name">{user.name || user.username}</span>
                <span className="community-user-role">{role}</span>
              </div>
              <span
                className={`community-status-dot ${connected ? 'online' : 'offline'}`}
                title={connected ? 'Connected' : 'Disconnected'}
              />
            </div>
          )}
        </aside>

        {/* ── Backdrop (mobile) ──────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="community-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Chat panel ───────────────────────────────────────── */}
        <main className="community-chat-panel" aria-label={`#${room} channel`}>

          {/* Chat header */}
          <div className="community-chat-head">
            <div className="community-chat-head-left">
              <FiHash size={16} aria-hidden="true" />
              <strong>{room}</strong>
            </div>
            <div className="community-chat-head-right">
              <span className={`community-conn-badge ${connected ? 'live' : 'away'}`}>
                <FiWifi size={11} />
                {connected ? 'Live' : 'Reconnecting'}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="community-error" role="alert">
              {error}
            </div>
          )}

          {/* Messages */}
          <div className="community-messages" ref={scrollRef} role="log" aria-live="polite" aria-label="Messages">
            {loading ? (
              <div className="community-msg-state">
                <span className="community-loading-dots">
                  <span /><span /><span />
                </span>
                <p>Loading messages…</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="community-msg-state">
                <FiMessageSquare size={28} />
                <p>No messages yet. Say hello!</p>
              </div>
            ) : (
              messages.map((message, i) => {
                const own = isOwn(message);
                const prevMsg = messages[i - 1];
                const grouped =
                  prevMsg && prevMsg.username === message.username &&
                  new Date(message.createdAt) - new Date(prevMsg.createdAt) < 120000;

                return (
                  <article
                    key={message.id}
                    className={`community-message ${own ? 'own' : ''} ${grouped ? 'grouped' : ''}`}
                  >
                    {!grouped && (
                      <div className="community-msg-avatar" aria-hidden="true">
                        {getInitials(message.username)}
                      </div>
                    )}
                    {grouped && <div className="community-msg-avatar-spacer" aria-hidden="true" />}

                    <div className="community-msg-body">
                      {!grouped && (
                        <div className="community-msg-meta">
                          <span className="community-msg-author">{message.username}</span>
                          <time
                            className="community-msg-time"
                            dateTime={message.createdAt}
                            title={new Date(message.createdAt).toLocaleString()}
                          >
                            {formatTime(message.createdAt)}
                          </time>
                        </div>
                      )}
                      <div className="community-msg-bubble">
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Compose */}
          <div className="community-compose" role="form" aria-label="Send a message">
            <div className="community-compose-avatar" aria-hidden="true">
              {getInitials(user?.name || user?.username)}
            </div>
            <div className="community-compose-inner">
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message #${room}`}
                aria-label={`Message #${room}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                maxLength={1000}
              />
              <button
                type="button"
                className="community-send-btn"
                onClick={sendMessage}
                disabled={!draft.trim()}
                aria-label="Send message"
              >
                <FiSend size={15} />
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default CommunityHub;