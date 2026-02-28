import React, { useEffect, useState } from 'react';
import { FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import PageLoader from '../../../shared/components/ui/PageLoader';
import { getAdminContent, updateAdminContent } from './admin.service';
import '../../../styles/dashboards/admin/index.css';

const emptyPost = { title: '', date: '', summary: '' };

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [landing, setLanding] = useState({
    heroTitle: '',
    heroDescription: '',
    ctaPrimary: '',
    ctaSecondary: '',
    communitySubtitle: ''
  });
  const [posts, setPosts] = useState([emptyPost]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const response = await getAdminContent();
      if (!mounted) return;
      if (response.success) {
        const data = response.data || {};
        setLanding({
          heroTitle: data.landing?.heroTitle || '',
          heroDescription: data.landing?.heroDescription || '',
          ctaPrimary: data.landing?.ctaPrimary || '',
          ctaSecondary: data.landing?.ctaSecondary || '',
          communitySubtitle: data.landing?.communitySubtitle || ''
        });
        const existing = data.blog?.posts || [];
        setPosts(existing.length ? existing : [emptyPost]);
      } else {
        setError(response.error || 'Failed to load content');
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const updatePost = (index, field, value) => {
    setPosts((prev) =>
      prev.map((post, i) => (i === index ? { ...post, [field]: value } : post))
    );
  };

  const addPost = () => setPosts((prev) => [...prev, { ...emptyPost }]);

  const removePost = (index) => {
    setPosts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const payload = {
      landing,
      blog: {
        posts: posts
          .map((post) => ({
            title: String(post.title || '').trim(),
            date: String(post.date || '').trim(),
            summary: String(post.summary || '').trim()
          }))
          .filter((post) => post.title && post.summary)
      }
    };

    const response = await updateAdminContent(payload);
    if (!response.success) {
      setError(response.error || 'Failed to save content');
    }
    setSaving(false);
  };

  if (loading) return <PageLoader message="Loading content manager..." durationMs={0} />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-shell">
        <div className="admin-hero dashboard-shell-header">
          <div>
            <p className="admin-kicker dashboard-shell-kicker">CONTENT CONTROL</p>
            <h1 className="dashboard-shell-title">Manage Landing & Blog</h1>
            <p className="admin-subtitle dashboard-shell-subtitle">
              Update public-facing content without redeploying.
            </p>
          </div>
        </div>

        {error && <div className="admin-alert">{error}</div>}

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Landing Page Overrides</h2>
            <p>Leave blank to keep default copy.</p>
          </div>
          <div className="admin-stats-form">
            <label>
              Hero Title
              <input
                className="admin-input"
                value={landing.heroTitle}
                onChange={(e) => setLanding((prev) => ({ ...prev, heroTitle: e.target.value }))}
              />
            </label>
            <label>
              Hero Description
              <input
                className="admin-input"
                value={landing.heroDescription}
                onChange={(e) => setLanding((prev) => ({ ...prev, heroDescription: e.target.value }))}
              />
            </label>
            <label>
              CTA Primary
              <input
                className="admin-input"
                value={landing.ctaPrimary}
                onChange={(e) => setLanding((prev) => ({ ...prev, ctaPrimary: e.target.value }))}
              />
            </label>
            <label>
              CTA Secondary
              <input
                className="admin-input"
                value={landing.ctaSecondary}
                onChange={(e) => setLanding((prev) => ({ ...prev, ctaSecondary: e.target.value }))}
              />
            </label>
            <label>
              Community Subtitle
              <input
                className="admin-input"
                value={landing.communitySubtitle}
                onChange={(e) => setLanding((prev) => ({ ...prev, communitySubtitle: e.target.value }))}
              />
            </label>
          </div>
        </Card>

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Blog Posts</h2>
            <p>Public blog cards shown on the Blog page.</p>
          </div>
          <div className="admin-content-posts">
            {posts.map((post, index) => (
              <div className="admin-content-post" key={`post-${index}`}>
                <input
                  className="admin-input"
                  placeholder="Title"
                  value={post.title}
                  onChange={(e) => updatePost(index, 'title', e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="Date (e.g., Jan 14, 2026)"
                  value={post.date}
                  onChange={(e) => updatePost(index, 'date', e.target.value)}
                />
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="Summary"
                  value={post.summary}
                  onChange={(e) => updatePost(index, 'summary', e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => removePost(index)}
                  disabled={posts.length <= 1}
                >
                  <FiTrash2 size={14} />
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="secondary" size="small" onClick={addPost}>
              <FiPlus size={14} />
              Add Post
            </Button>
          </div>
        </Card>

        <div className="admin-actions admin-actions-right">
          <Button variant="primary" size="small" onClick={handleSave} disabled={saving}>
            <FiSave size={14} />
            {saving ? 'Saving...' : 'Save Content'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
