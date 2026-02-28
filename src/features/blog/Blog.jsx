import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiCalendar, FiChevronRight } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import SocialLinks from '../../shared/components/common/SocialLinks';
import { apiClient } from '../../shared/services/api.client';
import { API_ENDPOINTS } from '../../config/api.config';
import '../../styles/sections/blog/index.css';

const Blog = () => {
  useScrollReveal();

  const fallbackPosts = [
    {
      title: 'Field Notes: Breaking Down Token Replay',
      date: 'Jan 14, 2026',
      summary: 'A practical guide to identifying replay vulnerabilities in APIs.'
    },
    {
      title: 'Red Team Playbook: Initial Access in 2026',
      date: 'Dec 05, 2025',
      summary: 'What real teams are using and how to defend.'
    },
    {
      title: 'Learning Path: First 90 Days in Cybersecurity',
      date: 'Nov 20, 2025',
      summary: 'Weekly goals and modules for beginners.'
    }
  ];
  const [posts, setPosts] = useState(fallbackPosts);

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
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="blog-page">
        <header className="blog-hero reveal-on-scroll">
          <div>
            <p className="blog-kicker">Field Notes</p>
            <h1>Insights from offensive operations.</h1>
            <p>Research, tactics, and lessons for security teams and learners.</p>
            <div className="blog-meta">
              <div>
                <span className="meta-value">Weekly</span>
                <span className="meta-label">new briefings</span>
              </div>
              <div>
                <span className="meta-value">Red Team</span>
                <span className="meta-label">tactics & playbooks</span>
              </div>
              <div>
                <span className="meta-value">Student</span>
                <span className="meta-label">learning paths</span>
              </div>
            </div>
          </div>
          <Button variant="secondary" size="large">
            <FiBookOpen size={18} />
            Subscribe
          </Button>
        </header>

        <section className="blog-social reveal-on-scroll" aria-label="Social links">
          <div>
            <h2>Follow HSOCIETY</h2>
            <p>Signals, research drops, and community wins — in real time.</p>
          </div>
          <SocialLinks className="blog-social-links" />
        </section>

        <section className="blog-grid reveal-on-scroll">
          {posts.map((post) => (
            <Card key={post.title} padding="large" className="blog-card">
              <div className="blog-date">
                <FiCalendar size={14} />
                {post.date}
              </div>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <Button variant="ghost" size="small">
                Read Article <FiChevronRight size={16} />
              </Button>
            </Card>
          ))}
        </section>
    </div>
  );
};

export default Blog;
