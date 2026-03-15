import { useEffect, useRef, useState } from 'react';
import { FiHeart, FiMessageSquare, FiSend, FiRepeat, FiBookmark, FiSmile } from 'react-icons/fi';
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
  const profileTarget = message?.hackerHandle || message?.user?.hackerHandle || message?.username || message?.user?.username || '';
  const reactions = message?.reactions || {};
  const reactionPool = [...new Set([...(reactionEmojis || []), ...Object.keys(reactions || {})])];
  const userReactionCount = Object.values(reactions).filter(
    (entry) => currentUserId && Array.isArray(entry.users) && entry.users.includes(currentUserId)
  ).length;
  const [supportsHover, setSupportsHover] = useState(false);
  const hoverCloseTimer = useRef(null);
  const HOVER_CLOSE_DELAY_MS = 220;

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
    return () => {
      if (hoverCloseTimer.current) {
        clearTimeout(hoverCloseTimer.current);
      }
    };
  }, []);

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
      if (!liked) onLike?.(message.id);
    }
    setLastTap(now);
  };

  const handleOpenProfile = () => {
    const handleValue = profileTarget
      || message?.user?.hackerHandle
      || message?.user?.username
      || message?.username
      || '';
    const normalized = String(handleValue).trim().replace(/^@/, '');
    if (!normalized) return;
    navigate(`/@${encodeURIComponent(normalized)}`);
  };

  const handleSubmitComment = () => {
    const content = commentDraft.trim();
    if (!content) return;
    onAddComment?.(message.id, content);
    setCommentDraft('');
  };

  return (
    <article
      className={`community-post ${own ? 'own' : ''} ${grouped ? 'grouped' : ''}`}
    >
      {/* Avatar column — always visible (X/Twitter style, not hidden in grouped) */}
      <div className="community-post-avatar-col">
        {!grouped ? (
          <button
            type="button"
            className="community-post-avatar-btn"
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
          /* Thin thread line for grouped messages */
          <div className="community-post-thread-line" aria-hidden="true" />
        )}
      </div>

      {/* Content column */}
      <div className="community-post-content">

        {/* Post header: author + handle + time + role badge */}
        {!grouped && (
          <div className="community-post-header">
            <button
              type="button"
              className="community-post-author"
              onClick={handleOpenProfile}
              aria-label={`Open ${authorName} profile`}
            >
              {authorName}
            </button>
            {message?.hackerHandle && (
              <span className="community-post-handle">@{message.hackerHandle}</span>
            )}
            {message?.userRole && (
              <span className="community-post-role-badge">{message.userRole}</span>
            )}
            {message?.pinned && (
              <span className="community-post-pin-badge">{COMMUNITY_UI.messages.pinnedTitle}</span>
            )}
            <time
              className="community-post-time"
              dateTime={message?.createdAt}
              title={message?.createdAt ? new Date(message.createdAt).toLocaleString() : undefined}
            >
              · {formatMessageTime(message?.createdAt)}
            </time>
          </div>
        )}

        {/* Post body */}
        <div className="community-post-body" onTouchEnd={handleDoubleTap}>
          {message?.content && (
            <p className="community-post-text">{sanitizeText(message.content)}</p>
          )}
          {message?.imageUrl && (
            <img
              className="community-post-image"
              src={message.imageUrl}
              alt="Shared attachment"
              loading="lazy"
            />
          )}
        </div>

        {/* Action bar — X/Twitter style icon row */}
        <div className="community-post-actions">
          <button
            type="button"
            className="community-post-action-btn"
            onClick={() => setCommentOpen((prev) => !prev)}
            aria-expanded={commentOpen}
            aria-label="Toggle comments"
          >
            <FiMessageSquare size={15} />
            {comments.length > 0 && <span>{comments.length}</span>}
          </button>

          {/* Re-share placeholder (visual only for now) */}
          <button
            type="button"
            className="community-post-action-btn repost"
            aria-label="Repost"
            disabled
          >
            <FiRepeat size={15} />
          </button>

          <button
            type="button"
            className={`community-post-action-btn like ${liked ? 'active' : ''}`}
            onClick={() => onLike?.(message.id)}
            aria-pressed={liked}
            aria-label={liked ? 'Unlike message' : 'Like message'}
          >
            <FiHeart size={15} />
            {likes > 0 && <span>{likes}</span>}
          </button>

          <div
            className="community-post-reaction-picker"
            ref={reactionRef}
            onMouseEnter={() => { if (supportsHover) { if (hoverCloseTimer.current) { clearTimeout(hoverCloseTimer.current); hoverCloseTimer.current = null; } setReactionOpen(true); } }}
            onMouseLeave={() => {
              if (!supportsHover) return;
              if (hoverCloseTimer.current) {
                clearTimeout(hoverCloseTimer.current);
              }
              hoverCloseTimer.current = window.setTimeout(() => {
                setReactionOpen(false);
                hoverCloseTimer.current = null;
              }, HOVER_CLOSE_DELAY_MS);
            }}
          >
            <button
              type="button"
              className={`community-post-action-btn react ${reactionOpen ? 'active' : ''}`}
              onClick={() => {
                if (hoverCloseTimer.current) {
                  clearTimeout(hoverCloseTimer.current);
                  hoverCloseTimer.current = null;
                }
                if (reactionOpen) {
                  setReactionOpen(false);
                  return;
                }
                setReactionOpen(true);
              }}
              onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); setReactionOpen(false); } }}
              aria-label={COMMUNITY_UI.reactions.moreLabel}
              aria-expanded={reactionOpen}
            >
              <FiSmile size={15} />
            </button>
            {reactionOpen && (
              <div
                className="community-post-reaction-panel"
                role="listbox"
                aria-label={COMMUNITY_UI.reactions.panelLabel}
                onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); setReactionOpen(false); } }}
              >
                {reactionPool.map((emoji) => {
                  const data = reactions[emoji] || { count: 0, users: [] };
                  const reacted =
                    currentUserId && Array.isArray(data.users) && data.users.includes(currentUserId);
                  const blocked = !reacted && userReactionCount >= reactionLimit;
                  return (
                    <button
                      key={emoji}
                      type="button"
                      className="community-post-reaction-panel-item"
                      onClick={() => {
                        if (blocked) return;
                        onReact?.(message.id, emoji);
                        setReactionOpen(false);
                      }}
                      disabled={blocked}
                      aria-label={`React with ${emoji}`}
                    >
                      <span>{emoji}</span>
                      {data.count > 0 && (
                        <span className="community-post-reaction-count">{data.count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            className="community-post-action-btn bookmark"
            aria-label="Bookmark"
            disabled
          >
            <FiBookmark size={15} />
          </button>
        </div>

        {/* Comments thread */}
        {commentOpen && (
          <div className="community-post-comments" role="region" aria-label="Comments">
            {comments.length === 0 ? (
              <p className="community-post-no-comments">{COMMUNITY_UI.messages.noCommentsText}</p>
            ) : (
              comments.map((comment) => (
                <div className="community-post-comment" key={comment.id || comment.createdAt}>
                  <div className="community-post-comment-meta">
                    <span className="community-post-comment-author">
                      {getDisplayName(comment.username)}
                    </span>
                    <time
                      className="community-post-comment-time"
                      dateTime={comment.createdAt}
                      title={comment.createdAt ? new Date(comment.createdAt).toLocaleString() : undefined}
                    >
                      · {formatMessageTime(comment.createdAt)}
                    </time>
                  </div>
                  <p className="community-post-comment-body">{sanitizeText(comment.content)}</p>
                </div>
              ))
            )}

            <div className="community-post-comment-compose">
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
                <FiSend size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default CommunityMessage;
