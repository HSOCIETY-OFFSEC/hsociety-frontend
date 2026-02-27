import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import { getDisplayName, getUserAvatar } from '../../utils/community.utils';

const MAX = 1000;

const CommunityCompose = ({ user, room, draft, onDraftChange, onSend }) => {
  const navigate = useNavigate();
  const charsLeft = MAX - draft.length;
  const nearLimit = charsLeft < 80;

  return (
    <div className="community-compose" role="form" aria-label="Send a message">
      <button
        type="button"
        className="community-compose-avatar"
        onClick={() => navigate('/settings')}
        aria-label="Open account settings"
      >
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
      </button>

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
