import React, { useEffect, useState } from 'react';
import { FiPin, FiSave, FiTrash2 } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
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
import '../../../styles/dashboards/admin/index.css';

const channelsToText = (channels = []) =>
  channels.map((ch) => `${ch.id}|${ch.name}`).join('\n');

const textToChannels = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, name] = line.split('|').map((part) => part.trim());
      return { id, name: name || id };
    })
    .filter((ch) => ch.id && ch.name);

const tagsToText = (tags = []) => tags.join('\n');

const textToTags = (value) =>
  String(value || '')
    .split(/\n|,/)
    .map((tag) => tag.trim())
    .filter(Boolean);

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
        setError(response.error || 'Failed to load community config');
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

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

  useEffect(() => {
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
    if (!response.success) {
      setError(response.error || 'Failed to update community config');
    }
    setSaving(false);
  };

  if (loading) return <PageLoader message="Loading community config..." durationMs={0} />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-shell">
        <div className="admin-hero dashboard-shell-header">
          <div>
            <p className="admin-kicker dashboard-shell-kicker">COMMUNITY CONTROL</p>
            <h1 className="dashboard-shell-title">Manage Community</h1>
            <p className="admin-subtitle dashboard-shell-subtitle">
              Update channels, tags, and community stats.
            </p>
          </div>
        </div>

        {error && <div className="admin-alert">{error}</div>}

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Channels</h2>
            <p>One per line. Format: <code>id|Name</code></p>
          </div>
          <textarea
            className="admin-textarea"
            rows={6}
            value={form.channels}
            onChange={(e) => setForm((prev) => ({ ...prev, channels: e.target.value }))}
          />
        </Card>

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Tags</h2>
            <p>One per line or comma-separated.</p>
          </div>
          <textarea
            className="admin-textarea"
            rows={4}
            value={form.tags}
            onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
          />
        </Card>

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Community Stats</h2>
            <p>Optional manual overrides for display stats.</p>
          </div>
          <div className="admin-stats-form">
            <label>
              Learners
              <input
                className="admin-input"
                type="number"
                min="0"
                value={form.stats.learners}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    stats: { ...prev.stats, learners: Number(e.target.value || 0) }
                  }))
                }
              />
            </label>
            <label>
              Questions
              <input
                className="admin-input"
                type="number"
                min="0"
                value={form.stats.questions}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    stats: { ...prev.stats, questions: Number(e.target.value || 0) }
                  }))
                }
              />
            </label>
            <label>
              Answered
              <input
                className="admin-input"
                type="number"
                min="0"
                value={form.stats.answered}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    stats: { ...prev.stats, answered: Number(e.target.value || 0) }
                  }))
                }
              />
            </label>
          </div>
          <div className="admin-actions admin-actions-right">
            <Button variant="primary" size="small" onClick={handleSave} disabled={saving}>
              <FiSave size={14} />
              {saving ? 'Saving...' : 'Save Community Config'}
            </Button>
          </div>
        </Card>

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Community Moderation</h2>
            <p>Pin or remove messages and posts.</p>
          </div>
          {moderationLoading ? (
            <PageLoader message="Loading moderation data..." durationMs={0} />
          ) : (
            <>
              <div className="admin-table admin-table-compact">
                <div className="admin-row admin-row-header admin-row-moderation">
                  <span>Message</span>
                  <span>Room</span>
                  <span>User</span>
                  <span>Pinned</span>
                  <span>Actions</span>
                </div>
                {messages.slice(0, 25).map((message) => (
                  <div key={message._id} className="admin-row admin-row-moderation">
                    <span className="admin-truncate">{message.content || '[image]'}</span>
                    <span>{message.room}</span>
                    <span>{message.username}</span>
                    <span>{message.pinned ? 'Yes' : 'No'}</span>
                    <div className="admin-actions">
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={async () => {
                          const response = await updateAdminCommunityMessage(message._id, { pinned: !message.pinned });
                          if (response.success) {
                            setMessages((prev) =>
                              prev.map((item) => (item._id === message._id ? response.data : item))
                            );
                          }
                        }}
                      >
                        <FiPin size={14} />
                        {message.pinned ? 'Unpin' : 'Pin'}
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={async () => {
                          if (!window.confirm('Delete this message?')) return;
                          const response = await deleteAdminCommunityMessage(message._id);
                          if (response.success) {
                            setMessages((prev) => prev.filter((item) => item._id !== message._id));
                          }
                        }}
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-table admin-table-compact">
                <div className="admin-row admin-row-header admin-row-moderation">
                  <span>Post</span>
                  <span>Role</span>
                  <span>Pinned</span>
                  <span>Actions</span>
                </div>
                {posts.slice(0, 25).map((post) => (
                  <div key={post._id} className="admin-row admin-row-moderation">
                    <span className="admin-truncate">{post.title || 'Untitled'}</span>
                    <span>{post.roleContext || post.authorRole || 'student'}</span>
                    <span>{post.pinned ? 'Yes' : 'No'}</span>
                    <div className="admin-actions">
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={async () => {
                          const response = await updateAdminCommunityPost(post._id, { pinned: !post.pinned });
                          if (response.success) {
                            setPosts((prev) =>
                              prev.map((item) => (item._id === post._id ? response.data : item))
                            );
                          }
                        }}
                      >
                        <FiPin size={14} />
                        {post.pinned ? 'Unpin' : 'Pin'}
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={async () => {
                          if (!window.confirm('Delete this post?')) return;
                          const response = await deleteAdminCommunityPost(post._id);
                          if (response.success) {
                            setPosts((prev) => prev.filter((item) => item._id !== post._id));
                          }
                        }}
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminCommunity;
