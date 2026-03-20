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
  FiCheckCircle,
} from 'react-icons/fi';
import SocialLinks from '../../../shared/components/common/SocialLinks';
import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api/api.config';
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
    <div className="blg-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="blg-page-header">
        <div className="blg-page-header-inner">
          <div className="blg-header-left">
            <div className="blg-header-icon-wrap">
              <FiBookOpen size={20} className="blg-header-icon" />
            </div>
            <div>
              <div className="blg-header-breadcrumb">
                <span className="blg-breadcrumb-org">HSOCIETY</span>
                <span className="blg-breadcrumb-sep">/</span>
                <span className="blg-breadcrumb-page">field-notes</span>
                <span className="blg-header-visibility">Public</span>
              </div>
              <p className="blg-header-desc">
                Research, tactics, and lessons from offensive security operations.
              </p>
            </div>
          </div>

          <div className="blg-header-actions">
            <button
              className="blg-btn blg-btn-primary"
              onClick={() => navigate('/contact')}
            >
              <FiRss size={14} />
              Subscribe
            </button>
          </div>
        </div>

        {/* Meta pills */}
        <div className="blg-header-meta">
          <span className="blg-meta-pill">
            <FiCalendar size={13} className="blg-meta-icon" />
            <span className="blg-meta-label">Cadence</span>
            <strong className="blg-meta-value">Weekly</strong>
          </span>
          <span className="blg-meta-pill">
            <span className="blg-meta-dot" />
            <span>Red Team tactics</span>
          </span>
          <span className="blg-meta-pill">
            <span className="blg-meta-dot" />
            <span>Student learning paths</span>
          </span>
          <span className="blg-meta-pill">
            <strong className="blg-meta-value">{posts.length}</strong>
            <span className="blg-meta-label">posts</span>
          </span>
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="blg-layout">

        {/* ── MAIN COLUMN ─────────────────────────── */}
        <main className="blg-main">

          {/* Post list */}
          <section className="blg-section">
            <h2 className="blg-section-title">
              <FiBookOpen size={15} className="blg-section-icon" />
              Latest posts
            </h2>

            <div className="blg-post-list">
              {posts.map((post) => (
                <article
                  key={post.title}
                  className="blg-post-row"
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
                  <div className="blg-post-header">
                    <div className="blg-post-header-left">
                      {post.tag && (
                        <span className="blg-label blg-label-alpha">{post.tag}</span>
                      )}
                      <h3 className="blg-post-title">{post.title}</h3>
                    </div>
                    <FiArrowUpRight size={14} className="blg-post-arrow" />
                  </div>
                  <p className="blg-post-summary">{post.summary}</p>
                  <div className="blg-post-footer">
                    <FiCalendar size={12} className="blg-post-date-icon" />
                    <span className="blg-post-date">{post.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="blg-divider" />

          {/* Social section */}
          <section className="blg-section">
            <h2 className="blg-section-title">
              <FiRss size={15} className="blg-section-icon" />
              Follow HSOCIETY
            </h2>
            <p className="blg-section-desc">
              Signals, research drops, and community wins — in real time.
            </p>
            <SocialLinks className="blg-social-links" />
          </section>

        </main>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="blg-sidebar">

          <div className="blg-sidebar-box">
            <h3 className="blg-sidebar-heading">About</h3>
            <p className="blg-sidebar-about">
              Field Notes is HSOCIETY's editorial channel — covering offensive
              security research, red team tactics, and beginner learning paths.
            </p>
            <div className="blg-sidebar-divider" />
            <ul className="blg-sidebar-list">
              <li><FiCheckCircle size={13} className="blg-sidebar-icon" />Weekly briefings</li>
              <li><FiCheckCircle size={13} className="blg-sidebar-icon" />Red team playbooks</li>
              <li><FiCheckCircle size={13} className="blg-sidebar-icon" />Student learning paths</li>
              <li><FiCheckCircle size={13} className="blg-sidebar-icon" />Community research drops</li>
            </ul>
          </div>

          <div className="blg-sidebar-box blg-status-box">
            <div className="blg-status-row">
              <span className="blg-status-dot" />
              <span className="blg-status-label">PUBLISHING</span>
            </div>
            <strong className="blg-status-value">ACTIVE</strong>
            <div className="blg-status-track">
              <div className="blg-status-fill" />
            </div>
            <p className="blg-status-note">
              New posts drop weekly. Subscribe to get notified.
            </p>
          </div>

          <div className="blg-sidebar-box">
            <h3 className="blg-sidebar-heading">Topics</h3>
            <div className="blg-topics">
              {['offsec', 'red-team', 'research', 'learning', 'pentesting', 'hsociety'].map(
                (t) => <span key={t} className="blg-topic">{t}</span>
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Blog;