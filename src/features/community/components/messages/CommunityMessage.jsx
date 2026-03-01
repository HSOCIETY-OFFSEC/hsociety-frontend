import React, { useState } from 'react';
import { FiHeart, FiMessageSquare, FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getDisplayName, getMessageAvatar, formatMessageTime } from '../../utils/community.utils';
import { sanitizeText } from '../../../../shared/utils/sanitize';

const CommunityMessage = ({
  message,
  grouped,
  own,
  onLike,
  onAddComment,
  currentUserId,
}) => {
  const authorName = getDisplayName(message?.username || message?.user?.name || message?.user?.username);
  const avatarSrc = getMessageAvatar(message);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const navigate = useNavigate();
  const likes = Number(message?.likes || 0);
  const comments = message?.comments || [];
  const liked = currentUserId ? message?.likedBy?.includes(currentUserId) : false;
  const profileTarget = message?.hackerHandle || message?.userId || '';

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
            {message?.pinned && <span className="community-msg-pin">Pinned</span>}
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
        <div className="community-msg-bubble">
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

        {commentOpen && (
          <div className="community-msg-comments" role="region" aria-label="Comments">
            {comments.length === 0 ? (
              <p className="community-msg-comment-empty">No comments yet.</p>
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
                placeholder="Add a comment"
                aria-label="Add a comment"
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
                aria-label="Send comment"
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
