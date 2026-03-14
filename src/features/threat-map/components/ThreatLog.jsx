import React, { useRef, useEffect, useState } from 'react';
import '../../../styles/sections/threat-map/log.css';

const ThreatLog = ({ attacks }) => {
  const listRef = useRef(null);
  const prevLen = useRef(0);
  const [flashId, setFlashId] = useState(null);

  /* Auto-scroll to top + flash newest */
  useEffect(() => {
    if (attacks.length !== prevLen.current) {
      prevLen.current = attacks.length;
      if (listRef.current) listRef.current.scrollTop = 0;
      if (attacks[0]) {
        setFlashId(attacks[0].id);
        const t = setTimeout(() => setFlashId(null), 700);
        return () => clearTimeout(t);
      }
    }
  }, [attacks.length]);

  return (
    <div className="threat-log">

      {/* Header */}
      <div className="threat-log-header">
        <span className="threat-log-title">
          <span className="threat-log-title-dot" />
          Attack Feed
        </span>
        <span className="threat-log-count">
          <span className="tl-count-num">{attacks.length}</span>
          <span className="tl-count-label"> events</span>
        </span>
      </div>

      {/* Empty state */}
      {attacks.length === 0 ? (
        <div className="threat-log-empty">
          <span className="threat-log-empty-icon">⬡</span>
          <span className="tl-empty-text">Awaiting first signal…</span>
          <span className="tl-empty-sub">Monitoring 30 global nodes</span>
        </div>
      ) : (
        <ul className="threat-log-list" ref={listRef}>
          {attacks.map((atk, i) => (
            <li
              key={atk.id}
              className={[
                'threat-log-item',
                `sev-${atk.severity.toLowerCase()}`,
                i === 0 ? 'is-new' : '',
                atk.id === flashId ? 'is-flash' : '',
              ].filter(Boolean).join(' ')}
            >
              {/* Left accent bar */}
              <span
                className="threat-log-accent"
                style={{ background: atk.color }}
              />

              <div className="threat-log-item-body">
                {/* Top row */}
                <div className="threat-log-item-top">
                  <span className="threat-log-type">{atk.type}</span>
                  <span
                    className="threat-log-severity"
                    style={{
                      color: atk.color,
                      borderColor: atk.color,
                      background: `${atk.color}1a`,
                    }}
                  >
                    {atk.severity}
                  </span>
                </div>

                {/* Route */}
                <div className="threat-log-route">
                  <span className="threat-log-city threat-log-city--src">{atk.src}</span>
                  <span className="threat-log-arrow" style={{ color: atk.color }}>──▶</span>
                  <span className="threat-log-city threat-log-city--dst">{atk.dst}</span>
                </div>

                {/* Footer: time + index */}
                <div className="tl-item-footer">
                  <span className="threat-log-time">{atk.time}</span>
                  <span className="tl-item-idx">#{String(attacks.length - i).padStart(4, '0')}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Footer scroll fade */}
      <div className="tl-fade-out" aria-hidden="true" />
    </div>
  );
};

export default ThreatLog;
