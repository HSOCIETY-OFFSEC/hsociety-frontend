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
  const [terms, setTerms] = useState({
    effectiveDate: '',
    lastUpdated: '',
    jurisdiction: '',
    sections: [{ title: '', body: '', bullets: [] }]
  });

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
        const existingTerms = data.terms || {};
        setTerms({
          effectiveDate: existingTerms.effectiveDate || '',
          lastUpdated: existingTerms.lastUpdated || '',
          jurisdiction: existingTerms.jurisdiction || '',
          sections: Array.isArray(existingTerms.sections) && existingTerms.sections.length
            ? existingTerms.sections.map((section) => ({
                title: section.title || '',
                body: section.body || '',
                bullets: Array.isArray(section.bullets) ? section.bullets : []
              }))
            : [{ title: '', body: '', bullets: [] }]
        });
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

  const updateTermsSection = (index, field, value) => {
    setTerms((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const addTermsSection = () => {
    setTerms((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: '', body: '', bullets: [] }]
    }));
  };

  const removeTermsSection = (index) => {
    setTerms((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
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
      },
      terms: {
        effectiveDate: terms.effectiveDate,
        lastUpdated: terms.lastUpdated,
        jurisdiction: terms.jurisdiction,
        sections: terms.sections.map((section) => ({
          title: String(section.title || '').trim(),
          body: String(section.body || '').trim(),
          bullets: Array.isArray(section.bullets)
            ? section.bullets.map((item) => String(item || '').trim()).filter(Boolean)
            : []
        }))
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

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Terms & Conditions</h2>
            <p>Update the public terms page content.</p>
          </div>
          <div className="admin-stats-form">
            <label>
              Effective Date
              <input
                className="admin-input"
                value={terms.effectiveDate}
                onChange={(e) => setTerms((prev) => ({ ...prev, effectiveDate: e.target.value }))}
              />
            </label>
            <label>
              Last Updated
              <input
                className="admin-input"
                value={terms.lastUpdated}
                onChange={(e) => setTerms((prev) => ({ ...prev, lastUpdated: e.target.value }))}
              />
            </label>
            <label>
              Jurisdiction
              <input
                className="admin-input"
                value={terms.jurisdiction}
                onChange={(e) => setTerms((prev) => ({ ...prev, jurisdiction: e.target.value }))}
              />
            </label>
          </div>

          <div className="admin-content-posts">
            {terms.sections.map((section, index) => (
              <div className="admin-content-post" key={`terms-section-${index}`}>
                <input
                  className="admin-input"
                  placeholder="Section title"
                  value={section.title}
                  onChange={(e) => updateTermsSection(index, 'title', e.target.value)}
                />
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="Section body"
                  value={section.body}
                  onChange={(e) => updateTermsSection(index, 'body', e.target.value)}
                />
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="Bullets (one per line)"
                  value={(section.bullets || []).join('\n')}
                  onChange={(e) =>
                    updateTermsSection(
                      index,
                      'bullets',
                      e.target.value.split('\n').map((item) => item.trim()).filter(Boolean)
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => removeTermsSection(index)}
                  disabled={terms.sections.length <= 1}
                >
                  <FiTrash2 size={14} />
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="secondary" size="small" onClick={addTermsSection}>
              <FiPlus size={14} />
              Add Section
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
