import React, { useMemo, useState } from 'react';
import { FiBookOpen, FiBookmark, FiBriefcase, FiCheckCircle, FiFilter, FiHash, FiHeart, FiImage, FiMessageSquare, FiPlus, FiSend, FiShield, FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import { useAuth } from '../../core/auth/AuthContext';
import Navbar from '../../shared/components/layout/Navbar';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import '../../styles/features/community.css';

const Community = () => {
  useScrollReveal();
  const { user } = useAuth();
  const [tab, setTab] = useState('popular');
  const role = user?.role || 'student';
  const isCorporate = role === 'corporate';

  const cta = useMemo(() => ({
    title: isCorporate ? 'Host an Office Hour' : 'Start a Study Group',
    subtitle: isCorporate
      ? 'Support junior talent with live Q&A and review sessions.'
      : 'Find peers for weekly practice and accountability.'
  }), [isCorporate]);

  // TODO: Replace with backend data once available.
  const tags = ['#career-switch', '#ctf', '#web-security', '#blue-team', '#owasp', '#interview-prep'];

  // TODO: Replace with backend data once available.
  const posts = [
    {
      id: 1,
      author: 'Lena O.',
      role: 'Junior Analyst',
      time: '2h ago',
      title: 'Best first CTF for absolute beginners?',
      body: 'I know basics of networking and Linux. Any friendly CTF to build confidence?',
      likes: 42,
      replies: 8,
      tags: ['#ctf', '#career-switch'],
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 2,
      author: 'Dev K.',
      role: 'Security Student',
      time: '5h ago',
      title: 'How do you explain CVSS to non-technical stakeholders?',
      body: 'Any frameworks or analogies that help in presentations?',
      likes: 28,
      replies: 6,
      tags: ['#owasp', '#interview-prep'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 3,
      author: 'Ari P.',
      role: 'SOC Intern',
      time: '1d ago',
      title: 'Resources for learning web pentesting in 60 days?',
      body: 'Looking for a structured path with labs and real-world practice.',
      likes: 63,
      replies: 14,
      tags: ['#web-security', '#career-switch'],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    }
  ];

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
              <span>12k learners</span>
            </div>
            <div className="hero-stat">
              <FiMessageSquare size={18} />
              <span>4k questions</span>
            </div>
            <div className="hero-stat">
              <FiCheckCircle size={18} />
              <span>1.3k answered</span>
            </div>
          </div>
        </header>

        <div className="community-layout">
          <aside className="community-sidebar reveal-on-scroll">
            <Card padding="large" className="sidebar-card">
              <h3>Channels</h3>
              <div className="sidebar-list">
                <button type="button"><FiHash size={16} /> Introductions</button>
                <button type="button"><FiHash size={16} /> Beginner Q&A</button>
                <button type="button"><FiHash size={16} /> CTF Talk</button>
                <button type="button"><FiHash size={16} /> Blue Team</button>
                <button type="button"><FiHash size={16} /> Red Team</button>
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
                {tags.map((tag) => (
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
                <Button variant="secondary" size="small">
                  <FiSend size={16} />
                  Post
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
              {posts.map((post) => (
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
                    <button type="button"><FiHeart size={16} /> {post.likes}</button>
                    <button type="button"><FiMessageSquare size={16} /> {post.replies}</button>
                    <button type="button"><FiStar size={16} /> Save</button>
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
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                    alt="Ria N."
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0';
                    }}
                  />
                  <div className="avatar-fallback" aria-hidden="true"></div>
                </div>
                <div>
                  <h4>Ria N.</h4>
                  <span>Blue Team Lead</span>
                </div>
              </div>
              <Button variant="ghost" size="small">
                {isCorporate ? 'Propose Session' : 'Join Session'}
              </Button>
            </Card>

            <Card padding="large" className="sidebar-card">
              <h3>{isCorporate ? 'Top Learner Highlights' : 'Challenge of the Week'}</h3>
              <p>
                {isCorporate
                  ? 'See the most active learners and award mentorship credits.'
                  : 'Break down a real-world phishing sample and map it to MITRE.'}
              </p>
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
