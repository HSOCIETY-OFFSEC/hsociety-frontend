import React from 'react';
import { FiSend } from 'react-icons/fi';
import { getDisplayName, getUserAvatar } from '../../utils/community.utils';

const MAX = 1000;

const CommunityCompose = ({ user, room, draft, onDraftChange, onSend }) => {
  const charsLeft = MAX - draft.length;
  const nearLimit = charsLeft < 80;

  return (
    <div className="community-compose" role="form" aria-label="Send a message">
      <div className="community-compose-avatar" aria-hidden="true">
        <img
          src={getUserAvatar(user)}
          alt={getDisplayName(user?.name || user?.username)}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.setAttribute(
              'data-initials',
              (user?.name || user?.username || 'U')[0].toUpperCase()
            );
          }}
        />
      </div>

      <div className="community-compose-inner">
        <input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder={`Message #${room}`}
          aria-label={`Message #${room}`}
          maxLength={MAX}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />

        {nearLimit && draft.length > 0 && (
          <span
            className={`community-compose-counter ${charsLeft < 20 ? 'danger' : 'warn'}`}
          >
            {charsLeft}
          </span>
        )}

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