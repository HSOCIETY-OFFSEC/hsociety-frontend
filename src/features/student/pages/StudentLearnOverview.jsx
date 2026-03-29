import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiLayers, FiZap } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP } from '../../../data/static/bootcamps/hackerProtocolData';

const StudentLearnOverview = () => {
  const navigate = useNavigate();
  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full max-w-[1200px] mx-auto px-[clamp(1rem,4vw,2rem)] py-[clamp(1.5rem,3vw,2.5rem)] text-text-primary';
  const heroClassName = 'w-full rounded-lg border border-border bg-card p-4 shadow-sm md:p-5';
  const gridClassName = 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3';
  const cardClassName = 'border-border bg-card';
  const cardHeaderClassName = 'flex items-center gap-3 border-b border-border pb-3';

  return (
    <div className={pageClassName}>
      <div className="flex flex-col gap-5">
        <header className={`reveal-on-scroll ${heroClassName}`}>
          <div>
            <p className="inline-flex items-center rounded-xs border border-border bg-bg-secondary px-2 py-1 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
              Learn
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-text-primary md:text-3xl">
              Train through a structured offensive journey.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Start with an overview, enroll in a bootcamp, and progress through validated phases.
            </p>
          </div>
        </header>

        <div className={gridClassName}>
          <Card padding="medium" shadow="small" className={`reveal-on-scroll ${cardClassName}`}>
            <div className={cardHeaderClassName}>
              <FiLayers size={20} className="text-text-tertiary" />
              <h3 className="text-sm font-semibold text-text-primary">Bootcamps</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Explore active bootcamps and enroll in the one that matches your training cycle.
            </p>
            <Button variant="primary" size="small" onClick={() => navigate('/student-bootcamps')}>
              Open Bootcamps
            </Button>
          </Card>

          <Card padding="medium" shadow="small" className={`reveal-on-scroll ${cardClassName}`}>
            <div className={cardHeaderClassName}>
              <FiBookOpen size={20} className="text-text-tertiary" />
              <h3 className="text-sm font-semibold text-text-primary">Resources</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Access free materials curated by admins. This section stays separate from paid
              bootcamp content.
            </p>
            <Button variant="secondary" size="small" onClick={() => navigate('/student-resources')}>
              View Resources
            </Button>
          </Card>

          <Card padding="medium" shadow="small" className={`reveal-on-scroll ${cardClassName}`}>
            <div className={cardHeaderClassName}>
              <FiZap size={20} className="text-text-tertiary" />
              <h3 className="text-sm font-semibold text-text-primary">Active Track</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Current track: <strong>{HACKER_PROTOCOL_BOOTCAMP.title}</strong> ·{' '}
              {HACKER_PROTOCOL_BOOTCAMP.duration} · {HACKER_PROTOCOL_BOOTCAMP.phases} phases.
            </p>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate('/student-bootcamps/overview')}
            >
              Open Dashboard
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentLearnOverview;
