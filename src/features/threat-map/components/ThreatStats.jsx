import React, { useEffect, useRef } from 'react';
import '../../../styles/sections/threat-map/stats.css';

const SEVERITY_CONFIG = [
  { key: 'CRITICAL', label: 'Critical',  color: '#ff2d55' },
  { key: 'HIGH',     label: 'High',      color: '#ff6b00' },
  { key: 'MEDIUM',   label: 'Medium',    color: '#ffd60a' },
  { key: 'LOW',      label: 'Low',       color: '#2dd4bf' },
];

const AnimatedNumber = ({ value }) => {
  const ref     = useRef(null);
  const prevRef = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = prevRef.current;
    const end   = value;
    if (start === end) return;
    prevRef.current = end;

    const duration = 400;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value]);

  return <span ref={ref}>{value}</span>;
};

const ThreatStats = ({ counts, total }) => {
  const maxCount = Math.max(...SEVERITY_CONFIG.map((s) => counts[s.key] || 0), 1);

  return (
    <div className="threat-stats-bar">

      {/* Total attacks */}
      <div className="threat-stats-total">
        <span className="threat-stats-total-label">Total Attacks</span>
        <span className="threat-stats-total-value">
          <AnimatedNumber value={total} />
        </span>
      </div>

      <div className="threat-stats-divider" />

      {/* Per-severity cards */}
      {SEVERITY_CONFIG.map(({ key, label, color }) => {
        const count = counts[key] || 0;
        const pct   = Math.round((count / maxCount) * 100);
        return (
          <div key={key} className="threat-stats-card">
            <div className="threat-stats-card-top">
              <span
                className="threat-stats-badge"
                style={{ color, borderColor: color, background: `${color}18` }}
              >
                {label}
              </span>
              <span className="threat-stats-count" style={{ color }}>
                <AnimatedNumber value={count} />
              </span>
            </div>
            <div className="threat-stats-track">
              <div
                className="threat-stats-fill"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}

      {/* Live pulse indicator */}
      <div className="threat-stats-divider" />
      <div className="threat-stats-live">
        <span className="threat-stats-live-ring" />
        <span className="threat-stats-live-label">Monitoring</span>
        <span className="threat-stats-live-count">30 cities</span>
      </div>

    </div>
  );
};

export default ThreatStats;