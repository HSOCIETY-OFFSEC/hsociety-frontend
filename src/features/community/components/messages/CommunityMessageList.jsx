import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import CommunityMessage from './CommunityMessage';

const CommunityMessageList = ({
  messages,
  loading,
  error,
  isOwn,
  containerRef,
  onLike,
  onAddComment,
  currentUserId,
}) => {
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
          <p>Loading messages…</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="community-msg-state">
          <FiMessageSquare size={28} />
          <p>No messages yet. Say hello!</p>
        </div>
      ) : (
        (() => {
          const pinned = messages.filter((msg) => msg.pinned);
          const normal = messages.filter((msg) => !msg.pinned);

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
                  currentUserId={currentUserId}
                />
              );
            });

          return (
            <>
              {pinned.length > 0 && (
                <div className="community-pinned">
                  <div className="community-pinned-header">Pinned</div>
                  {renderList(pinned)}
                </div>
              )}
              {renderList(normal)}
            </>
          );
        })()
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
