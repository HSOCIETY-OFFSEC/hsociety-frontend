/**
 * Blog Page
 * Location: src/features/blog/Blog.jsx
 *
 * GitHub repo-page layout:
 *   page header (breadcrumb + actions) → two-column (main + sidebar)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiCalendar,
  FiArrowUpRight,
  FiRss,
} from 'react-icons/fi';
import SocialLinks from '../../../shared/components/common/SocialLinks';
import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api/api.config';
import '../../public/styles/public-landing.css';
import '../styles/blog.css';

const FALLBACK_POSTS = [
  {
    title: 'Field Notes: Breaking Down Token Replay',
    date: 'Jan 14, 2026',
    summary: 'A practical guide to identifying replay vulnerabilities in APIs.',
    tag: 'Research',
  },
  {
    title: 'Red Team Playbook: Initial Access in 2026',
    date: 'Dec 05, 2025',
    summary: 'What real teams are using and how to defend.',
    tag: 'Red Team',
  },
  {
    title: 'Learning Path: First 90 Days in Cybersecurity',
    date: 'Nov 20, 2025',
    summary: 'Weekly goals and modules for beginners.',
    tag: 'Learning',
  },
];

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(FALLBACK_POSTS);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await apiClient.get(API_ENDPOINTS.PUBLIC.BLOG_POSTS);
      if (!mounted) return;
      if (response.success && Array.isArray(response.data?.posts) && response.data.posts.length) {
        setPosts(response.data.posts);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleReadArticle = (post) => {
    if (post?.url) {
      window.open(post.url, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate('/contact');
  };

  return (
    <div className="landing-page public-page blg-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Field Notes
            </p>
            <h1 className="public-hero-title">Offensive security research in the open.</h1>
            <p className="public-hero-desc">
              Research, tactics, and lessons from live operations. Practical write-ups,
              red team playbooks, and learning paths for operators at every level.
            </p>
            <div className="public-hero-actions">
              <button
                className="public-btn public-btn--primary"
                onClick={() => navigate('/contact')}
              >
                <FiRss size={14} />
                Subscribe for weekly drops
              </button>
              <button
                className="public-btn public-btn--ghost"
                onClick={() => navigate('/services')}
              >
                Explore services
                <FiArrowUpRight size={14} />
              </button>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">
                <FiCalendar size={12} />
                Weekly cadence
              </span>
              <span className="public-pill">Red team tactics</span>
              <span className="public-pill">Learning playbooks</span>
              <span className="public-pill">{posts.length} posts</span>
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Field Notes / Live</p>
            <h3 className="public-card-title">What you get</h3>
            <div className="public-list">
              <div className="public-list-item">
                <FiBookOpen size={14} />
                <span>Research breakdowns with reproduce-ready steps.</span>
              </div>
              <div className="public-list-item">
                <FiBookOpen size={14} />
                <span>Operator notes from live engagements.</span>
              </div>
              <div className="public-list-item">
                <FiBookOpen size={14} />
                <span>Curated learning paths for new operators.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className="public-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Latest posts
            </p>
            <h2 className="section-title">Fresh research and playbooks.</h2>
            <p className="section-subtitle">
              Open notes from the field. Click any card to read the full post.
            </p>
          </div>
          <div className="public-card-grid">
            {posts.map((post) => (
              <article
                key={post.title}
                className="public-card blg-card"
                onClick={() => handleReadArticle(post)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleReadArticle(post);
                  }
                }}
              >
                <div className="public-card-meta">
                  {post.tag && <span className="public-chip">{post.tag}</span>}
                  <span>{post.date}</span>
                </div>
                <h3 className="public-card-title">{post.title}</h3>
                <p className="public-card-desc">{post.summary}</p>
                <div className="public-card-meta">
                  <span>Read article</span>
                  <FiArrowUpRight size={14} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="public-cta reveal-on-scroll">
        <div className="section-container public-cta-inner">
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Stay connected
            </p>
            <h2 className="section-title">Follow the signals in real time.</h2>
            <p className="section-subtitle">
              Subscribe for weekly drops or follow the team across your favorite platforms.
            </p>
            <div className="public-hero-actions">
              <button
                className="public-btn public-btn--primary"
                onClick={() => navigate('/contact')}
              >
                <FiRss size={14} />
                Subscribe
              </button>
              <button
                className="public-btn public-btn--ghost"
                onClick={() => navigate('/community')}
              >
                View community
                <FiArrowUpRight size={14} />
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Follow HSOCIETY</h3>
            <p className="public-card-desc">
              Signals, research drops, and community wins — in real time.
            </p>
            <SocialLinks className="blg-social-links" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
