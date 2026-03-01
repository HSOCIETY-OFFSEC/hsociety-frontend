import React, { useRef, useEffect } from 'react';
import '../../../styles/sections/threat-map/log.css';

const SEVERITY_RANK = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const ThreatLog = ({ attacks }) => {
  const listRef    = useRef(null);
  const prevLen    = useRef(0);

  /* Auto-scroll to top when new attack arrives */
  useEffect(() => {
    if (attacks.length !== prevLen.current) {
      prevLen.current = attacks.length;
      if (listRef.current) listRef.current.scrollTop = 0;
    }
  }, [attacks.length]);

  return (
    <div className="threat-log">

      <div className="threat-log-header">
        <span className="threat-log-title">
          <span className="threat-log-title-dot" />
          Attack Feed
        </span>
        <span className="threat-log-count">{attacks.length} events</span>
      </div>

      {attacks.length === 0 ? (
        <div className="threat-log-empty">
          <span className="threat-log-empty-icon">⬡</span>
          <span>Awaiting first signal…</span>
        </div>
      ) : (
        <ul className="threat-log-list" ref={listRef}>
          {attacks.map((atk, i) => (
            <li
              key={atk.id}
              className={`threat-log-item sev-${atk.severity.toLowerCase()} ${i === 0 ? 'is-new' : ''}`}
            >
              {/* Left accent bar */}
              <span
                className="threat-log-accent"
                style={{ background: atk.color }}
              />

              <div className="threat-log-item-body">
                {/* Top row: type + severity badge */}
                <div className="threat-log-item-top">
                  <span className="threat-log-type">{atk.type}</span>
                  <span
                    className="threat-log-severity"
                    style={{ color: atk.color, borderColor: atk.color, background: `${atk.color}18` }}
                  >
                    {atk.severity}
                  </span>
                </div>

                {/* Route: src → dst */}
                <div className="threat-log-route">
                  <span className="threat-log-city threat-log-city--src">{atk.src}</span>
                  <span className="threat-log-arrow">──▶</span>
                  <span className="threat-log-city threat-log-city--dst">{atk.dst}</span>
                </div>

                {/* Timestamp */}
                <span className="threat-log-time">{atk.time}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThreatLog;