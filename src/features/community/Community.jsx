import React, { useEffect, useMemo, useState } from 'react';
import { FiBookmark, FiCheckCircle, FiHash, FiHeart, FiMessageSquare, FiSend, FiStar, FiX } from 'react-icons/fi';
import { FiBookOpen, FiBriefcase, FiFilter, FiImage, FiPlus, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';
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
import communityContent from '../../data/community.json';
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

  const iconMap = useMemo(() => ({
    FiBookOpen,
    FiBriefcase,
    FiShield,
    FiUsers,
    FiImage,
    FiTrendingUp,
    FiPlus,
    FiBookmark,
    FiFilter
  }), []);

  const cta = useMemo(() => (
    isCorporate ? communityContent.hero.cta.corporate : communityContent.hero.cta.student
  ), [isCorporate]);

  useEffect(() => {
    let mounted = true;
    const loadOverview = async () => {
      setLoading(true);
      setError('');
      const response = await getCommunityOverview({ role, feed: tab });
      if (!mounted) return;
      if (!response.success) {
        setError(response.error || communityContent.feed.errorFallback);
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
      title: communityContent.actions.replyQueuedTitle,
      description: communityContent.actions.replyQueuedDescription
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
              <p className="community-kicker">{communityContent.hero.kicker}</p>
              <h1>{communityContent.hero.title}</h1>
              <p>
                {communityContent.hero.subtitle}
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
              <span>{overview.stats.learners || 0} {communityContent.stats.learnersLabel}</span>
            </div>
            <div className="hero-stat">
              <FiMessageSquare size={18} />
              <span>{overview.stats.questions || 0} {communityContent.stats.questionsLabel}</span>
            </div>
            <div className="hero-stat">
              <FiCheckCircle size={18} />
              <span>{overview.stats.answered || 0} {communityContent.stats.answeredLabel}</span>
            </div>
          </div>
        </header>

        <div className="community-layout">
          <aside className="community-sidebar reveal-on-scroll">
            <Card padding="large" className="sidebar-card">
              <h3>{communityContent.sidebar.channelsTitle}</h3>
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
              <h3>{isCorporate ? communityContent.sidebar.corporate.title : communityContent.sidebar.student.title}</h3>
              <p>
                {isCorporate
                  ? communityContent.sidebar.corporate.description
                  : communityContent.sidebar.student.description}
              </p>
              <div className="sidebar-list">
                {(isCorporate ? communityContent.sidebar.corporate.actions : communityContent.sidebar.student.actions).map((action) => {
                  const ActionIcon = iconMap[action.icon];
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => handleAction({
                        title: action.actionTitle,
                        description: action.actionDescription
                      })}
                    >
                      {ActionIcon && <ActionIcon size={16} />} {action.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card padding="large" className="sidebar-card">
              <h3>{communityContent.sidebar.trendingTagsTitle}</h3>
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
                    ? communityContent.composer.corporatePlaceholder
                    : communityContent.composer.studentPlaceholder}
                />
              </div>
              <div className="post-creator-actions">
                <div className="post-creator-tools">
                  {communityContent.composer.tools.map((tool) => {
                    const ToolIcon = iconMap[tool.icon];
                    return (
                      <button
                        key={tool.key}
                        type="button"
                        className={composerTool === tool.key ? 'active' : ''}
                        onClick={() => handleComposerTool(tool.key)}
                      >
                        {ToolIcon && <ToolIcon size={16} />} {tool.label}
                      </button>
                    );
                  })}
                </div>
                <Button
                  className='post-btn'
                  variant="secondary"
                  size="small"
                  onClick={handleCreatePost}
                  disabled={submitting || !postInput.trim()}
                >
                  <FiSend size={16} />
                  {submitting ? communityContent.composer.postingLabel : communityContent.composer.postLabel}
                </Button>
              </div>
              {composerTool && (
                <div className="composer-panel">
                  {(() => {
                    const tool = communityContent.composer.tools.find((item) => item.key === composerTool);
                    if (!tool) return null;
                    return (
                      <>
                        <h4>{tool.panelTitle}</h4>
                        <p>{tool.panelDescription}</p>
                      </>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={() => handleAction({
                      title: communityContent.composer.tools.find((item) => item.key === composerTool)?.actionTitle,
                      description: communityContent.composer.tools.find((item) => item.key === composerTool)?.actionDescription
                    })}
                  >
                    {communityContent.composer.tools.find((item) => item.key === composerTool)?.actionLabel}
                  </button>
                </div>
              )}
            </Card>

            <div className="feed-tabs reveal-on-scroll">
              {communityContent.tabs.map((tabItem) => {
                const TabIcon = iconMap[tabItem.icon];
                const isFilterTab = tabItem.key === 'filters';
                const isActive = isFilterTab ? filtersOpen : tab === tabItem.key;
                return (
                  <button
                    key={tabItem.key}
                    type="button"
                    className={isActive ? 'active' : ''}
                    onClick={() => {
                      if (isFilterTab) {
                        setFiltersOpen((prev) => !prev);
                      } else {
                        setTab(tabItem.key);
                      }
                    }}
                  >
                    {TabIcon && <TabIcon size={16} />}
                    {tabItem.label}
                  </button>
                );
              })}
            </div>

            {(activeChannelId || activeTag) && (
              <div className="active-filters">
                {activeChannelId && (
                  <button
                    type="button"
                    onClick={() => setActiveChannelId(null)}
                  >
                    {communityContent.activeFilters.channelPrefix} {overview.channels.find((channel) => channel.id === activeChannelId)?.name || 'Selected'}
                    <FiX size={14} />
                  </button>
                )}
                {activeTag && (
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                  >
                    {communityContent.activeFilters.tagPrefix} {activeTag}
                    <FiX size={14} />
                  </button>
                )}
              </div>
            )}

            {filtersOpen && (
              <div className="filters-panel">
                <h4>{communityContent.filters.title}</h4>
                <div className="filters-grid">
                  {communityContent.filters.options.map((item) => (
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
                    title: communityContent.filters.savedTitle,
                    description: communityContent.filters.savedDescription
                  })}
                >
                  {communityContent.filters.saveLabel}
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
                  {communityContent.actions.clearLabel}
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
                  <p>{communityContent.feed.loading}</p>
                </Card>
              )}
              {!loading && overview.posts.length === 0 && !error && (
                <Card padding="large" className="post-card">
                  <p>{communityContent.feed.empty}</p>
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
                        placeholder={communityContent.reply.placeholder}
                        value={replyDrafts[post.id] || ''}
                        onChange={(e) => handleReplyChange(post.id, e.target.value)}
                      />
                      <button type="button" onClick={() => handleSendReply(post.id)}>
                        {communityContent.reply.buttonLabel}
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </main>

          <aside className="community-right reveal-on-scroll">
            <Card padding="large" className="sidebar-card">
              <h3>{isCorporate ? communityContent.rightSidebar.corporate.title : communityContent.rightSidebar.student.title}</h3>
              <p>
                {isCorporate
                  ? communityContent.rightSidebar.corporate.description
                  : communityContent.rightSidebar.student.description}
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
                  title: isCorporate
                    ? communityContent.rightSidebar.corporate.actionTitle
                    : communityContent.rightSidebar.student.actionTitle,
                  description: isCorporate
                    ? communityContent.rightSidebar.corporate.actionDescription
                    : communityContent.rightSidebar.student.actionDescription
                })}
              >
                {isCorporate ? communityContent.rightSidebar.corporate.button : communityContent.rightSidebar.student.button}
              </Button>
            </Card>

            <Card padding="large" className="sidebar-card">
              <h3>{overview.challenge?.title || (isCorporate ? communityContent.rightSidebar.challenge.corporateTitle : communityContent.rightSidebar.challenge.studentTitle)}</h3>
              <p>{overview.challenge?.description}</p>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleAction({
                  title: isCorporate ? communityContent.rightSidebar.challenge.corporateButton : communityContent.rightSidebar.challenge.studentButton,
                  description: communityContent.rightSidebar.challenge.actionDescription
                })}
              >
                {isCorporate ? communityContent.rightSidebar.challenge.corporateButton : communityContent.rightSidebar.challenge.studentButton}
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
                  {communityContent.actions.clearLabel}
                </Button>
              </Card>
            )}
          </aside>
        </div>
      </div>
  );
};

export default Community;
