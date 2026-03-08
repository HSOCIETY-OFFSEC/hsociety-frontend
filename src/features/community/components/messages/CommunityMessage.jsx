import { useEffect, useRef, useState } from 'react';
import { FiHeart, FiMessageSquare, FiMoreHorizontal, FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getDisplayName, getMessageAvatar, formatMessageTime } from '../../utils/community.utils';
import { sanitizeText } from '../../../../shared/utils/sanitize';
import { COMMUNITY_UI } from '../../../../data/community/communityUiData';

const CommunityMessage = ({
  message,
  grouped,
  own,
  onLike,
  onAddComment,
  onReact,
  reactionEmojis = [],
  reactionLimit = 3,
  currentUserId,
}) => {
  const authorName = getDisplayName(message?.username || message?.user?.name || message?.user?.username);
  const avatarSrc = getMessageAvatar(message);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [reactionOpen, setReactionOpen] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const reactionRef = useRef(null);
  const navigate = useNavigate();
  const likes = Number(message?.likes || 0);
  const comments = message?.comments || [];
  const liked = currentUserId ? message?.likedBy?.includes(currentUserId) : false;
  const profileTarget = message?.hackerHandle || message?.userId || '';
  const reactions = message?.reactions || {};
  const reactionPool = [...new Set([...(reactionEmojis || []), ...Object.keys(reactions || {})])];
  const inlineReactionPool = reactionPool.slice(0, COMMUNITY_UI.reactions.inlineVisibleCount);
  const overflowReactionPool = reactionPool.slice(COMMUNITY_UI.reactions.inlineVisibleCount);
  const userReactionCount = Object.values(reactions).filter(
    (entry) => currentUserId && Array.isArray(entry.users) && entry.users.includes(currentUserId)
  ).length;
  const [supportsHover, setSupportsHover] = useState(false);

  useEffect(() => {
    if (!reactionOpen) return undefined;
    const handleClick = (event) => {
      if (reactionRef.current && !reactionRef.current.contains(event.target)) {
        setReactionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [reactionOpen]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setSupportsHover(mediaQuery.matches);
    apply();
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', apply);
      return () => mediaQuery.removeEventListener('change', apply);
    }
    mediaQuery.addListener(apply);
    return () => mediaQuery.removeListener(apply);
  }, []);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // Double-tap detected — like the message
      if (!liked) onLike?.(message.id);
    }
    setLastTap(now);
  };

  const handleOpenProfile = () => {
    if (!profileTarget) return;
    navigate(`/community/profile/${encodeURIComponent(profileTarget)}`);
  };

  const handleSubmitComment = () => {
    const content = commentDraft.trim();
    if (!content) return;
    onAddComment?.(message.id, content);
    setCommentDraft('');
  };

  return (
    <article
      className={`community-message ${own ? 'own' : ''} ${grouped ? 'grouped' : ''}`}
    >
      {!grouped ? (
        <button
          type="button"
          className="community-msg-avatar"
          onClick={handleOpenProfile}
          aria-label={`Open ${authorName} profile`}
        >
          <img
            src={avatarSrc}
            alt={`${authorName} avatar`}
            onError={(e) => {
              e.currentTarget.src = getMessageAvatar({ username: authorName });
            }}
          />
        </button>
      ) : (
        <div className="community-msg-avatar-spacer" aria-hidden="true" />
      )}

      <div className="community-msg-body">
        {!grouped && (
          <div className="community-msg-meta">
            <button
              type="button"
              className="community-msg-author"
              onClick={handleOpenProfile}
              aria-label={`Open ${authorName} profile`}
            >
              {authorName}
            </button>
            {message?.hackerHandle && (
              <span className="community-msg-handle">@{message.hackerHandle}</span>
            )}
            {message?.pinned && <span className="community-msg-pin">{COMMUNITY_UI.messages.pinnedTitle}</span>}
            {message?.userRole && <span className="community-msg-role">{message.userRole}</span>}
            <time
              className="community-msg-time"
              dateTime={message?.createdAt}
              title={message?.createdAt ? new Date(message.createdAt).toLocaleString() : undefined}
            >
              {formatMessageTime(message?.createdAt)}
            </time>
          </div>
        )}
        <div className="community-msg-bubble" onTouchEnd={handleDoubleTap}>
          {message?.content && <p>{sanitizeText(message.content)}</p>}
          {message?.imageUrl && (
            <img
              className="community-msg-image"
              src={message.imageUrl}
              alt="Shared attachment"
              loading="lazy"
            />
          )}
        </div>

        <div className="community-msg-actions">
          <button
            type="button"
            className={`community-msg-action ${liked ? 'active' : ''}`}
            onClick={() => onLike?.(message.id)}
            aria-pressed={liked}
            aria-label={liked ? 'Unlike message' : 'Like message'}
          >
            <FiHeart size={14} />
            <span>{likes}</span>
          </button>
          <button
            type="button"
            className="community-msg-action"
            onClick={() => setCommentOpen((prev) => !prev)}
            aria-expanded={commentOpen}
            aria-label="Toggle comments"
          >
            <FiMessageSquare size={14} />
            <span>{comments.length}</span>
          </button>
        </div>

        <div className="community-msg-reactions" role="group" aria-label="Reactions">
          {inlineReactionPool.map((emoji) => {
            const data = reactions[emoji] || { count: 0, users: [] };
            const reacted =
              currentUserId && Array.isArray(data.users) && data.users.includes(currentUserId);
            return (
              <button
                key={emoji}
                type="button"
                className={`community-msg-reaction ${reacted ? 'active' : ''}`}
                onClick={() => onReact?.(message.id, emoji)}
                aria-pressed={reacted}
                aria-label={`React with ${emoji}`}
              >
                <span className="community-msg-reaction-emoji">{emoji}</span>
                {data.count > 0 && (
                  <span className="community-msg-reaction-count">{data.count}</span>
                )}
              </button>
            );
          })}
          {overflowReactionPool.length > 0 && (
            <div
              className="community-msg-reaction-picker"
              ref={reactionRef}
              onMouseEnter={() => {
                if (supportsHover) setReactionOpen(true);
              }}
              onMouseLeave={() => {
                if (supportsHover) setReactionOpen(false);
              }}
            >
              <button
                type="button"
                className={`community-msg-reaction-add ${reactionOpen ? 'active' : ''}`}
                onClick={() => {
                  if (!supportsHover) setReactionOpen((prev) => !prev);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    setReactionOpen(false);
                  }
                }}
                aria-label={COMMUNITY_UI.reactions.moreLabel}
                aria-expanded={reactionOpen}
              >
                <FiMoreHorizontal size={14} />
              </button>
              {reactionOpen && (
                <div
                  className="community-msg-reaction-panel"
                  role="listbox"
                  aria-label={COMMUNITY_UI.reactions.panelLabel}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.preventDefault();
                      setReactionOpen(false);
                    }
                  }}
                >
                  {overflowReactionPool.map((emoji) => {
                    const data = reactions[emoji] || { count: 0, users: [] };
                    const reacted =
                      currentUserId && Array.isArray(data.users) && data.users.includes(currentUserId);
                    const blocked = !reacted && userReactionCount >= reactionLimit;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        className="community-msg-reaction-item"
                        onClick={() => {
                          if (blocked) return;
                          onReact?.(message.id, emoji);
                          setReactionOpen(false);
                        }}
                        disabled={blocked}
                        aria-label={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {commentOpen && (
          <div className="community-msg-comments" role="region" aria-label="Comments">
            {comments.length === 0 ? (
              <p className="community-msg-comment-empty">{COMMUNITY_UI.messages.noCommentsText}</p>
            ) : (
              comments.map((comment) => (
                <div className="community-msg-comment" key={comment.id || comment.createdAt}>
                  <div className="community-msg-comment-meta">
                    <span className="community-msg-comment-author">
                      {getDisplayName(comment.username)}
                    </span>
                    <time
                      className="community-msg-comment-time"
                      dateTime={comment.createdAt}
                      title={comment.createdAt ? new Date(comment.createdAt).toLocaleString() : undefined}
                    >
                      {formatMessageTime(comment.createdAt)}
                    </time>
                  </div>
                  <p className="community-msg-comment-body">{sanitizeText(comment.content)}</p>
                </div>
              ))
            )}

            <div className="community-msg-comment-form">
              <input
                type="text"
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder={COMMUNITY_UI.messages.addCommentPlaceholder}
                aria-label={COMMUNITY_UI.messages.addCommentPlaceholder}
                maxLength={300}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSubmitComment}
                disabled={!commentDraft.trim()}
                aria-label={COMMUNITY_UI.messages.sendCommentAria}
              >
                <FiSend size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default CommunityMessage;
