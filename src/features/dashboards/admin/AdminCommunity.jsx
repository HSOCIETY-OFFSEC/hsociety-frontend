import React, { useEffect, useState } from 'react';
import { FiBookmark, FiMessageSquare, FiSave, FiTrash2 } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import PageLoader from '../../../shared/components/ui/PageLoader';
import {
  getCommunityConfig,
  updateCommunityConfig,
  getAdminCommunityMessages,
  updateAdminCommunityMessage,
  deleteAdminCommunityMessage,
  getAdminCommunityPosts,
  updateAdminCommunityPost,
  deleteAdminCommunityPost
} from './admin.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import PublicError from '../../../shared/components/ui/PublicError';
import './index.css';

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
    <div className="ad-page">
      <header className="ad-page-header">
        <div className="ad-page-header-inner">
          <div className="ad-header-left">
            <div className="ad-header-icon-wrap">
              <FiMessageSquare size={20} className="ad-header-icon" />
            </div>
            <div>
              <div className="ad-header-breadcrumb">
                <span className="ad-breadcrumb-org">HSOCIETY</span>
                <span className="ad-breadcrumb-sep">/</span>
                <span className="ad-breadcrumb-page">community</span>
                <span className="ad-header-visibility">Admin</span>
              </div>
              <p className="ad-header-desc">Configure channels, tags, stats, and moderate messages and posts.</p>
            </div>
          </div>
          <div className="ad-header-actions">
            <button type="button" className="ad-btn ad-btn-primary" onClick={handleSave} disabled={saving}>
              <FiSave size={14} /> {saving ? 'Saving...' : 'Save Config'}
            </button>
          </div>
        </div>
        <div className="ad-header-meta">
          <span className="ad-meta-pill">
            <span className="ad-meta-label">Messages</span>
            <strong className="ad-meta-value">{messages.length}</strong>
          </span>
          <span className="ad-meta-pill">
            <span className="ad-meta-label">Posts</span>
            <strong className="ad-meta-value">{posts.length}</strong>
          </span>
        </div>
      </header>

      <div className="ad-layout">
        <main className="ad-main">
          <PublicError message={error} className="admin-alert" />

          <section className="ad-section">
            <h2 className="ad-section-title">
              <FiMessageSquare size={15} className="ad-section-icon" />
              Channels
            </h2>
            <p className="ad-section-desc">One per line. Format: <code>id|Name</code></p>
            <textarea
              className="admin-textarea"
              rows={6}
              value={form.channels}
              onChange={(e) => setForm((prev) => ({ ...prev, channels: e.target.value }))}
            />
          </section>

          <div className="ad-divider" />

          <section className="ad-section">
            <h2 className="ad-section-title">Tags</h2>
            <p className="ad-section-desc">One per line or comma-separated.</p>
            <textarea
              className="admin-textarea"
              rows={4}
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
            />
          </section>

          <div className="ad-divider" />

          <section className="ad-section">
            <h2 className="ad-section-title">Community Stats</h2>
            <p className="ad-section-desc">Optional manual overrides for display stats.</p>
            <div className="admin-stats-form">
              {['learners', 'questions', 'answered'].map((key) => (
                <label key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <input
                    className="admin-input"
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

          <div className="ad-divider" />

          <section className="ad-section">
            <h2 className="ad-section-title">
              <FiBookmark size={15} className="ad-section-icon" />
              Moderation
            </h2>
            <p className="ad-section-desc">Pin or remove messages and posts.</p>

            {moderationLoading ? (
              <PageLoader message="Loading moderation data..." durationMs={0} />
            ) : (
              <>
                <h3 className="ad-subsection-title">Messages</h3>
                <div className="ad-list">
                  <div className="ad-list-header ad-list-row-moderation">
                    <span>Message</span>
                    <span>Room</span>
                    <span>User</span>
                    <span>Pinned</span>
                    <span>Actions</span>
                  </div>
                  {messages.slice(0, 25).map((message) => (
                    <div key={message._id} className="ad-list-row ad-list-row-moderation">
                      <span className="admin-truncate">{message.content || '[image]'}</span>
                      <span>{message.room}</span>
                      <span>{message.username}</span>
                      <span>{message.pinned ? 'Yes' : 'No'}</span>
                      <div className="admin-actions">
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
                  {messages.length === 0 && <div className="ad-list-empty">No messages.</div>}
                </div>

                <h3 className="ad-subsection-title" style={{ marginTop: '1.5rem' }}>Posts</h3>
                <div className="ad-list">
                  <div className="ad-list-header ad-list-row-moderation-posts">
                    <span>Post</span>
                    <span>Role</span>
                    <span>Pinned</span>
                    <span>Actions</span>
                  </div>
                  {posts.slice(0, 25).map((post) => (
                    <div key={post._id} className="ad-list-row ad-list-row-moderation-posts">
                      <span className="admin-truncate">{post.title || 'Untitled'}</span>
                      <span>{post.roleContext || post.authorRole || 'student'}</span>
                      <span>{post.pinned ? 'Yes' : 'No'}</span>
                      <div className="admin-actions">
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
                  {posts.length === 0 && <div className="ad-list-empty">No posts.</div>}
                </div>
              </>
            )}
          </section>
        </main>

        <aside className="ad-sidebar">
          <div className="ad-sidebar-box">
            <h3 className="ad-sidebar-heading">About</h3>
            <p className="ad-sidebar-about">
              Configure community channels, tags, and stats. Moderate messages and posts.
            </p>
            <div className="ad-sidebar-divider" />
            <ul className="ad-sidebar-list">
              <li><FiMessageSquare size={13} className="ad-sidebar-icon" />Channel config</li>
              <li><FiBookmark size={13} className="ad-sidebar-icon" />Pin / remove content</li>
            </ul>
          </div>
          <div className="ad-sidebar-box ad-status-box">
            <div className="ad-status-row">
              <span className="ad-status-dot" />
              <span className="ad-status-label">MODERATION</span>
            </div>
            <strong className="ad-status-value">{messages.length + posts.length > 0 ? 'ACTIVE' : 'CLEAR'}</strong>
            <div className="ad-status-track">
              <div className="ad-status-fill" style={{ width: '100%' }} />
            </div>
            <p className="ad-status-note">{messages.length} messages · {posts.length} posts loaded.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminCommunity;
