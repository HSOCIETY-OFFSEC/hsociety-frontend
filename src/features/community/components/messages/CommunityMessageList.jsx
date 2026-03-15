import React, { useEffect, useMemo, useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import CommunityMessage from './CommunityMessage';
import { COMMUNITY_UI } from '../../../../data/community/communityUiData';

const CommunityMessageList = ({
  messages,
  loading,
  error,
  isOwn,
  containerRef,
  onLike,
  onAddComment,
  onReact,
  reactionEmojis,
  reactionLimit,
  currentUserId,
  typingUsers = [],
}) => {
  const initialVisibleCount = Number(COMMUNITY_UI.messages.initialVisibleCount || 40);
  const loadMoreStep = Number(COMMUNITY_UI.messages.loadMoreStep || 40);
  const [visibleNormalCount, setVisibleNormalCount] = useState(initialVisibleCount);

  const pinnedMessages = useMemo(
    () => messages.filter((msg) => msg.pinned),
    [messages]
  );
  const normalMessages = useMemo(
    () => messages.filter((msg) => !msg.pinned),
    [messages]
  );

  useEffect(() => {
    setVisibleNormalCount((prev) => Math.min(normalMessages.length, Math.max(initialVisibleCount, prev)));
  }, [normalMessages.length, initialVisibleCount]);

  const visibleNormalMessages = useMemo(
    () => normalMessages.slice(-visibleNormalCount),
    [normalMessages, visibleNormalCount]
  );

  const hasOlderNormalMessages = normalMessages.length > visibleNormalCount;

  const renderList = (list) =>
    list.map((message, i) => {
      const own = isOwn(message);
      const prevMsg = list[i - 1];
      const grouped =
        prevMsg &&
        prevMsg.username === message.username &&
        new Date(message.createdAt) - new Date(prevMsg.createdAt) < 120000;

      return (
        <CommunityMessage
          key={message.id || `${message.username}-${message.createdAt}-${i}`}
          message={message}
          own={own}
          grouped={grouped}
          onLike={onLike}
          onAddComment={onAddComment}
          onReact={onReact}
          reactionEmojis={reactionEmojis}
          reactionLimit={reactionLimit}
          currentUserId={currentUserId}
        />
      );
    });

  return (
    <div
      className="community-messages"
      role="log"
      aria-live="polite"
      aria-label="Messages"
      ref={containerRef}
    >
      {loading ? (
        <div className="community-msg-state">
          <span className="community-loading-dots">
            <span /><span /><span />
          </span>
          <p>{COMMUNITY_UI.messages.loadingText}</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="community-msg-state">
          <FiMessageSquare size={28} />
          <p>{COMMUNITY_UI.messages.emptyText}</p>
        </div>
      ) : (
        <>
          {hasOlderNormalMessages && (
            <button
              type="button"
              className="community-load-older"
              onClick={() =>
                setVisibleNormalCount((prev) => Math.min(normalMessages.length, prev + loadMoreStep))
              }
            >
              {COMMUNITY_UI.messages.loadOlderText}
            </button>
          )}
          {pinnedMessages.length > 0 && (
            <div className="community-pinned">
              <div className="community-pinned-header">{COMMUNITY_UI.messages.pinnedTitle}</div>
              {renderList(pinnedMessages)}
            </div>
          )}
          {renderList(visibleNormalMessages)}
        </>
      )}

      {typingUsers.length > 0 && (
        <div className="community-typing" role="status" aria-live="polite">
          <span className="community-typing-label">
            {typingUsers.length === 1
              ? `${typingUsers[0].username} is typing`
              : `${typingUsers.length} people are typing`}
          </span>
          <span className="community-typing-dots" aria-hidden="true">
            <span /><span /><span />
          </span>
        </div>
      )}

      {error && (
        <div className="community-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default CommunityMessageList;
