import React from 'react';
import { FiBookOpen, FiCalendar, FiChevronRight } from 'react-icons/fi';
import Navbar from '../../shared/components/layout/Navbar';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import '../../styles/features/blog.css';

const Blog = () => {
  useScrollReveal();

  const posts = [
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
      summary: 'Weekly goals and labs for beginners.'
    }
  ];

  return (
    <>
      <Navbar />
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
    </>
  );
};

export default Blog;
