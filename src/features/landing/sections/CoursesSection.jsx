import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLayers } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';

/* ─────────────────────────────────────────────
   Inline styles — drop the old CSS file import
───────────────────────────────────────────── */
const S = {
  section: {
    padding: '7rem 0',
    position: 'relative',
    overflow: 'hidden',
  },

  /* subtle scanline texture */
  scanlines: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  inner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },

  /* ── Header ── */
  header: {
    marginBottom: '3.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },

  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--primary-color)',
    opacity: 0.85,
  },

  titleLine: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },

  title: {
    fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.1,
  },

  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    maxWidth: '38ch',
    margin: 0,
  },

  /* ── Track container ── */
  trackWrap: {
    position: 'relative',
  },

  /* connecting line across phases */
  connectorLine: {
    position: 'absolute',
    top: '54px',           /* vertically centred on the phase number */
    left: '28px',
    right: '28px',
    height: '1px',
    background:
      'linear-gradient(90deg, transparent 0%, var(--border-color) 6%, var(--border-color) 94%, transparent 100%)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  track: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '0',
    position: 'relative',
    zIndex: 1,
  },

  /* ── Single phase column ── */
  phaseCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0 0.5rem',
    cursor: 'pointer',
    position: 'relative',
  },

  /* Number badge */
  numberBadge: (color, hovered) => ({
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    border: `2px solid ${hovered ? color : 'var(--border-color)'}`,
    background: hovered
      ? `color-mix(in srgb, ${color} 18%, var(--bg-secondary))`
      : 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    color: hovered ? color : 'var(--text-tertiary)',
    transition: 'all 0.22s ease',
    position: 'relative',
    zIndex: 2,
    flexShrink: 0,
    boxShadow: hovered ? `0 0 18px color-mix(in srgb, ${color} 35%, transparent)` : 'none',
  }),

  emblemWrap: (color, hovered) => ({
    width: '100%',
    aspectRatio: '1 / 1',
    maxWidth: '140px',
    borderRadius: '20px',
    overflow: 'hidden',
    border: `1.5px solid ${hovered ? color : 'var(--border-color)'}`,
    background: `color-mix(in srgb, ${color} 8%, var(--bg-tertiary))`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.22s ease',
    boxShadow: hovered ? `0 8px 28px color-mix(in srgb, ${color} 28%, transparent)` : 'none',
    transform: hovered ? 'translateY(-3px)' : 'none',
  }),

  emblemImg: {
    width: '78%',
    height: '78%',
    objectFit: 'contain',
  },

  codename: (hovered) => ({
    fontSize: '0.78rem',
    fontWeight: 700,
    color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
    textAlign: 'center',
    lineHeight: 1.25,
    transition: 'color 0.18s ease',
    letterSpacing: '0.01em',
  }),

  /* ── CTA bar at the bottom ── */
  ctaBar: {
    marginTop: '3rem',
    paddingTop: '2.5rem',
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
    gap: '0.25rem',
  },

  ctaLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.11em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
  },

  ctaTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },

  ctaActions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  /* primary CTA pill */
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.4rem',
    borderRadius: '10px',
    background: 'var(--primary-color)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.85rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.18s ease, transform 0.18s ease',
    letterSpacing: '0.01em',
  },
};

/* ─────────────────────────────────────────────
   PhaseCard — individual interactive column
───────────────────────────────────────────── */
const PhaseCard = ({ module, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const color = module.color || '#0EA5E9';

  return (
    <div
      style={S.phaseCol}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } }}
      aria-label={`Open ${module.codename}`}
    >
      {/* Phase number badge */}
      <div style={S.numberBadge(color, hovered)}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Emblem */}
      <div style={S.emblemWrap(color, hovered)}>
        <img src={module.emblem} alt={`${module.codename} emblem`} style={S.emblemImg} />
      </div>

      {/* Label */}
      <span style={S.codename(hovered)}>{module.codename}</span>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CoursesSection
───────────────────────────────────────────── */
const CoursesSection = () => {
  const navigate = useNavigate();

  return (
    <section style={S.section} className="reveal-on-scroll">
      <div style={S.scanlines} aria-hidden="true" />

      <div style={S.inner}>
        {/* ── Header ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>
            <FiLayers size={12} />
            Courses
          </span>

          <div style={S.titleLine}>
            <h2 style={S.title}>Explore Hacker Protocol</h2>
            <p style={S.subtitle}>
              {HACKER_PROTOCOL_BOOTCAMP.subtitle}
            </p>
          </div>
        </div>

        {/* ── Phase track ── */}
        <div style={S.trackWrap}>
          <div style={S.connectorLine} aria-hidden="true" />
          <div style={S.track}>
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
        </div>

        {/* ── CTA bar ── */}
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
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
            >
              Start Learning <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;