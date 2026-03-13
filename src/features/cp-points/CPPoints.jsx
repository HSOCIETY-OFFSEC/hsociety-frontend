import React, { useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiTrendingUp, FiTarget, FiShield } from 'react-icons/fi';
import Button from '../../shared/components/ui/Button';
import cpIcon from '../../assets/icons/CP/cp-icon.webp';
import '../../styles/cp-points/cp-points.css';

const CPPoints = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const actions = useMemo(
    () => [
      {
        title: 'Complete mission labs',
        description: 'Finish guided strike labs and earn stacked CP boosts with every verified objective.',
        icon: <FiTarget size={18} />,
        accent: 'alpha'
      },
      {
        title: 'Ship real pentest wins',
        description: 'Deliver findings, document remediations, and stack multipliers for high-impact reports.',
        icon: <FiShield size={18} />,
        accent: 'beta'
      },
      {
        title: 'Stay on streak',
        description: 'Daily progress unlocks streak bonuses that amplify every point you collect.',
        icon: <FiTrendingUp size={18} />,
        accent: 'gamma'
      }
    ],
    []
  );

  const handlePointerMove = useCallback((event) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -10;
    const tiltY = (x - 0.5) * 10;

    heroRef.current.style.setProperty('--pointer-x', `${x * 100}%`);
    heroRef.current.style.setProperty('--pointer-y', `${y * 100}%`);
    heroRef.current.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    heroRef.current.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty('--pointer-x', '50%');
    heroRef.current.style.setProperty('--pointer-y', '45%');
    heroRef.current.style.setProperty('--tilt-x', '0deg');
    heroRef.current.style.setProperty('--tilt-y', '0deg');
  }, []);

  return (
    <section className="cp-points-page">
      <div className="cp-points-hero reveal-on-scroll">
        <div className="cp-points-hero-copy">
          <div className="cp-points-eyebrow">
            <span className="cp-points-dot" />
            CP Points
          </div>
          <h1>Earn the points that prove your operator edge.</h1>
          <p>
            CP points are your live reputation score. Every completed lab, verified report,
            and community streak compounds your presence across HSOCIETY.
          </p>
          <div className="cp-points-cta">
            <Button size="large" variant="primary" onClick={() => navigate('/register')}>
              Start earning CP
            </Button>
            <Button size="large" variant="ghost" onClick={() => navigate('/leaderboard')}>
              View leaderboard
            </Button>
          </div>
          <div className="cp-points-meta">
            <div>
              <span>Momentum Score</span>
              <strong>Adaptive</strong>
            </div>
            <div>
              <span>Streak Boost</span>
              <strong>Live</strong>
            </div>
            <div>
              <span>Rank Signal</span>
              <strong>Verified</strong>
            </div>
          </div>
        </div>

        <div
          className="cp-points-orbital"
          ref={heroRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="cp-orbital-shell">
            <div className="cp-orbital-glow" />
            <div className="cp-orbital-core">
              <img src={cpIcon} alt="CP icon" />
              <span className="cp-orbital-label">CP</span>
            </div>
          </div>
          <div className="cp-orbital-caption">
            Hover to feel the momentum. Each move simulates CP gain.
          </div>
        </div>
      </div>

      <div className="cp-points-actions reveal-on-scroll">
        <header>
          <p>Earn CP faster</p>
          <h2>Stack points with deliberate moves.</h2>
        </header>
        <div className="cp-points-action-grid">
          {actions.map((action) => (
            <article key={action.title} className={`cp-action-card cp-action-${action.accent}`}>
              <div className="cp-action-icon">{action.icon}</div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="cp-points-callout reveal-on-scroll">
        <div className="cp-points-callout-card">
          <h2>Turn every win into visible proof.</h2>
          <p>
            CP points feed your public profile, unlock priority community access, and unlock
            higher-stakes missions. Keep your streak active and your points will multiply.
          </p>
          <Button
            size="large"
            variant="secondary"
            onClick={() => navigate('/student-bootcamps')}
          >
            Jump into a mission
            <FiArrowUpRight size={18} />
          </Button>
        </div>
        <div className="cp-points-signal">
          <span>CP SIGNAL</span>
          <strong>ACTIVE</strong>
          <div className="cp-signal-bar">
            <span />
            <span />
            <span />
          </div>
          <p>Every action is logged. Every point is traceable.</p>
        </div>
      </div>
    </section>
  );
};

export default CPPoints;
