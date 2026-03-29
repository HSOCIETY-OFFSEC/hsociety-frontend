import React, { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiImage, FiLink, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { getCommunityMessages, getCommunityOverview } from '../services/community.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';

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
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-bg-secondary">
              <FiImage size={20} className="text-brand" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary">
                <span className="font-semibold text-text-secondary">HSOCIETY</span>
                <span>/</span>
                <span className="font-semibold text-text-secondary">community-media</span>
                <span className="rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold text-text-secondary">
                  Private
                </span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">
                Collected images and links shared in community channels.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-tertiary"
            onClick={() => navigate('/community')}
          >
            <FiArrowLeft size={14} />
            Back to Community
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
            <FiImage size={13} className="text-text-tertiary" />
            <span>Images</span>
            <strong className="text-text-primary">{images.length}</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
            <FiLink size={13} className="text-text-tertiary" />
            <span>Links</span>
            <strong className="text-text-primary">{links.length}</strong>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <main className="min-w-0">
          <section className="py-4">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                Channel
                <select
                  className="rounded-md border border-border bg-bg-secondary px-2 py-1 text-sm text-text-primary"
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

            <h2 className="text-base font-semibold text-text-primary">Images</h2>
            <p className="mt-1 text-sm text-text-secondary">Images shared in the selected channel.</p>
            <div className="mt-4 overflow-hidden rounded-sm border border-border">
              {loading && <div className="bg-bg-secondary px-4 py-4 text-sm text-text-tertiary">Loading media...</div>}
              {!loading && error && <div className="bg-bg-secondary px-4 py-4 text-sm text-status-danger">{error}</div>}
              {!loading && !error && images.length === 0 && (
                <div className="bg-bg-secondary px-4 py-4 text-sm text-text-tertiary">No images shared yet.</div>
              )}
              {!loading && !error && images.map((item) => (
                <article key={item.id} className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <img src={item.url} alt="Shared" className="h-12 w-12 rounded-md object-cover" loading="lazy" />
                    <div>
                      <span className="block text-sm font-semibold text-text-primary">Shared image</span>
                      <span className="text-xs text-text-secondary">#{item.room || room}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-tertiary"
                      onClick={() => handleOpenMessage(item.id, item.room || room)}
                    >
                      Open message
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="my-6 h-px bg-border" />

          <section className="py-4">
            <h2 className="text-base font-semibold text-text-primary">Links</h2>
            <p className="mt-1 text-sm text-text-secondary">Links shared in the selected channel.</p>
            <div className="mt-4 overflow-hidden rounded-sm border border-border">
              {loading && <div className="bg-bg-secondary px-4 py-4 text-sm text-text-tertiary">Loading links...</div>}
              {!loading && !error && links.length === 0 && (
                <div className="bg-bg-secondary px-4 py-4 text-sm text-text-tertiary">No links shared yet.</div>
              )}
              {!loading && !error && links.map((item) => (
                <article key={item.id} className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="block text-sm font-semibold text-text-primary">{item.url}</span>
                    <span className="text-xs text-text-secondary">#{item.room || room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-tertiary"
                      onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                    >
                      Open link
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-tertiary"
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
