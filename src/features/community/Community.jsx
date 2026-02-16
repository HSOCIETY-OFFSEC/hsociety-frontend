import React, { useEffect, useMemo, useState } from 'react';
import { FiBookOpen, FiBookmark, FiBriefcase, FiCheckCircle, FiFilter, FiHash, FiHeart, FiImage, FiMessageSquare, FiPlus, FiSend, FiShield, FiStar, FiTrendingUp, FiUsers, FiX } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import { useAuth } from '../../core/auth/AuthContext';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import {
  createCommunityPost,
  getCommunityOverview,
  normalizeFeedPosts,
  reactToPost,
  savePost
} from './community.service';
import '../../styles/features/community.css';

const Community = () => {
  useScrollReveal();
  const { user } = useAuth();
  const [tab, setTab] = useState('popular');
  const [overview, setOverview] = useState({
    stats: { learners: 0, questions: 0, answered: 0 },
    channels: [],
    tags: [],
    posts: [],
    mentor: null,
    challenge: null
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [postInput, setPostInput] = useState('');
  const [error, setError] = useState('');
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    questions: true,
    wins: true,
    labs: true,
    mentorship: true
  });
  const [composerTool, setComposerTool] = useState(null);
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [actionPanel, setActionPanel] = useState(null);
  const role = user?.role || 'student';
  const isCorporate = role === 'corporate';

  const cta = useMemo(() => ({
    title: isCorporate ? 'Host an Office Hour' : 'Start a Study Group',
    subtitle: isCorporate
      ? 'Support junior talent with live Q&A and review sessions.'
      : 'Find peers for weekly practice and accountability.'
  }), [isCorporate]);

  useEffect(() => {
    let mounted = true;
    const loadOverview = async () => {
      setLoading(true);
      setError('');
      const response = await getCommunityOverview({ role, feed: tab });
      if (!mounted) return;
      if (!response.success) {
        setError(response.error || 'Failed to load community data.');
      } else {
        setOverview({
          ...response.data,
          posts: normalizeFeedPosts(response.data.posts || [])
        });
      }
      setLoading(false);
    };

    loadOverview();
    return () => {
      mounted = false;
    };
  }, [role, tab]);

  const handleCreatePost = async () => {
    if (!postInput.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    const response = await createCommunityPost({ content: postInput, role });
    if (!response.success) {
      setError(response.error || 'Failed to create post.');
      setSubmitting(false);
      return;
    }

    const normalized = normalizeFeedPosts([response.data])[0];
    setOverview((prev) => ({
      ...prev,
      posts: [normalized, ...prev.posts]
    }));
    setPostInput('');
    setSubmitting(false);
  };

  const handleLikePost = async (postId) => {
    setOverview((prev) => ({
      ...prev,
      posts: prev.posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    }));
    await reactToPost({ postId, reaction: 'like' });
  };

  const handleSavePost = async (postId, currentlySaved) => {
    setOverview((prev) => ({
      ...prev,
      posts: prev.posts.map((post) =>
        post.id === postId ? { ...post, isSaved: !currentlySaved } : post
      )
    }));
    await savePost({ postId, saved: !currentlySaved });
  };

  const handleChannelClick = (channel) => {
    setActiveChannelId((prev) => (prev === channel.id ? null : channel.id));
  };

  const handleTagClick = (tag) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  const handleFilterToggle = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComposerTool = (tool) => {
    setComposerTool((prev) => (prev === tool ? null : tool));
  };

  const handleReplyToggle = (postId) => {
    setReplyOpenId((prev) => (prev === postId ? null : postId));
  };

  const handleReplyChange = (postId, value) => {
    setReplyDrafts((prev) => ({ ...prev, [postId]: value }));
  };

  const handleSendReply = (postId) => {
    const draft = replyDrafts[postId]?.trim();
    if (!draft) return;
    setReplyDrafts((prev) => ({ ...prev, [postId]: '' }));
    setReplyOpenId(null);
    setActionPanel({
      title: 'Reply queued',
      description: 'Your response is ready for backend integration.'
    });
  };

  const handleAction = (action) => {
    setActionPanel(action);
  };

  return (
    <div className="community-page">
        <header className="community-hero reveal-on-scroll">
          <div className="community-hero-content">
            <div>
              <p className="community-kicker">HSOCIETY Community</p>
              <h1>Where future defenders meet.</h1>
              <p>
                Ask questions, share wins, and build your cybersecurity path with peers and mentors.
              </p>
            </div>
            <Button
              variant="primary"
              size="large"
              onClick={() => handleAction({
                title: cta.title,
                description: cta.subtitle
              })}
            >
              {isCorporate ? <FiBriefcase size={18} /> : <FiBookOpen size={18} />}
              {cta.title}
            </Button>
          </div>
          <div className="community-hero-stats">
            <div className="hero-stat">
              <FiUsers size={18} />
              <span>{overview.stats.learners || 0} learners</span>
            </div>
            <div className="hero-stat">
              <FiMessageSquare size={18} />
              <span>{overview.stats.questions || 0} questions</span>
            </div>
            <div className="hero-stat">
              <FiCheckCircle size={18} />
              <span>{overview.stats.answered || 0} answered</span>
            </div>
          </div>
        </header>

        <div className="community-layout">
          <aside className="community-sidebar reveal-on-scroll">
            <Card padding="large" className="sidebar-card">
              <h3>Channels</h3>
              <div className="sidebar-list">
                {overview.channels.map((channel) => (
                  <button
                    key={channel.id}
                    type="button"
                    className={activeChannelId === channel.id ? 'active' : ''}
                    onClick={() => handleChannelClick(channel)}
                  >
                    <FiHash size={16} /> {channel.name}
                  </button>
                ))}
              </div>
            </Card>

            <Card padding="large" className="sidebar-card">
              <h3>{isCorporate ? 'Corporate Corner' : 'Student Starter Pack'}</h3>
              <p>
                {isCorporate
                  ? 'Share internship openings, sponsor labs, and offer mentorship.'
                  : 'Guided paths, beginner labs, and weekly milestones.'}
              </p>
              <div className="sidebar-list">
                {isCorporate ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAction({
                        title: 'Post Internships',
                        description: 'Draft an internship listing for the community.'
                      })}
                    >
                      <FiBriefcase size={16} /> Post Internships
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction({
                        title: 'Sponsor Lab Time',
                        description: 'Outline lab sponsorship details and availability.'
                      })}
                    >
                      <FiShield size={16} /> Sponsor Lab Time
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction({
                        title: 'Mentor Circle',
                        description: 'Create a mentor circle session outline.'
                      })}
                    >
                      <FiUsers size={16} /> Mentor Circle
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAction({
                        title: 'Learning Roadmaps',
                        description: 'Preview curated roadmaps for your track.'
                      })}
                    >
                      <FiBookOpen size={16} /> Learning Roadmaps
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction({
                        title: 'Beginner Labs',
                        description: 'Choose a starter lab to run next.'
                      })}
                    >
                      <FiShield size={16} /> Beginner Labs
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction({
                        title: 'Find Study Buddy',
                        description: 'Set your availability and topic focus.'
                      })}
                    >
                      <FiUsers size={16} /> Find Study Buddy
                    </button>
                  </>
                )}
              </div>
            </Card>

            <Card padding="large" className="sidebar-card">
              <h3>Trending Tags</h3>
              <div className="tag-list">
                {overview.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={activeTag === tag ? 'active' : ''}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          <main className="community-feed">
            <Card padding="large" className="post-creator reveal-on-scroll">
              <div className="post-creator-header">
                <div className="avatar-frame">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
                    alt="HSOCIETY member"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0';
                    }}
                  />
                  <div className="avatar-fallback" aria-hidden="true"></div>
                </div>
                <input
                  type="text"
                  value={postInput}
                  onChange={(e) => setPostInput(e.target.value)}
                  placeholder={isCorporate
                    ? 'Share an internship, office hours, or security insight...'
                    : 'Ask a question or share a win...'}
                />
              </div>
              <div className="post-creator-actions">
                <div className="post-creator-tools">
                  <button
                    type="button"
                    className={composerTool === 'media' ? 'active' : ''}
                    onClick={() => handleComposerTool('media')}
                  >
                    <FiImage size={16} /> Media
                  </button>
                  <button
                    type="button"
                    className={composerTool === 'labs' ? 'active' : ''}
                    onClick={() => handleComposerTool('labs')}
                  >
                    <FiShield size={16} /> Lab Logs
                  </button>
                </div>
                <Button
                  className='post-btn'
                  variant="secondary"
                  size="small"
                  onClick={handleCreatePost}
                  disabled={submitting || !postInput.trim()}
                >
                  <FiSend size={16} />
                  {submitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
              {composerTool && (
                <div className="composer-panel">
                  <h4>{composerTool === 'media' ? 'Attach media' : 'Add lab log'}</h4>
                  <p>
                    {composerTool === 'media'
                      ? 'Upload screenshots or diagrams to support your post.'
                      : 'Capture lab environment, tools used, and results.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAction({
                      title: composerTool === 'media' ? 'Media upload' : 'Lab log entry',
                      description: 'Prepared for backend integration.'
                    })}
                  >
                    {composerTool === 'media' ? 'Select files' : 'Add entry'}
                  </button>
                </div>
              )}
            </Card>

            <div className="feed-tabs reveal-on-scroll">
              <button
                type="button"
                className={tab === 'popular' ? 'active' : ''}
                onClick={() => setTab('popular')}
              >
                <FiTrendingUp size={16} />
                Popular
              </button>
              <button
                type="button"
                className={tab === 'new' ? 'active' : ''}
                onClick={() => setTab('new')}
              >
                <FiPlus size={16} />
                New
              </button>
              <button
                type="button"
                className={tab === 'saved' ? 'active' : ''}
                onClick={() => setTab('saved')}
              >
                <FiBookmark size={16} />
                Saved
              </button>
              <button
                type="button"
                className={filtersOpen ? 'active' : ''}
                onClick={() => setFiltersOpen((prev) => !prev)}
              >
                <FiFilter size={16} />
                Filters
              </button>
            </div>

            {(activeChannelId || activeTag) && (
              <div className="active-filters">
                {activeChannelId && (
                  <button
                    type="button"
                    onClick={() => setActiveChannelId(null)}
                  >
                    Channel: {overview.channels.find((channel) => channel.id === activeChannelId)?.name || 'Selected'}
                    <FiX size={14} />
                  </button>
                )}
                {activeTag && (
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                  >
                    Tag: {activeTag}
                    <FiX size={14} />
                  </button>
                )}
              </div>
            )}

            {filtersOpen && (
              <div className="filters-panel">
                <h4>Feed filters</h4>
                <div className="filters-grid">
                  {[
                    { key: 'questions', label: 'Questions' },
                    { key: 'wins', label: 'Wins' },
                    { key: 'labs', label: 'Lab logs' },
                    { key: 'mentorship', label: 'Mentorship' }
                  ].map((item) => (
                    <label key={item.key}>
                      <input
                        type="checkbox"
                        checked={filters[item.key]}
                        onChange={() => handleFilterToggle(item.key)}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleAction({
                    title: 'Filters saved',
                    description: 'Your feed preferences are ready for backend integration.'
                  })}
                >
                  Save filters
                </button>
              </div>
            )}

            {actionPanel && (
              <Card padding="large" className="action-panel-inline">
                <div className="action-panel-header">
                  <h3>{actionPanel.title}</h3>
                  <button type="button" onClick={() => setActionPanel(null)}>
                    <FiX size={16} />
                  </button>
                </div>
                <p>{actionPanel.description}</p>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setActionPanel(null)}
                >
                  Clear action
                </Button>
              </Card>
            )}

            <div className="post-list">
              {error && (
                <Card padding="large" className="post-card">
                  <p>{error}</p>
                </Card>
              )}
              {loading && (
                <Card padding="large" className="post-card">
                  <p>Loading community feed...</p>
                </Card>
              )}
              {!loading && overview.posts.length === 0 && !error && (
                <Card padding="large" className="post-card">
                  <p>No posts yet for this view. Check back soon or start a conversation.</p>
                </Card>
              )}
              {!loading && overview.posts.map((post) => (
                <Card key={post.id} padding="large" className="post-card reveal-on-scroll">
                  <div className="post-header">
                    <div className="avatar-frame">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                      />
                      <div className="avatar-fallback" aria-hidden="true"></div>
                    </div>
                    <div>
                      <h4>{post.author}</h4>
                      <span>{post.role} · {post.time}</span>
                    </div>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                  <div className="post-tags">
                    {post.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={activeTag === tag ? 'active' : ''}
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="post-actions">
                    <button type="button" onClick={() => handleLikePost(post.id)}>
                      <FiHeart size={16} /> {post.likes}
                    </button>
                    <button type="button" onClick={() => handleReplyToggle(post.id)}>
                      <FiMessageSquare size={16} /> {post.replies}
                    </button>
                    <button type="button" onClick={() => handleSavePost(post.id, post.isSaved)}>
                      <FiStar size={16} /> {post.isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                  {replyOpenId === post.id && (
                    <div className="reply-box">
                      <input
                        type="text"
                        placeholder="Write a quick reply..."
                        value={replyDrafts[post.id] || ''}
                        onChange={(e) => handleReplyChange(post.id, e.target.value)}
                      />
                      <button type="button" onClick={() => handleSendReply(post.id)}>
                        Send reply
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </main>

          <aside className="community-right reveal-on-scroll">
            <Card padding="large" className="sidebar-card">
              <h3>{isCorporate ? 'Sponsor a Session' : 'Mentor Office Hours'}</h3>
              <p>
                {isCorporate
                  ? 'Offer a workshop, mock interview, or skills review.'
                  : 'Weekly live sessions with senior analysts.'}
              </p>
              <div className="mentor-item">
                <div className="avatar-frame">
                  <img
                    src={overview.mentor?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                    alt={overview.mentor?.name || 'Mentor'}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0';
                    }}
                  />
                  <div className="avatar-fallback" aria-hidden="true"></div>
                </div>
                <div>
                  <h4>{overview.mentor?.name || 'Mentor'}</h4>
                  <span>{overview.mentor?.role || 'Security Mentor'}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={() => handleAction({
                  title: isCorporate ? 'Propose Session' : 'Join Session',
                  description: 'Session preferences are ready for backend integration.'
                })}
              >
                {isCorporate ? 'Propose Session' : 'Join Session'}
              </Button>
            </Card>

            <Card padding="large" className="sidebar-card">
              <h3>{overview.challenge?.title || (isCorporate ? 'Top Learner Highlights' : 'Challenge of the Week')}</h3>
              <p>{overview.challenge?.description}</p>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleAction({
                  title: isCorporate ? 'View Learners' : 'Start Challenge',
                  description: 'Challenge details are ready for backend integration.'
                })}
              >
                {isCorporate ? 'View Learners' : 'Start Challenge'}
              </Button>
            </Card>

            {actionPanel && (
              <Card padding="large" className="sidebar-card action-panel">
                <div className="action-panel-header">
                  <h3>{actionPanel.title}</h3>
                  <button type="button" onClick={() => setActionPanel(null)}>
                    <FiX size={16} />
                  </button>
                </div>
                <p>{actionPanel.description}</p>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setActionPanel(null)}
                >
                  Clear action
                </Button>
              </Card>
            )}
          </aside>
        </div>
      </div>
  );
};

export default Community;
