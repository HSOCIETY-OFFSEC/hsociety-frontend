/* FILE: src/features/landing/sections/CoursesSection.jsx */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiTerminal, FiFolder, FiChevronRight } from 'react-icons/fi';
import Button from '../../../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../../data/static/bootcamps/hackerProtocolData';

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
      className={`relative overflow-hidden bg-bg-primary px-6 pt-20 transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] max-sm:px-3 max-sm:pt-16 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-12">

        {/* ── Above-screen label ── */}
        <header className="flex max-w-[520px] flex-col gap-2">
          <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-text-tertiary">
            <span
              className="h-[6px] w-[6px] animate-cs-dot-pulse rounded-full bg-brand shadow-[0_0_7px_var(--primary-color)] motion-reduce:animate-none"
              aria-hidden="true"
            />
            Courses
          </span>
          <h2 className="text-[clamp(1.35rem,2.8vw,1.9rem)] font-semibold tracking-[-0.03em] text-text-primary">
            Explore Hacker Protocol
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
        </header>

        {/* ══════════════════════════════
            LAPTOP DEVICE SHELL
        ══════════════════════════════ */}
        <div
          className="group relative flex w-full flex-col items-center [perspective:2200px] [perspective-origin:50%_30%]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Lid — screen */}
          <div
            className="relative w-full max-w-[1100px] rounded-t-[16px] border border-b-0 border-[color-mix(in_srgb,var(--border-color)_70%,var(--text-primary)_10%)] border-t-[color-mix(in_srgb,var(--border-color)_40%,var(--text-primary)_30%)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bg-secondary)_88%,var(--text-primary)_12%)_0%,color-mix(in_srgb,var(--bg-secondary)_96%,var(--text-primary)_4%)_30%,var(--bg-secondary)_60%,color-mix(in_srgb,var(--bg-secondary)_84%,var(--bg-primary)_16%)_100%)] px-[10px] pt-[10px] [transform-origin:bottom_center] [transform-style:preserve-3d] [transform:rotateX(6deg)] transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-[2] before:h-px before:rounded-t-[16px] before:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--text-primary)_28%,transparent)_0%,color-mix(in_srgb,var(--text-primary)_10%,transparent)_40%,transparent_100%)] before:content-[''] group-hover:[transform:rotateX(3deg)] motion-reduce:transition-none motion-reduce:[transform:none] shadow-[0_-1px_0_0_color-mix(in_srgb,var(--text-primary)_18%,transparent)_inset,0_1px_0_0_color-mix(in_srgb,var(--bg-primary)_30%,transparent)_inset,1px_0_0_0_color-mix(in_srgb,var(--text-primary)_8%,transparent)_inset,-1px_0_0_0_color-mix(in_srgb,var(--bg-primary)_20%,transparent)_inset,0_32px_64px_-12px_color-mix(in_srgb,var(--bg-primary)_72%,transparent),0_12px_24px_-8px_color-mix(in_srgb,var(--bg-primary)_50%,transparent),0_4px_8px_-4px_color-mix(in_srgb,var(--bg-primary)_40%,transparent)] group-hover:shadow-[0_-1px_0_0_color-mix(in_srgb,var(--text-primary)_18%,transparent)_inset,0_1px_0_0_color-mix(in_srgb,var(--bg-primary)_30%,transparent)_inset,1px_0_0_0_color-mix(in_srgb,var(--text-primary)_8%,transparent)_inset,-1px_0_0_0_color-mix(in_srgb,var(--bg-primary)_20%,transparent)_inset,0_48px_96px_-12px_color-mix(in_srgb,var(--bg-primary)_85%,transparent),0_18px_36px_-8px_color-mix(in_srgb,var(--bg-primary)_60%,transparent),0_6px_12px_-4px_color-mix(in_srgb,var(--bg-primary)_45%,transparent)]"
          >
            {/* Camera notch */}
            <div className="absolute left-1/2 top-[6px] z-10 flex -translate-x-1/2 items-center justify-center" aria-hidden="true">
              <span className="block h-[7px] w-[7px] rounded-full border border-[color-mix(in_srgb,var(--border-color)_30%,var(--bg-primary)_70%)] bg-[radial-gradient(circle_at_32%_32%,color-mix(in_srgb,var(--bg-secondary)_70%,var(--bg-tertiary)_30%),var(--bg-primary))] shadow-[0_0_0_2.5px_color-mix(in_srgb,var(--bg-primary)_55%,transparent),0_0_4px_color-mix(in_srgb,var(--bg-primary)_70%,transparent),0_0.5px_0_color-mix(in_srgb,var(--text-primary)_6%,transparent)_inset]" />
            </div>

            {/* Screen bezel */}
            <div className="relative flex min-h-[clamp(380px,52vh,580px)] flex-col overflow-hidden rounded-t-[10px] bg-bg-secondary shadow-[0_0_0_1px_color-mix(in_srgb,var(--bg-primary)_90%,transparent)_inset,0_0_60px_color-mix(in_srgb,var(--bg-primary)_80%,transparent)_inset,4px_0_12px_color-mix(in_srgb,var(--bg-primary)_40%,transparent)_inset,-4px_0_12px_color-mix(in_srgb,var(--bg-primary)_40%,transparent)_inset,0_-2px_18px_color-mix(in_srgb,var(--bg-primary)_60%,transparent)_inset,0_1px_0_0_color-mix(in_srgb,var(--text-primary)_4%,transparent)_inset] lg:min-h-[clamp(460px,62vh,700px)] max-sm:min-h-[clamp(260px,42vh,360px)] max-sm:max-h-[60vh]">

              {/* ── OS-style menu bar ── */}
              <div className="flex h-6 items-center justify-between border-b border-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] bg-[color-mix(in_srgb,var(--bg-tertiary)_90%,var(--bg-secondary)_10%)] px-3" aria-hidden="true">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[0.6rem] font-semibold tracking-[0.08em] text-text-primary/55">
                    hsociety-offsec
                  </span>
                  <span className="font-mono text-[0.58rem] tracking-[0.04em] text-text-primary/30 max-sm:hidden">File</span>
                  <span className="font-mono text-[0.58rem] tracking-[0.04em] text-text-primary/30 max-sm:hidden">View</span>
                  <span className="font-mono text-[0.58rem] tracking-[0.04em] text-text-primary/30 max-sm:hidden">Terminal</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[0.58rem] tracking-[0.04em] text-text-primary/30">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* ── Terminal window ── */}
              <div className="m-2 flex flex-1 flex-col overflow-hidden rounded-[10px] border border-[color-mix(in_srgb,var(--text-primary)_10%,transparent)] bg-bg-secondary shadow-[0_0_0_1px_color-mix(in_srgb,var(--bg-primary)_80%,transparent)_inset,0_1px_0_0_color-mix(in_srgb,var(--text-primary)_5%,transparent)_inset,0_8px_32px_color-mix(in_srgb,var(--bg-primary)_90%,transparent)]">

                {/* Terminal title bar */}
                <div className="flex h-9 items-center gap-2.5 border-b border-[color-mix(in_srgb,var(--bg-primary)_50%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--bg-tertiary)_85%,var(--text-primary)_6%)_0%,color-mix(in_srgb,var(--bg-tertiary)_92%,var(--bg-primary)_8%)_100%)] px-3 shadow-[0_1px_0_0_color-mix(in_srgb,var(--text-primary)_5%,transparent)_inset,0_-1px_0_0_color-mix(in_srgb,var(--bg-primary)_40%,transparent)]">
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,color-mix(in_srgb,rgb(var(--danger-rgb))_65%,var(--text-primary)_35%),rgb(var(--danger-rgb)))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--bg-primary)_30%,transparent)_inset,0_1px_0_color-mix(in_srgb,var(--text-primary)_20%,transparent)_inset,0_1px_3px_color-mix(in_srgb,var(--bg-primary)_40%,transparent)] transition-[filter] duration-150 hover:brightness-110 hover:saturate-110" />
                    <span className="h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,color-mix(in_srgb,rgb(var(--warning-rgb))_65%,var(--text-primary)_35%),rgb(var(--warning-rgb)))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--bg-primary)_30%,transparent)_inset,0_1px_0_color-mix(in_srgb,var(--text-primary)_20%,transparent)_inset,0_1px_3px_color-mix(in_srgb,var(--bg-primary)_40%,transparent)] transition-[filter] duration-150 hover:brightness-110 hover:saturate-110" />
                    <span className="h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,color-mix(in_srgb,var(--primary-color)_80%,var(--text-primary)_20%),var(--primary-color))] shadow-[0_0_6px_color-mix(in_srgb,var(--primary-color)_45%,transparent),0_0_0_1px_color-mix(in_srgb,var(--bg-primary)_30%,transparent)_inset,0_1px_0_color-mix(in_srgb,var(--text-primary)_20%,transparent)_inset,0_1px_3px_color-mix(in_srgb,var(--bg-primary)_40%,transparent)] transition-[filter] duration-150 hover:brightness-110 hover:saturate-110" />
                  </div>
                  <span className="mx-auto flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.04em] text-text-primary/30">
                    <FiTerminal size={11} aria-hidden="true" />
                    hacker-protocol — bash
                  </span>
                  <div className="w-12 shrink-0" />
                </div>

                {/* Terminal body — split pane */}
                <div className="grid flex-1 grid-cols-[220px_1fr] overflow-hidden max-md:grid-cols-[160px_1fr] max-sm:grid-cols-1">

                  {/* LEFT PANE — sidebar file tree */}
                  <div className="flex flex-col overflow-hidden border-r border-[color-mix(in_srgb,var(--text-primary)_5%,transparent)] bg-[color-mix(in_srgb,var(--bg-primary)_95%,var(--bg-secondary)_5%)] shadow-[2px_0_8px_color-mix(in_srgb,var(--bg-primary)_40%,transparent)_inset] max-sm:max-h-[140px] max-sm:border-r-0 max-sm:border-b max-sm:border-b-[color-mix(in_srgb,var(--text-primary)_5%,transparent)]">
                    <div className="flex shrink-0 items-center gap-1.5 border-b border-[color-mix(in_srgb,var(--text-primary)_4%,transparent)] px-3 py-2 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-text-primary/25">
                      <FiFolder size={11} />
                      PHASES
                    </div>
                    <div
                      className="flex-1 overflow-y-auto max-sm:flex max-sm:overflow-x-auto max-sm:overflow-y-hidden"
                      role="tablist"
                      aria-label="Course phases"
                    >
                      {HACKER_PROTOCOL_PHASES.map((phase, i) => {
                        const isActive = i === activeIndex;
                        return (
                          <button
                            key={phase.moduleId}
                            role="tab"
                            aria-selected={isActive}
                            className={`relative flex w-full items-center gap-1.5 py-1.5 pr-2.5 pl-2 text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand focus-visible:-outline-offset-1 hover:bg-text-primary/5 max-sm:min-w-[72px] max-sm:flex-col max-sm:items-center max-sm:gap-1 max-sm:border-r max-sm:border-[color-mix(in_srgb,var(--text-primary)_4%,transparent)] max-sm:py-2 max-sm:px-2.5 max-sm:text-center ${
                              isActive
                                ? 'border-l-2 border-l-[color-mix(in_srgb,var(--primary-color)_70%,transparent)] bg-[color-mix(in_srgb,var(--primary-color)_9%,transparent)] pl-1.5 max-sm:border-l-0 max-sm:border-b-2 max-sm:border-b-[color-mix(in_srgb,var(--primary-color)_68%,transparent)] max-sm:pl-2.5'
                                : ''
                            }`}
                            onClick={() => { setPaused(true); switchTo(i); }}
                            type="button"
                          >
                            {/* Active progress bar */}
                            {isActive && (
                              <span
                                className="absolute bottom-0 left-0 h-[1.5px] w-0 animate-cs-file-progress bg-brand motion-reduce:animate-none motion-reduce:w-full max-sm:bottom-auto max-sm:top-0"
                                key={`p-${activeIndex}`}
                                style={!paused
                                  ? { animationDuration: `${AUTO_INTERVAL}ms`, animationPlayState: 'running' }
                                  : { animationDuration: `${AUTO_INTERVAL}ms`, animationPlayState: 'paused' }
                                }
                              />
                            )}
                            <FiChevronRight
                              size={10}
                              className={`shrink-0 text-text-primary/20 transition-[transform,color] max-sm:hidden ${isActive ? 'rotate-90 text-brand' : ''}`}
                              aria-hidden="true"
                            />
                            <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border border-text-primary/10 bg-text-primary/5 ${isActive ? 'border-[color-mix(in_srgb,var(--primary-color)_45%,transparent)]' : ''}`}>
                              <img src={phase.emblem} alt="" aria-hidden="true" className={`${isActive ? 'opacity-100' : 'opacity-60'} h-[80%] w-[80%] object-contain`} />
                            </span>
                            <span className={`min-w-0 flex-1 truncate font-mono text-[0.7rem] tracking-[0.01em] text-text-primary/30 transition-colors max-sm:text-[0.6rem] ${isActive ? 'text-text-primary/85' : ''}`}>
                              {phase.codename}
                            </span>
                            <span className={`shrink-0 font-mono text-[0.58rem] text-text-primary/20 transition-colors max-sm:hidden ${isActive ? 'text-brand' : ''}`}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT PANE — main terminal output */}
                  <div
                    className={`flex flex-col gap-3 overflow-y-auto px-[18px] py-[14px] transition-opacity duration-150 motion-reduce:transition-none ${fading ? 'opacity-0' : 'opacity-100'} bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,color-mix(in_srgb,var(--primary-color)_6%,transparent)_0%,transparent_70%),var(--bg-secondary)]`}
                    role="tabpanel"
                  >

                    {/* Prompt header */}
                    <div className="flex flex-wrap items-center gap-1 font-mono text-[0.7rem]">
                      <span className="font-semibold text-brand">student</span>
                      <span className="text-text-primary/25">@</span>
                      <span className="font-semibold text-brand">hsociety-offsec</span>
                      <span className="text-text-primary/25">:</span>
                      <span className="text-[color-mix(in_srgb,var(--primary-color)_65%,var(--text-primary)_35%)]">~/hacker-protocol</span>
                      <span className="ml-1 text-text-primary/30">$</span>
                      <span className="text-text-primary/55"> cat phase-{String(activeIndex + 1).padStart(2, '0')}.md</span>
                    </div>

                    {/* Phase content */}
                    <div className="flex flex-1 items-start gap-6 py-1 max-md:flex-col max-md:items-center max-md:gap-4 max-md:text-center">
                      {/* Big emblem */}
                      <div className="relative h-[clamp(72px,10vw,110px)] w-[clamp(72px,10vw,110px)] shrink-0 overflow-hidden rounded-[14px] border border-text-primary/10 bg-text-primary/5">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--primary-color)_22%,transparent)_0%,transparent_65%)]" aria-hidden="true" />
                        <img
                          src={active.emblem}
                          alt={`${active.codename} emblem`}
                          className="relative z-[1] h-[72%] w-[72%] object-contain drop-shadow-[0_0_10px_color-mix(in_srgb,var(--primary-color)_35%,transparent)]"
                        />
                      </div>

                      {/* Meta */}
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-baseline gap-2.5 font-mono text-[0.72rem] max-md:flex-wrap max-md:justify-center">
                          <span className="min-w-[60px] text-text-primary/25 max-md:min-w-0">phase</span>
                          <span className="text-text-primary/60">
                            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2.5 font-mono text-[0.72rem] max-md:flex-wrap max-md:justify-center">
                          <span className="min-w-[60px] text-text-primary/25 max-md:min-w-0">codename</span>
                          <span className="text-[0.85rem] font-semibold text-brand">{active.codename}</span>
                        </div>
                        {active.description && (
                          <div className="flex items-start gap-2.5 font-mono text-[0.72rem] max-md:flex-wrap max-md:justify-center">
                            <span className="min-w-[60px] text-text-primary/25 max-md:min-w-0">about</span>
                            <span className="text-[0.68rem] leading-relaxed text-text-primary/35">{active.description}</span>
                          </div>
                        )}
                        <div className="mt-1 flex items-center gap-2.5 font-mono text-[0.72rem] max-md:flex-wrap max-md:justify-center">
                          <span className="text-[0.7rem] text-text-primary/25">$</span>
                          <button
                            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-[color-mix(in_srgb,var(--primary-color)_28%,transparent)] bg-[color-mix(in_srgb,var(--primary-color)_8%,transparent)] px-2 py-0.5 font-mono text-[0.7rem] text-brand transition-all hover:gap-2 hover:border-[color-mix(in_srgb,var(--primary-color)_60%,transparent)] hover:bg-[color-mix(in_srgb,var(--primary-color)_16%,transparent)]"
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
                    <div className="mt-auto flex items-center gap-1 pt-2 font-mono text-[0.7rem]" aria-hidden="true">
                      <span className="font-semibold text-brand">student</span>
                      <span className="text-text-primary/25">@</span>
                      <span className="font-semibold text-brand">hsociety-offsec</span>
                      <span className="text-text-primary/30">$</span>
                      <span className="ml-1 inline-block h-[14px] w-[8px] rounded-[1px] bg-brand animate-cursor-blink motion-reduce:animate-none" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Screen scanline overlay */}
              <div className="pointer-events-none absolute inset-0 z-10 rounded-t-[10px] bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,color-mix(in_srgb,var(--bg-primary)_2.5%,transparent)_3px,color-mix(in_srgb,var(--bg-primary)_2.5%,transparent)_4px)] shadow-[0_0_80px_color-mix(in_srgb,var(--bg-primary)_45%,transparent)_inset,40px_0_60px_color-mix(in_srgb,var(--bg-primary)_18%,transparent)_inset,-40px_0_60px_color-mix(in_srgb,var(--bg-primary)_18%,transparent)_inset,0_-32px_48px_color-mix(in_srgb,var(--bg-primary)_25%,transparent)_inset]" aria-hidden="true" />
            </div>
          </div>

          {/* Base / hinge */}
          <div className="flex w-full max-w-[1100px] flex-col items-center [transform-origin:top_center] [transform-style:preserve-3d] [transform:rotateX(-2deg)] motion-reduce:[transform:none]">
            <div
              className="h-[7px] w-full border-x border-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--bg-primary)_75%,transparent)_0%,color-mix(in_srgb,var(--bg-tertiary)_70%,transparent)_50%,color-mix(in_srgb,var(--bg-primary)_80%,transparent)_100%)] shadow-[0_3px_10px_color-mix(in_srgb,var(--bg-primary)_70%,transparent)_inset,0_-1px_0_color-mix(in_srgb,var(--text-primary)_4%,transparent)_inset]"
              aria-hidden="true"
            />
            <div className="flex w-[110%] items-end justify-center rounded-b-[12px] border border-t-0 border-[color-mix(in_srgb,var(--border-color)_60%,var(--text-primary)_8%)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--bg-secondary)_80%,var(--bg-primary)_20%)_0%,color-mix(in_srgb,var(--bg-secondary)_92%,var(--text-primary)_8%)_40%,color-mix(in_srgb,var(--bg-secondary)_78%,var(--bg-primary)_22%)_100%)] pb-1 shadow-[0_16px_64px_color-mix(in_srgb,var(--bg-primary)_90%,transparent),0_6px_16px_color-mix(in_srgb,var(--bg-primary)_55%,transparent),0_1px_0_color-mix(in_srgb,var(--text-primary)_6%,transparent)_inset,0_-1px_0_color-mix(in_srgb,var(--bg-primary)_50%,transparent)_inset] max-sm:w-[106%]">
              <div className="h-1 w-[88px] rounded-[2px] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--bg-primary)_30%,transparent),color-mix(in_srgb,var(--border-color)_50%,var(--bg-primary)_50%),color-mix(in_srgb,var(--bg-primary)_30%,transparent))] shadow-[0_1px_3px_color-mix(in_srgb,var(--bg-primary)_60%,transparent)_inset,0_-0.5px_0_color-mix(in_srgb,var(--text-primary)_5%,transparent)_inset]" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-6 max-sm:flex-col max-sm:items-start">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brand">
              Offensive Security
            </span>
            <span className="text-[0.75rem] text-text-tertiary" aria-hidden="true">·</span>
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
              {total} Phases
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 max-sm:w-full max-sm:flex-col max-sm:items-stretch">
            <Button variant="secondary" size="small" onClick={() => navigate('/courses')}>
              Browse All Courses
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate('/courses/hacker-protocol')}
              className="max-sm:w-full"
            >
              Start Learning <FiArrowRight size={13} />
            </Button>
          </div>
        </footer>

      </div>
    </section>
  );
};

export default CoursesSection;
 
