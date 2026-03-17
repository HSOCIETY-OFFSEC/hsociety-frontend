/* FILE: src/features/landing/sections/CoursesSection.jsx */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';
import '../../../styles/landing/courses-section.css';

/* ─────────────────────────────────────────────
   Intersection observer hook for scroll reveal
───────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

/* ─────────────────────────────────────────────
   PhaseCard
───────────────────────────────────────────── */
const PhaseCard = ({ module, index, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className={`cs-phase-card ${hovered ? 'cs-phase-card--hovered' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Open ${module.codename}`}
      type="button"
    >
      {/* Index */}
      <span className="cs-phase-index">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Emblem */}
      <div className="cs-phase-emblem">
        <div className="cs-phase-emblem-glow" />
        <img src={module.emblem} alt="" aria-hidden="true" className="cs-phase-emblem-img" />
      </div>

      {/* Label */}
      <span className="cs-phase-label">{module.codename}</span>

      {/* Arrow */}
      <span className="cs-phase-arrow" aria-hidden="true">
        <FiArrowUpRight size={11} />
      </span>
    </button>
  );
};

/* ─────────────────────────────────────────────
   CoursesSection
───────────────────────────────────────────── */
const CoursesSection = () => {
  const navigate = useNavigate();
  const [sectionRef, visible] = useReveal();

  return (
    <section
      ref={sectionRef}
      className={`cs-section ${visible ? 'cs-section--visible' : ''}`}
    >
      <div className="cs-inner">

        {/* ── Header ── */}
        <header className="cs-header">
          <div className="cs-header-left">
            <span className="cs-eyebrow">
              <span className="cs-eyebrow-dot" />
              Courses
            </span>
            <h2 className="cs-title">Explore Hacker Protocol</h2>
            <p className="cs-subtitle">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
          </div>

          <div className="cs-header-right">
            <div className="cs-stat">
              <span className="cs-stat-value">{HACKER_PROTOCOL_PHASES.length}</span>
              <span className="cs-stat-label">phases</span>
            </div>
            <div className="cs-stat-divider" />
            <div className="cs-stat">
              <span className="cs-stat-value">01</span>
              <span className="cs-stat-label">track</span>
            </div>
          </div>
        </header>

        {/* ── Phase grid ── */}
        <div className="cs-track-shell">
          {/* Top rule with progress bar accent */}
          <div className="cs-track-rule">
            <div className="cs-track-rule-fill" />
          </div>

          <div className="cs-track">
            {HACKER_PROTOCOL_PHASES.map((module, i) => (
              <PhaseCard
                key={module.moduleId}
                module={module}
                index={i}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/courses/hacker-protocol/modules/${module.moduleId}`);
                }}
              />
            ))}
          </div>

          {/* Bottom rule */}
          <div className="cs-track-rule cs-track-rule--bottom" />
        </div>

        {/* ── CTA bar ── */}
        <footer className="cs-footer">
          <div className="cs-footer-meta">
            <span className="cs-footer-tag">Offensive Security</span>
            <span className="cs-footer-name">{HACKER_PROTOCOL_BOOTCAMP.title}</span>
          </div>

          <div className="cs-footer-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => navigate('/courses')}
            >
              Browse All
            </Button>
            <button
              className="cs-cta-primary"
              onClick={() => navigate('/courses/hacker-protocol')}
              type="button"
            >
              Start Learning
              <FiArrowRight size={13} />
            </button>
          </div>
        </footer>

      </div>
    </section>
  );
};

export default CoursesSection;