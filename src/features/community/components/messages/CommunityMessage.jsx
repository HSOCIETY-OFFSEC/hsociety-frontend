import React from 'react';
import { getDisplayName, getMessageAvatar, formatMessageTime } from '../../utils/community.utils';

const CommunityMessage = ({ message, grouped, own }) => {
  const authorName = getDisplayName(message?.username || message?.user?.name || message?.user?.username);
  const avatarSrc = getMessageAvatar(message);

  return (
    <article
      className={`community-message ${own ? 'own' : ''} ${grouped ? 'grouped' : ''}`}
    >
      {!grouped ? (
        <div className="community-msg-avatar" aria-hidden="true">
          <img
            src={avatarSrc}
            alt={`${authorName} avatar`}
            onError={(e) => {
              e.currentTarget.src = getMessageAvatar({ username: authorName });
            }}
          />
        </div>
      ) : (
        <div className="community-msg-avatar-spacer" aria-hidden="true" />
      )}

      <div className="community-msg-body">
        {!grouped && (
          <div className="community-msg-meta">
            <span className="community-msg-author">{authorName}</span>
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
          <p>{message?.content}</p>
        </div>
      </div>
    </article>
  );
};

export default CommunityMessage;
