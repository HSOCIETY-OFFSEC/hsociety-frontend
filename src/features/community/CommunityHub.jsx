import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import { createCommunitySocket, getCommunityMessages, getCommunityOverview } from './community.service';
import CommunityHeader from './components/header/CommunityHeader';
import CommunityMessageList from './components/messages/CommunityMessageList';
import CommunityCompose from './components/compose/CommunityCompose';
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
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const location = useLocation();

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

  useEffect(() => {
    if (location.hash !== '#stats') return;
    const target = document.getElementById('community-stats');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [location.hash]);

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
        { id: 'tools', name: 'Tools & Scripts' },
        { id: 'offtopic', name: 'Off-Topic' },
      ];

  const isOwn = (msg) => msg.userId === user?.id || msg.username === user?.username;

  return (
    <div className="community-root">
      <CommunityHeader
        activeChannels={activeChannels}
        room={room}
        onRoomChange={setRoom}
        overviewStats={overview.stats}
        connected={connected}
        user={user}
        role={role}
      />

      <main className="community-chat-panel" aria-label={`#${room} channel`}>
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
    </div>
  );
};

export default CommunityHub;
