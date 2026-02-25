import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiMessageSquare, FiSend, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../core/auth/AuthContext';
import Card from '../../shared/components/ui/Card';
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
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

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

      if (overviewRes.success) {
        setOverview(overviewRes.data);
      } else {
        setError(overviewRes.error || 'Failed to load community');
      }

      if (msgRes.success) {
        setMessages(msgRes.data.messages || []);
      } else {
        setError(msgRes.error || 'Failed to load messages');
      }

      setLoading(false);
    };

    load();

    const socket = createCommunitySocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinRoom', room);
    });

    socket.on('receiveMessage', (message) => {
      if (message.room !== room) return;
      setMessages((prev) => [...prev, message]);
    });

    socket.on('messageLiked', (payload) => {
      if (payload.room !== room) return;
      setMessages((prev) =>
        prev.map((item) =>
          item.id === payload.messageId ? { ...item, likes: payload.likes, likedBy: payload.likedBy } : item
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
  };

  const activeChannels = overview.channels?.length
    ? overview.channels
    : [
        { id: 'general', name: 'General' },
        { id: 'ctf', name: 'CTF Talk' },
      ];

  return (
    <div className="community-page dashboard-shell">
      <header className="community-header dashboard-shell-header">
        <div>
          <p className="dashboard-shell-kicker">Community</p>
          <h1 className="dashboard-shell-title">Real-time collaboration</h1>
          <p className="dashboard-shell-subtitle">
            Join role-based channels, share progress, and collaborate during live engagements.
          </p>
        </div>
        <div className="community-stats">
          <span>
            <FiUsers size={14} /> Learners: {Number(overview.stats?.learners || 0).toLocaleString()}
          </span>
          <span>
            <FiMessageSquare size={14} /> Questions: {Number(overview.stats?.questions || 0).toLocaleString()}
          </span>
        </div>
      </header>

      {error && <p className="community-error">{error}</p>}

      <div className="community-grid">
        <Card className="community-channels" padding="medium">
          <h3>Channels</h3>
          <div className="community-channel-list">
            {activeChannels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                className={room === channel.id ? 'active' : ''}
                onClick={() => setRoom(channel.id)}
              >
                #{channel.id}
                <span>{channel.name}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="community-chat" padding="medium">
          <h3>#{room}</h3>
          <div className="community-messages" ref={scrollRef}>
            {loading ? (
              <p>Loading messages...</p>
            ) : messages.length === 0 ? (
              <p>No messages yet for this room.</p>
            ) : (
              messages.map((message) => (
                <article key={message.id} className="community-message">
                  <div>
                    <strong>{message.username}</strong>
                    <small>{new Date(message.createdAt).toLocaleTimeString()}</small>
                  </div>
                  <p>{message.content}</p>
                </article>
              ))
            )}
          </div>
          <div className="community-compose">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a message..."
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button size="small" variant="primary" onClick={sendMessage} disabled={!draft.trim()}>
              <FiSend size={14} /> Send
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunityHub;
