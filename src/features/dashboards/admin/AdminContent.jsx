import React, { useEffect, useState } from 'react';
import { FiPlus, FiSave, FiSend, FiTrash2, FiVideo } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import PageLoader from '../../../shared/components/ui/PageLoader';
import {
  getAdminContent,
  publishBootcampMeeting,
  sendAdminNotification,
  updateAdminContent,
} from './admin.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import defaultTeamContent from '../../../data/static/team.json';
import './index.css';

const emptyPost = { title: '', date: '', summary: '' };
const emptyResource = { title: '', description: '', url: '', type: 'link' };
const emptyTeamSocial = { platform: '', url: '' };
const emptyTeamMember = {
  name: '',
  role: '',
  focus: '',
  icon: 'FiUsers',
  image: '',
  socials: [{ ...emptyTeamSocial }],
};

const ensureArray = (value, fallback = []) => (Array.isArray(value) ? value : fallback);

const normalizeTeam = (incoming = {}) => ({
  ...defaultTeamContent,
  ...incoming,
  hero: { ...defaultTeamContent.hero, ...(incoming.hero || {}) },
  leadership: {
    ...defaultTeamContent.leadership,
    ...(incoming.leadership || {}),
    members: ensureArray(
      incoming.leadership?.members,
      defaultTeamContent.leadership?.members || []
    ).map((member) => ({
      ...member,
      icon: String(member?.icon || 'FiUsers'),
      socials: ensureArray(member?.socials, []).length
        ? ensureArray(member?.socials, []).map((social) => ({
            platform: String(social?.platform || ''),
            url: String(social?.url || ''),
          }))
        : [{ ...emptyTeamSocial }],
    })),
  },
  groups: {
    ...defaultTeamContent.groups,
    ...(incoming.groups || {}),
    items: ensureArray(incoming.groups?.items, defaultTeamContent.groups?.items || []),
  },
  cta: { ...defaultTeamContent.cta, ...(incoming.cta || {}) },
});

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [landing, setLanding] = useState({
    heroTitle: '',
    heroDescription: '',
    ctaPrimary: '',
    ctaSecondary: '',
    communitySubtitle: '',
  });
  const [posts, setPosts] = useState([emptyPost]);
  const [resources, setResources] = useState([emptyResource]);
  const [resourcesMessage, setResourcesMessage] = useState('We do not have free resources yet.');
  const [terms, setTerms] = useState({
    effectiveDate: '',
    lastUpdated: '',
    jurisdiction: '',
    sections: [{ title: '', body: '', bullets: [] }],
  });
  const [team, setTeam] = useState(() => normalizeTeam({}));
  const [meetingForm, setMeetingForm] = useState({ meetUrl: '', message: '', audience: 'students' });
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    audience: 'all',
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
          communitySubtitle: data.landing?.communitySubtitle || '',
        });
        const existing = data.blog?.posts || [];
        setPosts(existing.length ? existing : [emptyPost]);

        const freeResources = data.learn?.freeResources || [];
        setResources(freeResources.length ? freeResources : [emptyResource]);
        setResourcesMessage(data.learn?.freeResourcesMessage || 'We do not have free resources yet.');
        setMeetingForm((prev) => ({
          ...prev,
          meetUrl: data.learn?.bootcampMeetingUrl || '',
          message: data.learn?.bootcampMeetingMessage || '',
        }));

        const existingTerms = data.terms || {};
        setTerms({
          effectiveDate: existingTerms.effectiveDate || '',
          lastUpdated: existingTerms.lastUpdated || '',
          jurisdiction: existingTerms.jurisdiction || '',
          sections:
            Array.isArray(existingTerms.sections) && existingTerms.sections.length
              ? existingTerms.sections.map((section) => ({
                  title: section.title || '',
                  body: section.body || '',
                  bullets: Array.isArray(section.bullets) ? section.bullets : [],
                }))
              : [{ title: '', body: '', bullets: [] }],
        });
        setTeam(normalizeTeam(data.team || {}));
      } else {
        setError(getPublicErrorMessage({ action: 'load', response }));
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const updatePost = (index, field, value) => {
    setPosts((prev) => prev.map((post, i) => (i === index ? { ...post, [field]: value } : post)));
  };

  const updateResource = (index, field, value) => {
    setResources((prev) =>
      prev.map((resource, i) => (i === index ? { ...resource, [field]: value } : resource))
    );
  };

  const addPost = () => setPosts((prev) => [...prev, { ...emptyPost }]);
  const addResource = () => setResources((prev) => [...prev, { ...emptyResource }]);

  const removePost = (index) => {
    setPosts((prev) => prev.filter((_, i) => i !== index));
  };

  const removeResource = (index) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTermsSection = (index, field, value) => {
    setTerms((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const addTermsSection = () => {
    setTerms((prev) => ({ ...prev, sections: [...prev.sections, { title: '', body: '', bullets: [] }] }));
  };

  const removeTermsSection = (index) => {
    setTerms((prev) => ({ ...prev, sections: prev.sections.filter((_, i) => i !== index) }));
  };

  const updateTeamHero = (field, value) => {
    setTeam((prev) => ({ ...prev, hero: { ...(prev.hero || {}), [field]: value } }));
  };

  const updateTeamLeadership = (field, value) => {
    setTeam((prev) => ({
      ...prev,
      leadership: { ...(prev.leadership || {}), [field]: value },
    }));
  };

  const updateTeamMember = (index, field, value) => {
    setTeam((prev) => ({
      ...prev,
      leadership: {
        ...(prev.leadership || {}),
        members: ensureArray(prev.leadership?.members).map((member, memberIndex) =>
          memberIndex === index ? { ...member, [field]: value } : member
        ),
      },
    }));
  };

  const addTeamMember = () => {
    setTeam((prev) => ({
      ...prev,
      leadership: {
        ...(prev.leadership || {}),
        members: [...ensureArray(prev.leadership?.members), { ...emptyTeamMember }],
      },
    }));
  };

  const removeTeamMember = (index) => {
    setTeam((prev) => ({
      ...prev,
      leadership: {
        ...(prev.leadership || {}),
        members: ensureArray(prev.leadership?.members).filter((_, memberIndex) => memberIndex !== index),
      },
    }));
  };

  const updateTeamMemberSocial = (memberIndex, socialIndex, field, value) => {
    setTeam((prev) => ({
      ...prev,
      leadership: {
        ...(prev.leadership || {}),
        members: ensureArray(prev.leadership?.members).map((member, currentMemberIndex) => {
          if (currentMemberIndex !== memberIndex) return member;
          return {
            ...member,
            socials: ensureArray(member.socials).map((social, currentSocialIndex) =>
              currentSocialIndex === socialIndex ? { ...social, [field]: value } : social
            ),
          };
        }),
      },
    }));
  };

  const addTeamMemberSocial = (memberIndex) => {
    setTeam((prev) => ({
      ...prev,
      leadership: {
        ...(prev.leadership || {}),
        members: ensureArray(prev.leadership?.members).map((member, currentMemberIndex) =>
          currentMemberIndex === memberIndex
            ? { ...member, socials: [...ensureArray(member.socials), { ...emptyTeamSocial }] }
            : member
        ),
      },
    }));
  };

  const removeTeamMemberSocial = (memberIndex, socialIndex) => {
    setTeam((prev) => ({
      ...prev,
      leadership: {
        ...(prev.leadership || {}),
        members: ensureArray(prev.leadership?.members).map((member, currentMemberIndex) => {
          if (currentMemberIndex !== memberIndex) return member;
          const socials = ensureArray(member.socials).filter((_, idx) => idx !== socialIndex);
          return { ...member, socials: socials.length ? socials : [{ ...emptyTeamSocial }] };
        }),
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setStatus('');

    const payload = {
      landing,
      blog: {
        posts: posts
          .map((post) => ({
            title: String(post.title || '').trim(),
            date: String(post.date || '').trim(),
            summary: String(post.summary || '').trim(),
          }))
          .filter((post) => post.title && post.summary),
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
            : [],
        })),
      },
      learn: {
        freeResources: resources
          .map((item) => ({
            title: String(item.title || '').trim(),
            description: String(item.description || '').trim(),
            url: String(item.url || '').trim(),
            type: String(item.type || 'link').trim() || 'link',
          }))
          .filter((item) => item.title),
        freeResourcesMessage: resourcesMessage,
        bootcampMeetingUrl: meetingForm.meetUrl,
        bootcampMeetingMessage: meetingForm.message,
      },
      team: {
        hero: {
          kicker: String(team.hero?.kicker || '').trim(),
          title: String(team.hero?.title || '').trim(),
          subtitle: String(team.hero?.subtitle || '').trim(),
          button: String(team.hero?.button || '').trim(),
          route: String(team.hero?.route || '').trim(),
        },
        leadership: {
          title: String(team.leadership?.title || '').trim(),
          subtitle: String(team.leadership?.subtitle || '').trim(),
          members: ensureArray(team.leadership?.members)
            .map((member) => ({
              name: String(member?.name || '').trim(),
              role: String(member?.role || '').trim(),
              focus: String(member?.focus || '').trim(),
              icon: String(member?.icon || '').trim(),
              image: String(member?.image || '').trim(),
              socials: ensureArray(member?.socials)
                .map((social) => ({
                  platform: String(social?.platform || '').trim(),
                  url: String(social?.url || '').trim(),
                }))
                .filter((social) => social.platform && social.url),
            }))
            .filter((member) => member.name),
        },
        groups: {
          title: String(team.groups?.title || '').trim(),
          subtitle: String(team.groups?.subtitle || '').trim(),
          items: ensureArray(team.groups?.items)
            .map((item) => ({
              title: String(item?.title || '').trim(),
              description: String(item?.description || '').trim(),
              icon: String(item?.icon || '').trim(),
            }))
            .filter((item) => item.title && item.description),
        },
        cta: {
          title: String(team.cta?.title || '').trim(),
          subtitle: String(team.cta?.subtitle || '').trim(),
          button: String(team.cta?.button || '').trim(),
          route: String(team.cta?.route || '').trim(),
        },
      },
    };

    const response = await updateAdminContent(payload);
    if (!response.success) {
      setError(getPublicErrorMessage({ action: 'save', response }));
    } else {
      setStatus('Content saved.');
    }
    setSaving(false);
  };

  const handleSendNotification = async () => {
    setError('');
    setStatus('');
    const response = await sendAdminNotification({
      title: notificationForm.title,
      message: notificationForm.message,
      audience: notificationForm.audience,
      type: 'admin_message',
    });
    if (!response.success) {
      setError(getPublicErrorMessage({ action: 'submit', response }));
      return;
    }
    setStatus(`Notification sent to ${response.data?.sentCount || 0} users.`);
  };

  const handlePublishMeeting = async () => {
    setError('');
    setStatus('');
    const response = await publishBootcampMeeting(meetingForm);
    if (!response.success) {
      setError(getPublicErrorMessage({ action: 'submit', response }));
      return;
    }
    setStatus(`Meeting alert sent to ${response.data?.sentCount || 0} users.`);
  };

  if (loading) return <PageLoader message="Loading content manager..." durationMs={0} />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-shell">
        {error && <div className="admin-alert">{error}</div>}
        {status && <div className="admin-alert">{status}</div>}

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
                onChange={(e) =>
                  setLanding((prev) => ({ ...prev, heroDescription: e.target.value }))
                }
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
                onChange={(e) =>
                  setLanding((prev) => ({ ...prev, communitySubtitle: e.target.value }))
                }
              />
            </label>
          </div>
        </Card>

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Free Resources (Learn &gt; Resources)</h2>
            <p>Students see this section even without bootcamp enrollment.</p>
          </div>
          <div className="admin-stats-form">
            <label>
              Empty state message
              <input
                className="admin-input"
                value={resourcesMessage}
                onChange={(e) => setResourcesMessage(e.target.value)}
              />
            </label>
          </div>

          <div className="admin-content-posts">
            {resources.map((resource, index) => (
              <div className="admin-content-post" key={`resource-${index}`}>
                <input
                  className="admin-input"
                  placeholder="Resource title"
                  value={resource.title}
                  onChange={(e) => updateResource(index, 'title', e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="URL"
                  value={resource.url}
                  onChange={(e) => updateResource(index, 'url', e.target.value)}
                />
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="Description"
                  value={resource.description}
                  onChange={(e) => updateResource(index, 'description', e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => removeResource(index)}
                  disabled={resources.length <= 1}
                >
                  <FiTrash2 size={14} />
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="secondary" size="small" onClick={addResource}>
              <FiPlus size={14} />
              Add Resource
            </Button>
          </div>
        </Card>

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Bootcamp Meeting Broadcast</h2>
            <p>Paste a Google Meet link and notify target users instantly.</p>
          </div>
          <div className="admin-stats-form">
            <label>
              Google Meet URL
              <input
                className="admin-input"
                value={meetingForm.meetUrl}
                onChange={(e) => setMeetingForm((prev) => ({ ...prev, meetUrl: e.target.value }))}
              />
            </label>
            <label>
              Message
              <input
                className="admin-input"
                value={meetingForm.message}
                onChange={(e) => setMeetingForm((prev) => ({ ...prev, message: e.target.value }))}
              />
            </label>
            <label>
              Audience
              <select
                className="admin-input"
                value={meetingForm.audience}
                onChange={(e) => setMeetingForm((prev) => ({ ...prev, audience: e.target.value }))}
              >
                <option value="students">Students</option>
                <option value="organizers">Organizers</option>
                <option value="all">All users</option>
              </select>
            </label>
          </div>
          <Button variant="primary" size="small" onClick={handlePublishMeeting}>
            <FiVideo size={14} />
            Publish Meeting Alert
          </Button>
        </Card>

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Targeted Notifications</h2>
            <p>Send role-targeted in-app notifications.</p>
          </div>
          <div className="admin-stats-form">
            <label>
              Title
              <input
                className="admin-input"
                value={notificationForm.title}
                onChange={(e) => setNotificationForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </label>
            <label>
              Message
              <input
                className="admin-input"
                value={notificationForm.message}
                onChange={(e) =>
                  setNotificationForm((prev) => ({ ...prev, message: e.target.value }))
                }
              />
            </label>
            <label>
              Audience
              <select
                className="admin-input"
                value={notificationForm.audience}
                onChange={(e) =>
                  setNotificationForm((prev) => ({ ...prev, audience: e.target.value }))
                }
              >
                <option value="all">All users</option>
                <option value="students">Students</option>
                <option value="organizers">Organizers</option>
              </select>
            </label>
          </div>
          <Button variant="secondary" size="small" onClick={handleSendNotification}>
            <FiSend size={14} />
            Send Notification
          </Button>
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
            <h2>Team Section</h2>
            <p>Manage team hero and each member card, including social links.</p>
          </div>

          <div className="admin-stats-form">
            <label>
              Team Kicker
              <input
                className="admin-input"
                value={team.hero?.kicker || ''}
                onChange={(e) => updateTeamHero('kicker', e.target.value)}
              />
            </label>
            <label>
              Team Title
              <input
                className="admin-input"
                value={team.hero?.title || ''}
                onChange={(e) => updateTeamHero('title', e.target.value)}
              />
            </label>
            <label>
              Team Subtitle
              <input
                className="admin-input"
                value={team.hero?.subtitle || ''}
                onChange={(e) => updateTeamHero('subtitle', e.target.value)}
              />
            </label>
            <label>
              Team Button Text
              <input
                className="admin-input"
                value={team.hero?.button || ''}
                onChange={(e) => updateTeamHero('button', e.target.value)}
              />
            </label>
            <label>
              Team Button Route
              <input
                className="admin-input"
                value={team.hero?.route || ''}
                onChange={(e) => updateTeamHero('route', e.target.value)}
              />
            </label>
            <label>
              Leadership Title
              <input
                className="admin-input"
                value={team.leadership?.title || ''}
                onChange={(e) => updateTeamLeadership('title', e.target.value)}
              />
            </label>
            <label>
              Leadership Subtitle
              <input
                className="admin-input"
                value={team.leadership?.subtitle || ''}
                onChange={(e) => updateTeamLeadership('subtitle', e.target.value)}
              />
            </label>
          </div>

          <div className="admin-content-posts">
            {ensureArray(team.leadership?.members).map((member, memberIndex) => (
              <div className="admin-content-post" key={`team-member-${memberIndex}`}>
                <input
                  className="admin-input"
                  placeholder="Member name"
                  value={member.name || ''}
                  onChange={(e) => updateTeamMember(memberIndex, 'name', e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="Role"
                  value={member.role || ''}
                  onChange={(e) => updateTeamMember(memberIndex, 'role', e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="Image path (e.g. /team-images/name.jpg)"
                  value={member.image || ''}
                  onChange={(e) => updateTeamMember(memberIndex, 'image', e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="Icon (FiCrosshair, FiCpu, FiTarget...)"
                  value={member.icon || ''}
                  onChange={(e) => updateTeamMember(memberIndex, 'icon', e.target.value)}
                />
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="Focus"
                  value={member.focus || ''}
                  onChange={(e) => updateTeamMember(memberIndex, 'focus', e.target.value)}
                />

                {ensureArray(member.socials).map((social, socialIndex) => (
                  <div key={`team-member-${memberIndex}-social-${socialIndex}`} className="admin-stats-form">
                    <input
                      className="admin-input"
                      placeholder="Platform (LinkedIn, GitHub, X...)"
                      value={social.platform || ''}
                      onChange={(e) =>
                        updateTeamMemberSocial(memberIndex, socialIndex, 'platform', e.target.value)
                      }
                    />
                    <input
                      className="admin-input"
                      placeholder="Profile URL"
                      value={social.url || ''}
                      onChange={(e) =>
                        updateTeamMemberSocial(memberIndex, socialIndex, 'url', e.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => removeTeamMemberSocial(memberIndex, socialIndex)}
                    >
                      <FiTrash2 size={14} />
                      Remove Social
                    </Button>
                  </div>
                ))}

                <Button variant="ghost" size="small" onClick={() => addTeamMemberSocial(memberIndex)}>
                  <FiPlus size={14} />
                  Add Social
                </Button>

                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => removeTeamMember(memberIndex)}
                  disabled={ensureArray(team.leadership?.members).length <= 1}
                >
                  <FiTrash2 size={14} />
                  Remove Member
                </Button>
              </div>
            ))}

            <Button variant="secondary" size="small" onClick={addTeamMember}>
              <FiPlus size={14} />
              Add Team Member
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
                      e.target.value
                        .split('\n')
                        .map((item) => item.trim())
                        .filter(Boolean)
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
