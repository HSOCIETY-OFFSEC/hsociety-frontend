import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiImage, FiSend, FiX } from 'react-icons/fi';
import { getDisplayName, getUserAvatar } from '../../utils/community.utils';

const MAX = 1000;
const MAX_IMAGE_BYTES = 200 * 1024;

const CommunityCompose = ({
  user,
  room,
  draft,
  onDraftChange,
  onSend,
  imageData,
  onImageChange,
  imageError,
  onImageError,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const charsLeft = MAX - draft.length;
  const nearLimit = charsLeft < 80;
  const canSend = Boolean(draft.trim() || imageData);
  const roomLabel = room?.startsWith('#') ? room.slice(1) : room || 'general';

  const handlePickImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onImageError?.('Please select an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      onImageError?.('Image is too large. Use a file under 200 KB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      onImageChange?.(result);
      onImageError?.('');
    };
    reader.onerror = () => {
      onImageError?.('Failed to read image. Please try another file.');
    };
    reader.readAsDataURL(file);
  };

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

      <div className="community-compose-stack">
        <div className="community-compose-inner">
          <button
            type="button"
            className="community-attach-btn"
            onClick={handlePickImage}
            aria-label="Attach an image"
          >
            <FiImage size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="community-attach-input"
            onChange={handleFileChange}
            aria-hidden="true"
            tabIndex={-1}
          />

          <input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder={`Message #${roomLabel}`}
            aria-label={`Message #${roomLabel}`}
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
            disabled={!canSend}
            aria-label="Send message"
          >
            <FiSend size={15} />
          </button>
        </div>

        {imageData && (
          <div className="community-compose-attachment" role="group" aria-label="Image attachment">
            <img src={imageData} alt="Attachment preview" />
            <button
              type="button"
              className="community-attachment-remove"
              onClick={() => {
                onImageChange?.('');
                onImageError?.('');
              }}
              aria-label="Remove image attachment"
            >
              <FiX size={14} />
            </button>
          </div>
        )}

        {imageError && <p className="community-compose-error">{imageError}</p>}
      </div>
    </div>
  );
};

export default CommunityCompose;
