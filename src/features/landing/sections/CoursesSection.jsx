/* FILE: src/features/landing/sections/CoursesSection.jsx */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLayers } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';

/* ─────────────────────────────────────────────
   Inline styles — GitHub-minimal
───────────────────────────────────────────── */
const S = {
  section: {
    padding: '5rem 1.5rem',
    position: 'relative',
    borderTop: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
  },

  inner: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1200px',
    margin: '0 auto',
  },

  /* ── Header ── */
  header: {
    marginBottom: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    padding: '0.2rem 0.65rem',
    border: '1px solid var(--border-color)',
    borderRadius: '999px',
    width: 'fit-content',
  },

  titleLine: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },

  title: {
    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.2,
  },

  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.65,
    maxWidth: '38ch',
    margin: 0,
  },

  /* ── Track ── */
  trackWrap: {
    position: 'relative',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    overflow: 'hidden',
    background: 'var(--border-color)',
  },

  track: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1px',
  },

  /* ── Phase column ── */
  phaseCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '1.5rem 0.75rem',
    cursor: 'pointer',
    background: 'var(--bg-secondary)',
    transition: 'background 0.15s ease',
  },

  phaseColHovered: {
    background: 'var(--bg-tertiary)',
  },

  /* Number badge */
  numberBadge: (hovered) => ({
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: `1px solid ${hovered ? 'var(--primary-color)' : 'var(--border-color)'}`,
    background: hovered ? 'color-mix(in srgb, var(--primary-color) 8%, var(--bg-primary))' : 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    fontFamily: "'JetBrains Mono', monospace",
    color: hovered ? 'var(--primary-color)' : 'var(--text-tertiary)',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  }),

  emblemWrap: (hovered) => ({
    width: '100%',
    aspectRatio: '1 / 1',
    maxWidth: '100px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: `1px solid ${hovered ? 'var(--primary-color)' : 'var(--border-color)'}`,
    background: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'border-color 0.15s ease',
  }),

  emblemImgSmall: {
    width: '78%',
    height: '78%',
    objectFit: 'contain',
    opacity: 0.85,
  },

  codename: (hovered) => ({
    fontSize: '0.75rem',
    fontWeight: 600,
    color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
    textAlign: 'center',
    lineHeight: 1.25,
    transition: 'color 0.15s ease',
    letterSpacing: '0.01em',
  }),

  /* ── CTA bar ── */
  ctaBar: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },

  ctaMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },

  ctaLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
  },

  ctaTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },

  ctaActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    background: 'var(--primary-color)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.8rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.15s ease',
    letterSpacing: '0.01em',
  },
};

/* ─────────────────────────────────────────────
   PhaseCard
───────────────────────────────────────────── */
const PhaseCard = ({ module, index, onClick, isNarrow }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ ...S.phaseCol, ...(hovered ? S.phaseColHovered : {}) }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } }}
      aria-label={`Open ${module.codename}`}
    >
      <div style={S.numberBadge(hovered)}>
        {String(index + 1).padStart(2, '0')}
      </div>

      <div style={S.emblemWrap(hovered)}>
        <img src={module.emblem} alt={`${module.codename} emblem`} style={S.emblemImgSmall} />
      </div>

      <span style={S.codename(hovered)}>{module.codename}</span>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CoursesSection
───────────────────────────────────────────── */
const CoursesSection = () => {
  const navigate = useNavigate();
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setIsNarrow(window.innerWidth <= 520);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const innerStyle = {
    ...S.inner,
    padding: isNarrow ? '0' : S.inner.padding,
  };

  const trackStyle = {
    ...S.track,
    gridTemplateColumns: isNarrow ? 'repeat(2, minmax(0, 1fr))' : S.track.gridTemplateColumns,
  };

  return (
    <section style={S.section} className="reveal-on-scroll">
      <div style={innerStyle}>
        {/* Header */}
        <div style={S.header}>
          <span style={S.eyebrow}>
            <FiLayers size={11} />
            Courses
          </span>
          <div style={S.titleLine}>
            <h2 style={S.title}>Explore Hacker Protocol</h2>
            <p style={S.subtitle}>{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
          </div>
        </div>

        {/* Phase track */}
        <div style={S.trackWrap}>
          <div style={trackStyle}>
            {HACKER_PROTOCOL_PHASES.map((module, i) => (
              <PhaseCard
                key={module.moduleId}
                module={module}
                index={i}
                isNarrow={isNarrow}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/courses/hacker-protocol/modules/${module.moduleId}`);
                }}
              />
            ))}
          </div>
        </div>

        {/* CTA bar */}
        <div style={S.ctaBar}>
          <div style={S.ctaMeta}>
            <span style={S.ctaLabel}>Offensive Security · {HACKER_PROTOCOL_PHASES.length} Phases</span>
            <p style={S.ctaTitle}>{HACKER_PROTOCOL_BOOTCAMP.title}</p>
          </div>
          <div style={S.ctaActions}>
            <Button
              variant="secondary"
              size="small"
              onClick={() => navigate('/courses')}
            >
              Browse All Courses
            </Button>
            <button
              style={S.primaryBtn}
              onClick={() => navigate('/courses/hacker-protocol')}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              Start Learning <FiArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;