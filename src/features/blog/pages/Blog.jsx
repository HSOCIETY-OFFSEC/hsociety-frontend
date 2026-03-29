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
import Button from '../../../shared/components/ui/Button';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api/api.config';
import { getPublicCardMedia } from '../../../shared/data/publicCardMedia';
import {
  publicBadge,
  publicBadgePulse,
  publicCard,
  publicCardDesc,
  publicCardMeta,
  publicCardTitle,
  publicChip,
  publicCtaCard,
  publicCtaInner,
  publicCtaSection,
  publicHeroActions,
  publicHeroDesc,
  publicHeroGrid,
  publicHeroKicker,
  publicHeroPanel,
  publicHeroSection,
  publicHeroStat,
  publicHeroStats,
  publicHeroTitle,
  publicList,
  publicListItem,
  publicPage,
  publicSection,
} from '../../../shared/styles/publicClasses';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.PUBLIC.BLOG_POSTS);
        if (!mounted) return;
        if (response.success && Array.isArray(response.data?.posts) && response.data.posts.length) {
          setPosts(response.data.posts);
        }
      } finally {
        if (mounted) setLoading(false);
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
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Field Notes
            </p>
            <h1 className={publicHeroTitle}>Offensive security research in the open.</h1>
            <p className={publicHeroDesc}>
              Research, tactics, and lessons from live operations. Practical write-ups,
              red team playbooks, and learning paths for operators at every level.
            </p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                <FiRss size={14} />
                Subscribe for weekly drops
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/services')}
              >
                Explore services
                <FiArrowUpRight size={14} />
              </Button>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <p className={`${publicBadge} ${publicBadgePulse}`}>Field Notes / Live</p>
            <h3 className={publicCardTitle}>What you get</h3>
            <div className={publicList}>
              <div className={publicListItem}>
                <FiBookOpen size={14} />
                <span>Research breakdowns with reproduce-ready steps.</span>
              </div>
              <div className={publicListItem}>
                <FiBookOpen size={14} />
                <span>Operator notes from live engagements.</span>
              </div>
              <div className={publicListItem}>
                <FiBookOpen size={14} />
                <span>Curated learning paths for new operators.</span>
              </div>
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">{posts.length}</strong> posts
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">Weekly</strong> drops
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicSection}`}>
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
          <PublicCardGrid loading={loading}>
            {posts.map((post, index) => (
              <article
                key={post.title}
                className={`${publicCard} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand`}
                style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
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
                <div className={publicCardMeta}>
                  {post.tag && <span className={publicChip}>{post.tag}</span>}
                  <span>{post.date}</span>
                </div>
                <h3 className={publicCardTitle}>{post.title}</h3>
                <p className={publicCardDesc}>{post.summary}</p>
                <div className={publicCardMeta}>
                  <span>Read article</span>
                  <FiArrowUpRight size={14} />
                </div>
              </article>
            ))}
          </PublicCardGrid>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicCtaSection}`}>
        <div className={`section-container ${publicCtaInner}`}>
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Stay connected
            </p>
            <h2 className="section-title">Follow the signals in real time.</h2>
            <p className="section-subtitle">
              Subscribe for weekly drops or follow the team across your favorite platforms.
            </p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                <FiRss size={14} />
                Subscribe
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/community')}
              >
                View community
                <FiArrowUpRight size={14} />
              </Button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <h3 className={publicCardTitle}>Follow HSOCIETY OFFSEC</h3>
            <p className={publicCardDesc}>
              Signals, research drops, and community wins — in real time.
            </p>
            <SocialLinks className="flex flex-wrap gap-3" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
