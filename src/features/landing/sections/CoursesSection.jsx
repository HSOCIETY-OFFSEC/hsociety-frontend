/* FILE: src/features/landing/sections/CoursesSection.jsx */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiTerminal, FiFolder, FiChevronRight } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';
import './courses-section.css';

const AUTO_INTERVAL = 3800;

function useReveal(threshold = 0.08) {
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

/* Simulated terminal boot lines */
const BOOT_LINES = [
  '> initialising hacker-protocol runtime...',
  '> loading phase manifests... OK',
  '> decrypting module registry... OK',
  '> all systems nominal. ready.',
];

const CoursesSection = () => {
  const navigate = useNavigate();
  const [sectionRef, visible] = useReveal();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fading, setFading] = useState(false);
  const [bootLines, setBootLines] = useState([]);
  const [booted, setBooted] = useState(false);

  const total = HACKER_PROTOCOL_PHASES.length;
  const active = HACKER_PROTOCOL_PHASES[activeIndex];

  /* Boot sequence — runs once section is visible */
  useEffect(() => {
    if (!visible || booted) return;
    let i = 0;
    const tick = () => {
      if (i < BOOT_LINES.length) {
        setBootLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
        setTimeout(tick, 320);
      } else {
        setTimeout(() => setBooted(true), 400);
      }
    };
    setTimeout(tick, 500);
    setBooted(true); // prevent re-run
  }, [visible]);

  const switchTo = useCallback((index) => {
    if (index === activeIndex) return;
    setFading(true);
    setTimeout(() => {
      setActiveIndex(index);
      setFading(false);
    }, 140);
  }, [activeIndex]);

  useEffect(() => {
    if (paused || !visible) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIndex(prev => (prev + 1) % total);
        setFading(false);
      }, 140);
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [paused, visible, total]);

  return (
    <section
      ref={sectionRef}
      className={`cs-section ${visible ? 'cs-section--visible' : ''}`}
    >
      <div className="cs-inner">

        {/* ── Above-screen label ── */}
        <header className="cs-header">
          <span className="cs-eyebrow">
            <span className="cs-eyebrow-dot" aria-hidden="true" />
            Courses
          </span>
          <h2 className="cs-title">Explore Hacker Protocol</h2>
          <p className="cs-subtitle">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
        </header>

        {/* ══════════════════════════════
            LAPTOP DEVICE SHELL
        ══════════════════════════════ */}
        <div
          className="cs-laptop"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Lid — screen */}
          <div className="cs-lid">
            {/* Camera notch */}
            <div className="cs-camera" aria-hidden="true">
              <span className="cs-camera-dot" />
            </div>

            {/* Screen bezel */}
            <div className="cs-screen">

              {/* ── OS-style menu bar ── */}
              <div className="cs-menubar" aria-hidden="true">
                <div className="cs-menubar-left">
                  <span className="cs-menubar-brand">hsociety</span>
                  <span className="cs-menubar-item">File</span>
                  <span className="cs-menubar-item">View</span>
                  <span className="cs-menubar-item">Terminal</span>
                </div>
                <div className="cs-menubar-right">
                  <span className="cs-menubar-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* ── Terminal window ── */}
              <div className="cs-terminal-win">

                {/* Terminal title bar */}
                <div className="cs-titlebar">
                  <div className="cs-traffic">
                    <span className="cs-traffic-btn cs-traffic-btn--red" />
                    <span className="cs-traffic-btn cs-traffic-btn--yellow" />
                    <span className="cs-traffic-btn cs-traffic-btn--green" />
                  </div>
                  <span className="cs-titlebar-label">
                    <FiTerminal size={11} aria-hidden="true" />
                    hacker-protocol — bash
                  </span>
                  <div className="cs-titlebar-spacer" />
                </div>

                {/* Terminal body — split pane */}
                <div className="cs-terminal-body">

                  {/* LEFT PANE — sidebar file tree */}
                  <div className="cs-sidebar">
                    <div className="cs-sidebar-header">
                      <FiFolder size={11} />
                      PHASES
                    </div>
                    <div className="cs-file-tree" role="tablist" aria-label="Course phases">
                      {HACKER_PROTOCOL_PHASES.map((phase, i) => {
                        const isActive = i === activeIndex;
                        return (
                          <button
                            key={phase.moduleId}
                            role="tab"
                            aria-selected={isActive}
                            className={`cs-file-row ${isActive ? 'cs-file-row--active' : ''}`}
                            onClick={() => { setPaused(true); switchTo(i); }}
                            type="button"
                          >
                            {/* Active progress bar */}
                            {isActive && (
                              <span
                                className="cs-file-progress"
                                key={`p-${activeIndex}`}
                                style={!paused
                                  ? { animationDuration: `${AUTO_INTERVAL}ms` }
                                  : { animationPlayState: 'paused' }
                                }
                              />
                            )}
                            <FiChevronRight
                              size={10}
                              className={`cs-file-chevron ${isActive ? 'cs-file-chevron--open' : ''}`}
                              aria-hidden="true"
                            />
                            <span className="cs-file-emblem">
                              <img src={phase.emblem} alt="" aria-hidden="true" />
                            </span>
                            <span className="cs-file-name">{phase.codename}</span>
                            <span className="cs-file-index">{String(i + 1).padStart(2, '0')}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT PANE — main terminal output */}
                  <div className={`cs-main-pane ${fading ? 'cs-main-pane--fading' : ''}`} role="tabpanel">

                    {/* Prompt header */}
                    <div className="cs-pane-header">
                      <span className="cs-prompt-user">student</span>
                      <span className="cs-prompt-at">@</span>
                      <span className="cs-prompt-host">hsociety</span>
                      <span className="cs-prompt-sep">:</span>
                      <span className="cs-prompt-path">~/hacker-protocol</span>
                      <span className="cs-prompt-dollar">$</span>
                      <span className="cs-prompt-cmd"> cat phase-{String(activeIndex + 1).padStart(2, '0')}.md</span>
                    </div>

                    {/* Phase content */}
                    <div className="cs-pane-content">
                      {/* Big emblem */}
                      <div className="cs-pane-emblem-wrap">
                        <div className="cs-pane-emblem-glow" aria-hidden="true" />
                        <img
                          src={active.emblem}
                          alt={`${active.codename} emblem`}
                          className="cs-pane-emblem-img"
                        />
                      </div>

                      {/* Meta */}
                      <div className="cs-pane-meta">
                        <div className="cs-pane-meta-line">
                          <span className="cs-pane-key">phase</span>
                          <span className="cs-pane-val">
                            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="cs-pane-meta-line">
                          <span className="cs-pane-key">codename</span>
                          <span className="cs-pane-val cs-pane-val--accent">{active.codename}</span>
                        </div>
                        {active.description && (
                          <div className="cs-pane-meta-line cs-pane-meta-line--desc">
                            <span className="cs-pane-key">about</span>
                            <span className="cs-pane-val cs-pane-val--muted">{active.description}</span>
                          </div>
                        )}
                        <div className="cs-pane-meta-line cs-pane-meta-line--cmd">
                          <span className="cs-prompt-mini">$</span>
                          <button
                            className="cs-pane-open-cmd"
                            onClick={() => navigate(`/courses/hacker-protocol/modules/${active.moduleId}`)}
                            type="button"
                          >
                            cd phase-{String(activeIndex + 1).padStart(2, '0')} && ./start.sh
                            <FiArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Cursor blink */}
                    <div className="cs-pane-cursor" aria-hidden="true">
                      <span className="cs-prompt-user">student</span>
                      <span className="cs-prompt-at">@</span>
                      <span className="cs-prompt-host">hsociety</span>
                      <span className="cs-prompt-dollar">$</span>
                      <span className="cs-terminal-cursor" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Screen scanline overlay */}
              <div className="cs-scanlines" aria-hidden="true" />
            </div>
          </div>

          {/* Base / hinge */}
          <div className="cs-base">
            <div className="cs-hinge" aria-hidden="true" />
            <div className="cs-base-surface">
              <div className="cs-base-notch" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <footer className="cs-footer">
          <div className="cs-footer-meta">
            <span className="cs-footer-label">Offensive Security</span>
            <span className="cs-footer-sep" aria-hidden="true">·</span>
            <span className="cs-footer-count">{total} Phases</span>
          </div>
          <div className="cs-footer-actions">
            <Button variant="secondary" size="small" onClick={() => navigate('/courses')}>
              Browse All Courses
            </Button>
            <button
              className="cs-cta-primary"
              onClick={() => navigate('/courses/hacker-protocol')}
              type="button"
            >
              Start Learning <FiArrowRight size={13} />
            </button>
          </div>
        </footer>

      </div>
    </section>
  );
};

export default CoursesSection;