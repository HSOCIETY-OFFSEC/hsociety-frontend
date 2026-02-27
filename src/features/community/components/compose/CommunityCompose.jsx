import React from 'react';
import { FiSend } from 'react-icons/fi';
import { getDisplayName, getUserAvatar } from '../../utils/community.utils';

const CommunityCompose = ({ user, room, draft, onDraftChange, onSend }) => {
  return (
    <div className="community-compose" role="form" aria-label="Send a message">
      <div className="community-compose-avatar" aria-hidden="true">
        <img
          src={getUserAvatar(user)}
          alt={`${getDisplayName(user?.name || user?.username)} avatar`}
          onError={(e) => {
            e.currentTarget.src = getUserAvatar({
              name: user?.name,
              username: user?.username,
              email: user?.email
            });
          }}
        />
      </div>
      <div className="community-compose-inner">
        <input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder={`Message #${room}`}
          aria-label={`Message #${room}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          maxLength={1000}
        />
        <button
          type="button"
          className="community-send-btn"
          onClick={onSend}
          disabled={!draft.trim()}
          aria-label="Send message"
        >
          <FiSend size={15} />
        </button>
      </div>
    </div>
  );
};

export default CommunityCompose;
