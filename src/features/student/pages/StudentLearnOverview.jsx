import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiLayers, FiZap } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP } from '../../../data/static/bootcamps/hackerProtocolData';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/learn-overview.css';

const StudentLearnOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="student-page">
      <div className="dashboard-shell">
        <header className="student-hero dashboard-shell-header reveal-on-scroll">
          <div>
            <p className="student-kicker dashboard-shell-kicker">Learn</p>
            <h1 className="dashboard-shell-title">Train through a structured offensive journey.</h1>
            <p className="dashboard-shell-subtitle">
              Start with an overview, enroll in a bootcamp, and progress through validated phases.
            </p>
          </div>
        </header>

        <div className="learn-overview-grid">
          <Card padding="medium" className="student-card learn-overview-card reveal-on-scroll">
            <div className="student-card-header">
              <FiLayers size={20} />
              <h3>Bootcamps</h3>
            </div>
            <p>
              Explore active bootcamps and enroll in the one that matches your training cycle.
            </p>
            <Button variant="primary" size="small" onClick={() => navigate('/student-bootcamps')}>
              Open Bootcamps
            </Button>
          </Card>

          <Card padding="medium" className="student-card learn-overview-card reveal-on-scroll">
            <div className="student-card-header">
              <FiBookOpen size={20} />
              <h3>Resources</h3>
            </div>
            <p>
              Access free materials curated by admins. This section stays separate from paid
              bootcamp content.
            </p>
            <Button variant="secondary" size="small" onClick={() => navigate('/student-resources')}>
              View Resources
            </Button>
          </Card>

          <Card padding="medium" className="student-card learn-overview-card reveal-on-scroll">
            <div className="student-card-header">
              <FiZap size={20} />
              <h3>Active Track</h3>
            </div>
            <p>
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
