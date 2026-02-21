import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheckCircle, FiHash, FiHeart, FiMessageSquare, FiSend, FiUsers, FiX } from 'react-icons/fi';
import { FiBookOpen, FiBriefcase, FiImage, FiPlus, FiShield, FiTrendingUp } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import { useAuth } from '../../core/auth/AuthContext';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import BinaryLoader from '../../shared/components/ui/BinaryLoader';
import {
  addComment,
  disconnectCommunitySocket,
  getCommunityMessages,
  getCommunityOverview,
  joinRoom,
  leaveRoom,
  likeMessage,
  onCommentAdded,
  onMessageLiked,
  onReceiveMessage,
  onTyping,
  sendMessageWithImage,
  sendTyping
} from './community.service';
import communityContent from '../../data/community.json';
import '../../styles/features/community.css';

const GROUP_WINDOW_MS = 5 * 60 * 1000;
const MAX_MESSAGES = 200;
const MAX_IMAGE_SIZE = 200 * 1024;

const Community = () => {
  useScrollReveal();
  const { user } = useAuth();
  const [overview, setOverview] = useState({
    stats: { learners: 0, questions: 0, answered: 0 },
    channels: [],
    tags: []
  });
  const [loading, setLoading] = useState(true);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [unreadByRoom, setUnreadByRoom] = useState({});
  const [typingByRoom, setTypingByRoom] = useState({});
  const [chatLoading, setChatLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentOpen, setCommentOpen] = useState({});
  const [error, setError] = useState('');
  const [activeChannelId, setActiveChannelId] = useState('general');
  const [activeTag, setActiveTag] = useState(null);
  const role = user?.role || 'student';
  const isCorporate = role === 'corporate';
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const activeRoomRef = useRef(activeChannelId);
  const fileInputRef = useRef(null);
  const currentUserId = user?.id || user?._id || '';

  useEffect(() => {
    activeRoomRef.current = activeChannelId;
  }, [activeChannelId]);

  const iconMap = useMemo(() => ({
    FiBookOpen,
    FiBriefcase,
    FiShield,
    FiUsers,
    FiImage,
    FiTrendingUp,
    FiPlus
  }), []);

  const cta = useMemo(() => (
    isCorporate ? communityContent.hero.cta.corporate : communityContent.hero.cta.student
  ), [isCorporate]);

  const resolveRoomName = (roomId) => {
    if (roomId === 'general') return 'General';
    return overview.channels.find((channel) => channel.id === roomId)?.name || 'Community Chat';
  };

  const addMessageToRoom = (room, message) => {
    setMessagesByRoom((prev) => {
      const current = prev[room] || [];
      if (current.some((item) => item.id === message.id)) return prev;
      const next = [...current, message].slice(-MAX_MESSAGES);
      return { ...prev, [room]: next };
    });
  };

  const updateMessageInRoom = (room, messageId, updater) => {
    setMessagesByRoom((prev) => {
      const current = prev[room] || [];
      const next = current.map((message) => (
        message.id === messageId ? updater(message) : message
      ));
      return { ...prev, [room]: next };
    });
  };

  useEffect(() => {
    let mounted = true;
    const loadOverview = async () => {
      setLoading(true);
      setError('');
      const response = await getCommunityOverview({ role, feed: 'popular' });
      if (!mounted) return;
      if (!response.success) {
        setError(response.error || communityContent.feed.errorFallback);
      } else {
        setOverview({
          stats: response.data.stats || { learners: 0, questions: 0, answered: 0 },
          channels: response.data.channels || [],
          tags: response.data.tags || []
        });
      }
      setLoading(false);
    };

    loadOverview();
    return () => {
      mounted = false;
    };
  }, [role]);

  useEffect(() => {
    const unsubscribeMessage = onReceiveMessage((message) => {
      if (!message?.room) return;
      addMessageToRoom(message.room, message);

      if (message.room !== activeRoomRef.current) {
        setUnreadByRoom((prev) => ({
          ...prev,
          [message.room]: (prev[message.room] || 0) + 1
        }));
      }
    });

    const unsubscribeTyping = onTyping((payload) => {
      const room = payload?.room;
      if (!room) return;
      setTypingByRoom((prev) => {
        const current = new Map(Object.entries(prev[room] || {}));
        if (payload?.isTyping) {
          current.set(payload.userId || payload.username, payload.username || 'Community Member');
        } else {
          current.delete(payload.userId || payload.username);
        }
        const roomTyping = Object.fromEntries(current.entries());
        return { ...prev, [room]: roomTyping };
      });
    });

    const unsubscribeLikes = onMessageLiked((payload) => {
      if (!payload?.room || !payload?.messageId) return;
      updateMessageInRoom(payload.room, payload.messageId, (message) => ({
        ...message,
        likes: payload.likes,
        likedBy: payload.likedBy || []
      }));
    });

    const unsubscribeComments = onCommentAdded((payload) => {
      if (!payload?.room || !payload?.messageId || !payload?.comment) return;
      updateMessageInRoom(payload.room, payload.messageId, (message) => ({
        ...message,
        comments: [...(message.comments || []), payload.comment]
      }));
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeLikes();
      unsubscribeComments();
      disconnectCommunitySocket();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const room = activeChannelId || 'general';

    const bootstrapChat = async () => {
      setChatLoading(true);
      const response = await getCommunityMessages({ room, limit: 50 });
      if (!mounted) return;
      if (response.success) {
        const ordered = (response.data?.messages || []).slice().reverse();
        setMessagesByRoom((prev) => ({ ...prev, [room]: ordered }));
      } else {
        setError(response.error || 'Failed to load chat history.');
      }
      setChatLoading(false);
      setUnreadByRoom((prev) => ({ ...prev, [room]: 0 }));
    };

    bootstrapChat();
    joinRoom(room);

    return () => {
      mounted = false;
      leaveRoom(room);
    };
  }, [activeChannelId]);

  const handleChannelClick = (channel) => {
    setActiveChannelId(channel.id);
  };

  const handleTagClick = (tag) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  const handleSendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed && !imagePreview) return;
    if (trimmed.length > 500) return;

    sendMessageWithImage({
      room: activeChannelId || 'general',
      content: trimmed,
      imageUrl: imagePreview || ''
    });

    setMessageInput('');
    setImagePreview('');
    setImageError('');

    if (isTypingRef.current) {
      sendTyping({ room: activeChannelId || 'general', isTyping: false });
      isTypingRef.current = false;
    }
  };

  const handleMessageChange = (value) => {
    setMessageInput(value);
    const room = activeChannelId || 'general';
    const isTyping = value.trim().length > 0;

    if (isTyping && !isTypingRef.current) {
      sendTyping({ room, isTyping: true });
      isTypingRef.current = true;
    }

    if (!isTyping && isTypingRef.current) {
      sendTyping({ room, isTyping: false });
      isTypingRef.current = false;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping({ room, isTyping: false });
        isTypingRef.current = false;
      }, 1200);
    }
  };

  const handleInputBlur = () => {
    const room = activeChannelId || 'general';
    if (isTypingRef.current) {
      sendTyping({ room, isTyping: false });
      isTypingRef.current = false;
    }
  };

  const handleImageSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Only image files are supported.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError('Image must be under 200KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result || ''));
      setImageError('');
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview('');
    setImageError('');
  };

  const handleToggleLike = (message) => {
    if (!message?.id) return;

    const likedBy = new Set(message.likedBy || []);
    const alreadyLiked = currentUserId && likedBy.has(currentUserId);
    const nextLikedBy = new Set(likedBy);
    if (alreadyLiked) {
      nextLikedBy.delete(currentUserId);
    } else if (currentUserId) {
      nextLikedBy.add(currentUserId);
    }

    updateMessageInRoom(message.room, message.id, (current) => ({
      ...current,
      likes: Math.max(0, (current.likes || 0) + (alreadyLiked ? -1 : 1)),
      likedBy: Array.from(nextLikedBy)
    }));

    likeMessage({ messageId: message.id });
  };

  const handleToggleComment = (messageId) => {
    setCommentOpen((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  const handleCommentChange = (messageId, value) => {
    setCommentDrafts((prev) => ({ ...prev, [messageId]: value }));
  };

  const handleSendComment = (messageId) => {
    const draft = String(commentDrafts[messageId] || '').trim();
    if (!draft || draft.length > 300) return;
    addComment({ messageId, content: draft });
    setCommentDrafts((prev) => ({ ...prev, [messageId]: '' }));
    setCommentOpen((prev) => ({ ...prev, [messageId]: false }));
  };

  const roomId = activeChannelId || 'general';
  const currentMessages = messagesByRoom[roomId] || [];
  const typingUsers = Object.values(typingByRoom[roomId] || {}).filter(Boolean);

  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentGroup = null;

    currentMessages.forEach((message) => {
      const timestamp = message.createdAt ? new Date(message.createdAt).getTime() : 0;
      const sameUser = currentGroup && currentGroup.userId === message.userId;
      const closeInTime = currentGroup && Math.abs(timestamp - currentGroup.lastTimestamp) <= GROUP_WINDOW_MS;

      if (currentGroup && sameUser && closeInTime) {
        currentGroup.messages.push(message);
        currentGroup.lastTimestamp = timestamp;
      } else {
        currentGroup = {
          id: message.id,
          userId: message.userId,
          username: message.username,
          timestamp,
          lastTimestamp: timestamp,
          messages: [message]
        };
        groups.push(currentGroup);
      }
    });

    return groups;
  }, [currentMessages]);

  return (
    <div className="community-page">
        <header className="community-hero reveal-on-scroll">
          <div className="community-hero-content">
            <div>
              <p className="community-kicker">{communityContent.hero.kicker}</p>
              <h1>{communityContent.hero.title}</h1>
              <p>
                {communityContent.hero.subtitle}
              </p>
            </div>
            <Button
              variant="primary"
              size="large"
              onClick={() => {}}
            >
              {isCorporate ? <FiBriefcase size={18} /> : <FiBookOpen size={18} />}
              {cta.title}
            </Button>
          </div>
          <div className="community-hero-stats">
            <div className="hero-stat">
              <FiUsers size={18} />
              <span>{overview.stats.learners || 0} {communityContent.stats.learnersLabel}</span>
            </div>
            <div className="hero-stat">
              <FiMessageSquare size={18} />
              <span>{overview.stats.questions || 0} {communityContent.stats.questionsLabel}</span>
            </div>
            <div className="hero-stat">
              <FiCheckCircle size={18} />
              <span>{overview.stats.answered || 0} {communityContent.stats.answeredLabel}</span>
            </div>
          </div>
        </header>

        <div className="community-layout">
          <aside className="community-sidebar reveal-on-scroll">
            <Card padding="large" className="sidebar-card">
              <h3>{communityContent.sidebar.channelsTitle}</h3>
              <div className="sidebar-list">
                <button
                  type="button"
                  className={activeChannelId === 'general' ? 'active' : ''}
                  onClick={() => setActiveChannelId('general')}
                >
                  <FiHash size={16} />
                  General
                  {unreadByRoom.general > 0 && (
                    <span className="room-badge">{unreadByRoom.general}</span>
                  )}
                </button>
                {overview.channels.map((channel) => (
                  <button
                    key={channel.id}
                    type="button"
                    className={activeChannelId === channel.id ? 'active' : ''}
                    onClick={() => handleChannelClick(channel)}
                  >
                    <FiHash size={16} /> {channel.name}
                    {unreadByRoom[channel.id] > 0 && (
                      <span className="room-badge">{unreadByRoom[channel.id]}</span>
                    )}
                  </button>
                ))}
              </div>
            </Card>

            <Card padding="large" className="sidebar-card">
              <h3>{isCorporate ? communityContent.sidebar.corporate.title : communityContent.sidebar.student.title}</h3>
              <p>
                {isCorporate
                  ? communityContent.sidebar.corporate.description
                  : communityContent.sidebar.student.description}
              </p>
              <div className="sidebar-list">
                {(isCorporate ? communityContent.sidebar.corporate.actions : communityContent.sidebar.student.actions).map((action) => {
                  const ActionIcon = iconMap[action.icon];
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => {}}
                    >
                      {ActionIcon && <ActionIcon size={16} />} {action.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card padding="large" className="sidebar-card">
              <h3>{communityContent.sidebar.trendingTagsTitle}</h3>
              <div className="tag-list">
                {overview.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={activeTag === tag ? 'active' : ''}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          <main className="community-feed">
            {(activeChannelId || activeTag) && (
              <div className="active-filters">
                {activeChannelId && (
                  <button
                    type="button"
                    onClick={() => setActiveChannelId('general')}
                  >
                    {communityContent.activeFilters.channelPrefix} {resolveRoomName(activeChannelId)}
                  </button>
                )}
                {activeTag && (
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                  >
                    {communityContent.activeFilters.tagPrefix} {activeTag}
                  </button>
                )}
              </div>
            )}

            <Card padding="large" className="chat-panel reveal-on-scroll">
              <div className="chat-header">
                <div>
                  <p className="chat-kicker">Live Room</p>
                  <h3>{resolveRoomName(activeChannelId)}</h3>
                </div>
                <span className="chat-badge">Secure Socket</span>
              </div>

              {error && (
                <div className="chat-alert">
                  <p>{error}</p>
                </div>
              )}

              {chatLoading || loading ? (
                <div className="chat-loading">
                  <BinaryLoader size="sm" message={communityContent.feed.loading} />
                </div>
              ) : (
                <div className="chat-messages">
                  {groupedMessages.length === 0 && (
                    <p className="chat-empty">No messages yet. Start the conversation.</p>
                  )}
                  {groupedMessages.map((group) => (
                    <div key={group.id} className="chat-group">
                      <div className="chat-avatar">
                        {group.username?.charAt(0)?.toUpperCase() || 'C'}
                      </div>
                      <div className="chat-body">
                        <div className="chat-meta">
                          <span className="chat-author">{group.username || 'Community Member'}</span>
                          <span className="chat-time">
                            {group.timestamp
                              ? new Date(group.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : ''}
                          </span>
                        </div>
                        <div className="chat-group-messages">
                          {group.messages.map((message) => {
                            const likedBy = message.likedBy || [];
                            const isLiked = currentUserId && likedBy.includes(currentUserId);
                            return (
                              <div key={message.id} className="chat-message-item">
                                {message.content && <p>{message.content}</p>}
                                {message.imageUrl && (
                                  <div className="chat-image">
                                    <img src={message.imageUrl} alt="Shared" loading="lazy" />
                                  </div>
                                )}
                                <div className="chat-message-actions">
                                  <button
                                    type="button"
                                    className={isLiked ? 'liked' : ''}
                                    onClick={() => handleToggleLike(message)}
                                  >
                                    <FiHeart size={14} /> {message.likes || 0}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleComment(message.id)}
                                  >
                                    <FiMessageSquare size={14} /> {(message.comments || []).length}
                                  </button>
                                </div>
                                {commentOpen[message.id] && (
                                  <div className="chat-comment-box">
                                    <input
                                      type="text"
                                      value={commentDrafts[message.id] || ''}
                                      onChange={(e) => handleCommentChange(message.id, e.target.value)}
                                      placeholder="Write a comment..."
                                      maxLength={300}
                                    />
                                    <button type="button" onClick={() => handleSendComment(message.id)}>
                                      Comment
                                    </button>
                                  </div>
                                )}
                                {(message.comments || []).length > 0 && (
                                  <div className="chat-comments">
                                    {(message.comments || []).map((comment) => (
                                      <div key={comment.id || comment.createdAt} className="chat-comment">
                                        <div className="chat-comment-meta">
                                          <span>{comment.username || 'Community Member'}</span>
                                          <span>
                                            {comment.createdAt
                                              ? new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                              : ''}
                                          </span>
                                        </div>
                                        <p>{comment.content}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {typingUsers.length > 0 && (
                <div className="chat-typing">
                  <span className="typing-dot"></span>
                  <span className="typing-text">
                    {typingUsers.slice(0, 2).join(', ')}{typingUsers.length > 2 ? ' and others' : ''} typing...
                  </span>
                </div>
              )}

              {imageError && (
                <div className="chat-alert">
                  <p>{imageError}</p>
                </div>
              )}

              {imagePreview && (
                <div className="chat-attachment-preview">
                  <img src={imagePreview} alt="Attachment preview" />
                  <button type="button" className="remove-attachment" onClick={clearImage}>
                    <FiX size={14} />
                  </button>
                </div>
              )}

              <div className="chat-composer">
                <div className="chat-composer-input">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => handleMessageChange(e.target.value)}
                    onBlur={handleInputBlur}
                    placeholder="Type your message..."
                    maxLength={500}
                  />
                  <button type="button" className="chat-upload" onClick={handleImageSelect}>
                    <FiImage size={16} />
                    Add Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="chat-file-input"
                  />
                </div>
                <Button
                  className="chat-send"
                  variant="secondary"
                  size="small"
                  onClick={handleSendMessage}
                  disabled={(!messageInput.trim() && !imagePreview) || messageInput.trim().length > 500}
                >
                  <FiSend size={16} />
                  Send
                </Button>
              </div>
              <p className="chat-hint">Max 500 characters. Images under 200KB.</p>
            </Card>
          </main>

          <aside className="community-right reveal-on-scroll">
            <Card padding="large" className="sidebar-card">
              <h3>{isCorporate ? communityContent.rightSidebar.corporate.title : communityContent.rightSidebar.student.title}</h3>
              <p>
                {isCorporate
                  ? communityContent.rightSidebar.corporate.description
                  : communityContent.rightSidebar.student.description}
              </p>
              <Button
                variant="ghost"
                size="small"
                onClick={() => {}}
              >
                {isCorporate ? communityContent.rightSidebar.corporate.button : communityContent.rightSidebar.student.button}
              </Button>
            </Card>
          </aside>
        </div>
      </div>
  );
};

export default Community;
