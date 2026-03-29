import React, { useEffect, useState } from 'react';
import { FiBookmark, FiMessageSquare, FiSave, FiTrash2 } from 'react-icons/fi';
import Button from '../../../../shared/components/ui/Button';
import PageLoader from '../../../../shared/components/ui/PageLoader';
import {
  getCommunityConfig,
  updateCommunityConfig,
  getAdminCommunityMessages,
  updateAdminCommunityMessage,
  deleteAdminCommunityMessage,
  getAdminCommunityPosts,
  updateAdminCommunityPost,
  deleteAdminCommunityPost
} from '../services/admin.service';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import PublicError from '../../../../shared/components/ui/PublicError';

const alertClassName =
  'flex items-center gap-3 rounded-sm border border-[color-mix(in_srgb,#ef4444_30%,var(--border-color))] bg-[color-mix(in_srgb,#ef4444_8%,var(--card-bg))] px-4 py-3 text-sm text-[color-mix(in_srgb,#ef4444_80%,var(--text-primary))]';

const inputClassName =
  'w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-[var(--input-bg-focus)] focus:outline-none';

const textareaClassName =
  'w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-bg-tertiary focus:outline-none';

const channelsToText = (channels = []) => channels.map((ch) => `${ch.id}|${ch.name}`).join('\n');
const textToChannels = (value) =>
  String(value || '').split('\n').map((l) => l.trim()).filter(Boolean)
    .map((l) => { const [id, name] = l.split('|').map((p) => p.trim()); return { id, name: name || id }; })
    .filter((ch) => ch.id && ch.name);
const tagsToText = (tags = []) => tags.join('\n');
const textToTags = (value) =>
  String(value || '').split(/\n|,/).map((t) => t.trim()).filter(Boolean);

const AdminCommunity = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [form, setForm] = useState({
    channels: '',
    tags: '',
    stats: { learners: 0, questions: 0, answered: 0 }
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      const response = await getCommunityConfig();
      if (!mounted) return;
      if (response.success) {
        const data = response.data || {};
        setForm({
          channels: channelsToText(data.channels || []),
          tags: tagsToText(data.tags || []),
          stats: {
            learners: Number(data.stats?.learners || 0),
            questions: Number(data.stats?.questions || 0),
            answered: Number(data.stats?.answered || 0)
          }
        });
      } else {
        setError(getPublicErrorMessage({ action: 'load', response }));
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const loadModeration = async () => {
      setModerationLoading(true);
      const [messagesRes, postsRes] = await Promise.all([
        getAdminCommunityMessages(),
        getAdminCommunityPosts()
      ]);
      if (messagesRes.success) setMessages(messagesRes.data || []);
      if (postsRes.success) setPosts(postsRes.data || []);
      if (!messagesRes.success || !postsRes.success) {
        setError(messagesRes.error || postsRes.error || 'Failed to load moderation data');
      }
      setModerationLoading(false);
    };
    loadModeration();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const payload = {
      channels: textToChannels(form.channels),
      tags: textToTags(form.tags),
      stats: form.stats
    };
    const response = await updateCommunityConfig(payload);
    if (!response.success) setError(getPublicErrorMessage({ action: 'save', response }));
    setSaving(false);
  };

  if (loading) return <PageLoader message="Loading community config..." durationMs={0} />;

  return (
    <div className="min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1.25rem,3vw,2rem)] pb-16 text-text-primary">
      <header className="mb-6 flex flex-col gap-3 border-b border-border pb-5">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border bg-bg-secondary">
              <FiMessageSquare size={20} className="text-brand" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary">
                <span className="font-semibold text-text-secondary">HSOCIETY</span>
                <span className="text-text-tertiary">/</span>
                <span className="font-semibold text-text-secondary">community</span>
                <span className="rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold text-text-secondary">
                  Admin
                </span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">Configure channels, tags, stats, and moderate messages and posts.</p>
            </div>
          </div>
          <Button type="button" variant="primary" size="small" onClick={handleSave} disabled={saving}>
            <FiSave size={14} /> {saving ? 'Saving...' : 'Save Config'}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2.5 py-1 text-xs text-text-secondary">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Messages</span>
            <strong className="font-semibold text-text-primary">{messages.length}</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2.5 py-1 text-xs text-text-secondary">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Posts</span>
            <strong className="font-semibold text-text-primary">{posts.length}</strong>
          </span>
        </div>
      </header>

      <div className="grid gap-6">
        <main className="min-w-0">
          <PublicError message={error} className={`${alertClassName} mb-4`} />

          <section className="py-5">
            <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-text-primary">
              <FiMessageSquare size={15} className="text-text-tertiary" />
              Channels
            </h2>
            <p className="mb-4 text-sm text-text-secondary">One per line. Format: <code>id|Name</code></p>
            <textarea
              className={textareaClassName}
              rows={6}
              value={form.channels}
              onChange={(e) => setForm((prev) => ({ ...prev, channels: e.target.value }))}
            />
          </section>

          <div className="h-px bg-border" />

          <section className="py-5">
            <h2 className="mb-1 text-base font-semibold text-text-primary">Tags</h2>
            <p className="mb-4 text-sm text-text-secondary">One per line or comma-separated.</p>
            <textarea
              className={textareaClassName}
              rows={4}
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
            />
          </section>

          <div className="h-px bg-border" />

          <section className="py-5">
            <h2 className="mb-1 text-base font-semibold text-text-primary">Community Stats</h2>
            <p className="mb-4 text-sm text-text-secondary">Optional manual overrides for display stats.</p>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
              {['learners', 'questions', 'answered'].map((key) => (
                <label key={key} className="flex flex-col gap-2 text-sm text-text-secondary">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <input
                    className={inputClassName}
                    type="number"
                    min="0"
                    value={form.stats[key]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        stats: { ...prev.stats, [key]: Number(e.target.value || 0) }
                      }))
                    }
                  />
                </label>
              ))}
            </div>
          </section>

          <div className="h-px bg-border" />

          <section className="py-5">
            <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-text-primary">
              <FiBookmark size={15} className="text-text-tertiary" />
              Moderation
            </h2>
            <p className="mb-4 text-sm text-text-secondary">Pin or remove messages and posts.</p>

            {moderationLoading ? (
              <PageLoader message="Loading moderation data..." durationMs={0} />
            ) : (
              <>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-text-secondary">Messages</h3>
                <div className="overflow-x-auto rounded-sm border border-border">
                  <div className="grid min-w-[560px] grid-cols-[2fr_0.8fr_0.9fr_0.6fr_1.4fr] items-center gap-3 border-b border-border bg-bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                    <span>Message</span>
                    <span>Room</span>
                    <span>User</span>
                    <span>Pinned</span>
                    <span>Actions</span>
                  </div>
                  {messages.slice(0, 25).map((message) => (
                    <div
                      key={message._id}
                      className="grid min-w-[560px] grid-cols-[2fr_0.8fr_0.9fr_0.6fr_1.4fr] items-center gap-3 border-b border-border bg-bg-primary px-4 py-3 text-sm transition-colors hover:bg-bg-secondary"
                    >
                      <span className="truncate">{message.content || '[image]'}</span>
                      <span>{message.room}</span>
                      <span>{message.username}</span>
                      <span>{message.pinned ? 'Yes' : 'No'}</span>
                      <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 [&>*]:flex-1 sm:w-auto sm:[&>*]:flex-none">
                        <Button size="small" variant="ghost" onClick={async () => {
                          const res = await updateAdminCommunityMessage(message._id, { pinned: !message.pinned });
                          if (res.success) setMessages((prev) => prev.map((m) => m._id === message._id ? res.data : m));
                        }}>
                          <FiBookmark size={14} /> {message.pinned ? 'Unpin' : 'Pin'}
                        </Button>
                        <Button size="small" variant="ghost" onClick={async () => {
                          if (!window.confirm('Delete this message?')) return;
                          const res = await deleteAdminCommunityMessage(message._id);
                          if (res.success) setMessages((prev) => prev.filter((m) => m._id !== message._id));
                        }}>
                          <FiTrash2 size={14} /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="bg-bg-primary px-4 py-6 text-center text-sm text-text-tertiary">No messages.</div>
                  )}
                </div>

                <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-widest text-text-secondary">Posts</h3>
                <div className="overflow-x-auto rounded-sm border border-border">
                  <div className="grid min-w-[480px] grid-cols-[2fr_0.9fr_0.6fr_1.4fr] items-center gap-3 border-b border-border bg-bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                    <span>Post</span>
                    <span>Role</span>
                    <span>Pinned</span>
                    <span>Actions</span>
                  </div>
                  {posts.slice(0, 25).map((post) => (
                    <div
                      key={post._id}
                      className="grid min-w-[480px] grid-cols-[2fr_0.9fr_0.6fr_1.4fr] items-center gap-3 border-b border-border bg-bg-primary px-4 py-3 text-sm transition-colors hover:bg-bg-secondary"
                    >
                      <span className="truncate">{post.title || 'Untitled'}</span>
                      <span>{post.roleContext || post.authorRole || 'student'}</span>
                      <span>{post.pinned ? 'Yes' : 'No'}</span>
                      <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 [&>*]:flex-1 sm:w-auto sm:[&>*]:flex-none">
                        <Button size="small" variant="ghost" onClick={async () => {
                          const res = await updateAdminCommunityPost(post._id, { pinned: !post.pinned });
                          if (res.success) setPosts((prev) => prev.map((p) => p._id === post._id ? res.data : p));
                        }}>
                          <FiBookmark size={14} /> {post.pinned ? 'Unpin' : 'Pin'}
                        </Button>
                        <Button size="small" variant="ghost" onClick={async () => {
                          if (!window.confirm('Delete this post?')) return;
                          const res = await deleteAdminCommunityPost(post._id);
                          if (res.success) setPosts((prev) => prev.filter((p) => p._id !== post._id));
                        }}>
                          <FiTrash2 size={14} /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="bg-bg-primary px-4 py-6 text-center text-sm text-text-tertiary">No posts.</div>
                  )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminCommunity;
