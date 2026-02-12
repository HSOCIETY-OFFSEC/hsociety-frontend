import React, { useEffect, useMemo, useState } from 'react';
import { FiBookOpen, FiBookmark, FiBriefcase, FiCheckCircle, FiFilter, FiHash, FiHeart, FiImage, FiMessageSquare, FiPlus, FiSend, FiShield, FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import { useAuth } from '../../core/auth/AuthContext';
import Navbar from '../../shared/components/layout/Navbar';
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

  return (
    <>
      <Navbar />
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
            <Button variant="primary" size="large">
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
                  <button key={channel.id} type="button">
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
                    <button type="button"><FiBriefcase size={16} /> Post Internships</button>
                    <button type="button"><FiShield size={16} /> Sponsor Lab Time</button>
                    <button type="button"><FiUsers size={16} /> Mentor Circle</button>
                  </>
                ) : (
                  <>
                    <button type="button"><FiBookOpen size={16} /> Learning Roadmaps</button>
                    <button type="button"><FiShield size={16} /> Beginner Labs</button>
                    <button type="button"><FiUsers size={16} /> Find Study Buddy</button>
                  </>
                )}
              </div>
            </Card>

            <Card padding="large" className="sidebar-card">
              <h3>Trending Tags</h3>
              <div className="tag-list">
                {overview.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
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
                  <button type="button"><FiImage size={16} /> Media</button>
                  <button type="button"><FiShield size={16} /> Lab Logs</button>
                </div>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleCreatePost}
                  disabled={submitting || !postInput.trim()}
                >
                  <FiSend size={16} />
                  {submitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
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
              <button type="button">
                <FiFilter size={16} />
                Filters
              </button>
            </div>

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
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="post-actions">
                    <button type="button" onClick={() => handleLikePost(post.id)}>
                      <FiHeart size={16} /> {post.likes}
                    </button>
                    <button type="button"><FiMessageSquare size={16} /> {post.replies}</button>
                    <button type="button" onClick={() => handleSavePost(post.id, post.isSaved)}>
                      <FiStar size={16} /> {post.isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>
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
              <Button variant="ghost" size="small">
                {isCorporate ? 'Propose Session' : 'Join Session'}
              </Button>
            </Card>

            <Card padding="large" className="sidebar-card">
              <h3>{overview.challenge?.title || (isCorporate ? 'Top Learner Highlights' : 'Challenge of the Week')}</h3>
              <p>{overview.challenge?.description}</p>
              <Button variant="secondary" size="small">
                {isCorporate ? 'View Learners' : 'Start Challenge'}
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Community;
