import React, { useEffect, useMemo, useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import CommunityMessage from './CommunityMessage';
import { COMMUNITY_UI } from '../../../../data/static/community/communityUiData';
import Skeleton from '../../../../shared/components/ui/Skeleton';

const CommunityMessageList = ({
  messages,
  loading,
  error,
  isOwn,
  containerRef,
  onLike,
  onAddComment,
  onReact,
  onReport,
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
          onReport={onReport}
          reactionEmojis={reactionEmojis}
          reactionLimit={reactionLimit}
          currentUserId={currentUserId}
        />
      );
    });

  return (
    <div
      className="flex flex-col gap-4 px-5 py-4"
      role="log"
      aria-live="polite"
      aria-label="Messages"
      ref={containerRef}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-border bg-bg-secondary px-4 py-6 text-sm text-text-secondary">
          <div className="w-full" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="mb-3 flex items-start gap-3">
                <Skeleton variant="circle" className="h-10 w-10" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton variant="line" className="h-3 w-2/3" />
                  <Skeleton variant="line" className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
          <p>{COMMUNITY_UI.messages.loadingText}</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-border bg-bg-secondary px-4 py-6 text-sm text-text-secondary">
          <FiMessageSquare size={28} />
          <p>{COMMUNITY_UI.messages.emptyText}</p>
        </div>
      ) : (
        <>
          {hasOlderNormalMessages && (
            <button
              type="button"
              className="mx-auto rounded-full border border-border bg-bg-secondary px-4 py-2 text-xs font-semibold text-text-secondary transition hover:text-text-primary"
              onClick={() =>
                setVisibleNormalCount((prev) => Math.min(normalMessages.length, prev + loadMoreStep))
              }
            >
              {COMMUNITY_UI.messages.loadOlderText}
            </button>
          )}
          {pinnedMessages.length > 0 && (
            <div className="rounded-md border border-border bg-bg-secondary/60 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                {COMMUNITY_UI.messages.pinnedTitle}
              </div>
              {renderList(pinnedMessages)}
            </div>
          )}
          {renderList(visibleNormalMessages)}
        </>
      )}

      {typingUsers.length > 0 && (
        <div className="flex items-center gap-3 text-xs text-text-tertiary" role="status" aria-live="polite">
          <span>
            {typingUsers.length === 1
              ? `${typingUsers[0].username} is typing`
              : `${typingUsers.length} people are typing`}
          </span>
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 animate-cs-dot-pulse rounded-full bg-text-tertiary" />
            <span className="h-1.5 w-1.5 animate-cs-dot-pulse rounded-full bg-text-tertiary [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 animate-cs-dot-pulse rounded-full bg-text-tertiary [animation-delay:0.4s]" />
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-status-danger/30 bg-status-danger/10 px-3 py-2 text-sm text-status-danger" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default CommunityMessageList;
