import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiImage, FiSend, FiSmile, FiX } from 'react-icons/fi';
import { uploadCommunityImage } from '../../community.service';
import { getDisplayName, getUserAvatar } from '../../utils/community.utils';

const MAX = 1000;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const EMOJIS = ['🔥', '🚀', '✅', '⚡', '🧠', '🎯', '🛡️', '🧪', '💡', '🛰️', '📡', '🌍', '💬', '👏', '😂', '🙌', '😮', '😎', '🤝', '❤️'];

const CommunityCompose = ({
  user,
  room,
  draft,
  onDraftChange,
  onSend,
  imageUrl,
  onImageChange,
  imageError,
  onImageError,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const emojiRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const charsLeft = MAX - draft.length;
  const nearLimit = charsLeft < 80;
  const canSend = Boolean(draft.trim() || imageUrl);
  const roomLabel = room?.startsWith('#') ? room.slice(1) : room || 'general';

  useEffect(() => {
    if (!emojiOpen) return undefined;
    const handleClick = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [emojiOpen]);

  const handlePickImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onImageError?.('Please select an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      onImageError?.('Image is too large. Use a file under 2 MB.');
      event.target.value = '';
      return;
    }

    try {
      setUploading(true);
      onImageError?.('');
      const response = await uploadCommunityImage(file);
      if (!response.success || !response.data?.url) {
        onImageError?.(response.error || 'Failed to upload image.');
        return;
      }
      onImageChange?.(response.data.url);
    } catch (_err) {
      onImageError?.('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
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
            disabled={uploading}
          >
            <FiImage size={16} />
          </button>
          <div className="community-emoji" ref={emojiRef}>
            <button
              type="button"
              className={`community-emoji-btn ${emojiOpen ? 'active' : ''}`}
              onClick={() => setEmojiOpen((prev) => !prev)}
              aria-label="Insert emoji"
              aria-expanded={emojiOpen}
            >
              <FiSmile size={16} />
            </button>
            {emojiOpen && (
              <div className="community-emoji-panel" role="listbox" aria-label="Emoji picker">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="community-emoji-item"
                    onClick={() => {
                      onDraftChange(`${draft}${emoji}`);
                      setEmojiOpen(false);
                    }}
                    aria-label={`Insert ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
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
            disabled={!canSend || uploading}
            aria-label="Send message"
          >
            <FiSend size={15} />
          </button>
        </div>

        {imageUrl && (
          <div className="community-compose-attachment" role="group" aria-label="Image attachment">
            <img src={imageUrl} alt="Attachment preview" />
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

        {uploading && <p className="community-compose-status">Uploading image…</p>}
        {imageError && <p className="community-compose-error">{imageError}</p>}
      </div>
    </div>
  );
};

export default CommunityCompose;
