import React, { useEffect, useMemo, useState } from 'react';
import { FiImage, FiLink, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import { getCommunityMessages, getCommunityOverview } from './community.service';
import { getPublicErrorMessage } from '../../shared/utils/errors/publicError';
import '@styles/features/community/index.css';

const extractLinks = (text = '') => {
  const results = [];
  const regex = /(https?:\/\/[^\s]+)/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push(match[0]);
  }
  return results;
};

const normalizeRoomId = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return 'general';
  return raw.startsWith('#') ? raw.slice(1) : raw;
};

const CommunityMedia = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState('general');
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const role = useMemo(() => {
    if (user?.role === 'client' || user?.role === 'admin') return 'corporate';
    return user?.role || 'student';
  }, [user?.role]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      const overviewRes = await getCommunityOverview(role, 'popular');
      if (!mounted) return;
      if (overviewRes.success) {
        const list = overviewRes.data?.channels || [];
        const normalized = list
          .map((item) => ({
            id: normalizeRoomId(item.id || item.name),
            name: item.name || normalizeRoomId(item.id || item.name)
          }))
          .filter((item) => item.id);
        setChannels(normalized);
        if (normalized.length && !normalized.some((item) => item.id === room)) {
          setRoom(normalized[0].id);
        }
      } else {
        setError(getPublicErrorMessage({ action: 'load', response: overviewRes }));
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, [role]);

  useEffect(() => {
    let mounted = true;
    const loadMessages = async () => {
      setLoading(true);
      setError('');
      const response = await getCommunityMessages(room, 80);
      if (!mounted) return;
      if (response.success) {
        setMessages(response.data?.messages || []);
      } else {
        setError(getPublicErrorMessage({ action: 'load', response }));
      }
      setLoading(false);
    };
    loadMessages();
    return () => { mounted = false; };
  }, [room]);

  const images = useMemo(() => {
    return (messages || [])
      .filter((msg) => msg.imageUrl)
      .map((msg) => ({
        id: msg.id,
        url: msg.imageUrl,
        room: msg.room,
        message: msg.content || 'Shared image',
      }));
  }, [messages]);

  const links = useMemo(() => {
    return (messages || [])
      .flatMap((msg) =>
        extractLinks(msg.content || '').map((link) => ({
          id: `${msg.id}-${link}`,
          url: link,
          room: msg.room,
          message: msg.content || 'Shared link',
          messageId: msg.id,
        }))
      );
  }, [messages]);

  const handleOpenMessage = (messageId, targetRoom) => {
    const params = new URLSearchParams({ room: targetRoom || room, messageId });
    navigate(`/community?${params.toString()}`);
  };

  return (
    <div className="cmd-page">
      <header className="cmd-page-header">
        <div className="cmd-page-header-inner">
          <div className="cmd-header-left">
            <div className="cmd-header-icon-wrap">
              <FiImage size={20} className="cmd-header-icon" />
            </div>
            <div>
              <div className="cmd-header-breadcrumb">
                <span className="cmd-breadcrumb-org">HSOCIETY</span>
                <span className="cmd-breadcrumb-sep">/</span>
                <span className="cmd-breadcrumb-page">community-media</span>
                <span className="cmd-header-visibility">Private</span>
              </div>
              <p className="cmd-header-desc">Collected images and links shared in community channels.</p>
            </div>
          </div>
        </div>
        <div className="cmd-header-meta">
          <span className="cmd-meta-pill">
            <FiImage size={13} className="cmd-meta-icon" />
            <span className="cmd-meta-label">Images</span>
            <strong className="cmd-meta-value">{images.length}</strong>
          </span>
          <span className="cmd-meta-pill">
            <FiLink size={13} className="cmd-meta-icon" />
            <span className="cmd-meta-label">Links</span>
            <strong className="cmd-meta-value">{links.length}</strong>
          </span>
        </div>
      </header>

      <div className="cmd-layout">
        <main className="cmd-main">
          <section className="cmd-section">
            <div className="cmd-filter-row">
              <label className="cmd-filter-label">
                Channel
                <select
                  className="cmd-select"
                  value={room}
                  onChange={(e) => setRoom(normalizeRoomId(e.target.value))}
                >
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      #{channel.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <h2 className="cmd-section-title">Images</h2>
            <p className="cmd-section-desc">Images shared in the selected channel.</p>
            <div className="cmd-item-list">
              {loading && <div className="cmd-empty">Loading media...</div>}
              {!loading && error && <div className="cmd-empty">{error}</div>}
              {!loading && !error && images.length === 0 && (
                <div className="cmd-empty">No images shared yet.</div>
              )}
              {!loading && !error && images.map((item) => (
                <article key={item.id} className="cmd-item-row">
                  <div className="cmd-item-main">
                    <img src={item.url} alt="Shared" className="cmd-image" loading="lazy" />
                    <div>
                      <span className="cmd-item-title">Shared image</span>
                      <span className="cmd-item-subtitle">#{item.room || room}</span>
                    </div>
                  </div>
                  <div className="cmd-item-meta">
                    <button
                      type="button"
                      className="cmd-btn cmd-btn-secondary"
                      onClick={() => handleOpenMessage(item.id, item.room || room)}
                    >
                      Open message
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="cmd-divider" />

          <section className="cmd-section">
            <h2 className="cmd-section-title">Links</h2>
            <p className="cmd-section-desc">Links shared in the selected channel.</p>
            <div className="cmd-item-list">
              {loading && <div className="cmd-empty">Loading links...</div>}
              {!loading && !error && links.length === 0 && (
                <div className="cmd-empty">No links shared yet.</div>
              )}
              {!loading && !error && links.map((item) => (
                <article key={item.id} className="cmd-item-row">
                  <div className="cmd-item-main">
                    <span className="cmd-item-title">{item.url}</span>
                    <span className="cmd-item-subtitle">#{item.room || room}</span>
                  </div>
                  <div className="cmd-item-meta">
                    <button
                      type="button"
                      className="cmd-btn cmd-btn-secondary"
                      onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                    >
                      Open link
                    </button>
                    <button
                      type="button"
                      className="cmd-btn cmd-btn-secondary"
                      onClick={() => handleOpenMessage(item.messageId, item.room || room)}
                    >
                      <FiMessageSquare size={14} />
                      View message
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CommunityMedia;
