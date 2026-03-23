import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiPlayCircle,
  FiTarget
} from 'react-icons/fi';
import { getStudentOverview } from '../../../dashboards/student/services/student.service';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../../data/static/bootcamps/hackerProtocolData';

const buildStatusMeta = (overview) => {
  const modules = overview?.modules || [];
  const totalRooms = modules.reduce((sum, module) => sum + (Number(module.roomsTotal) || 0), 0);
  const completedRooms = modules.reduce((sum, module) => sum + (Number(module.roomsCompleted) || 0), 0);
  const progress = totalRooms ? Math.round((completedRooms / totalRooms) * 100) : 0;
  const isPaused = overview?.bootcampStatus === 'not_enrolled'
    || overview?.bootcampPaymentStatus === 'unpaid';

  if (isPaused) {
    return {
      label: 'BOOTCAMP STATUS',
      value: 'PAUSED',
      note: 'Complete enrollment to unlock phases.',
      fill: 20,
      paused: true,
      progress,
      completedRooms,
      totalRooms
    };
  }

  if (progress >= 100 && totalRooms) {
    return {
      label: 'BOOTCAMP STATUS',
      value: 'COMPLETE',
      note: 'All phases completed. Ready for advanced tracks.',
      fill: 100,
      paused: false,
      progress,
      completedRooms,
      totalRooms
    };
  }

  return {
    label: 'BOOTCAMP STATUS',
    value: progress > 0 ? 'ACTIVE' : 'OPEN',
    note: progress > 0 ? 'Current phase in progress.' : 'Choose a phase to begin.',
    fill: progress > 0 ? 70 : 40,
    paused: false,
    progress,
    completedRooms,
    totalRooms
  };
};

const BootcampOverview = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await getStudentOverview();
      if (!mounted) return;
      if (response.success) setOverview(response.data);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const nextModule = useMemo(() => {
    const progressMap = (overview?.modules || []).reduce((acc, module) => {
      acc[Number(module.id)] = Number(module.progress) || 0;
      return acc;
    }, {});

    return (
      HACKER_PROTOCOL_PHASES.find((phase) => (progressMap[Number(phase.moduleId)] || 0) < 100)
      || HACKER_PROTOCOL_PHASES[HACKER_PROTOCOL_PHASES.length - 1]
    );
  }, [overview]);

  const statusMeta = useMemo(() => buildStatusMeta(overview), [overview]);

  return (
    <div className="bc-page">
        <header className="bc-page-header">
          <div className="bc-page-header-inner">
            <div className="bc-header-left">
              <div className="bc-header-icon-wrap">
                <FiPlayCircle size={20} className="bc-header-icon" />
              </div>
              <div>
                <div className="bc-header-breadcrumb">
                  <span className="bc-breadcrumb-org">HSOCIETY</span>
                  <span className="bc-breadcrumb-sep">/</span>
                  <span className="bc-breadcrumb-page">bootcamp</span>
                  <span className="bc-header-visibility">Private</span>
                </div>
                <p className="bc-header-desc">{HACKER_PROTOCOL_BOOTCAMP.overview}</p>
              </div>
            </div>
            <div className="bc-header-actions">
              <button
                type="button"
                className="bc-btn bc-btn-primary"
                onClick={() => navigate('/student-bootcamps/live-class')}
              >
                Live Class Hub
              </button>
              <button
                type="button"
                className="bc-btn bc-btn-secondary"
                onClick={() => navigate('/student-bootcamps/modules')}
              >
                Go to Modules
                <FiArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="bc-header-meta">
            <span className="bc-meta-pill">
              <FiLayers size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Phases</span>
              <strong className="bc-meta-value">{HACKER_PROTOCOL_PHASES.length}</strong>
            </span>
            <span className="bc-meta-pill">
              <FiTarget size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Completion</span>
              <strong className="bc-meta-value">{statusMeta.progress}%</strong>
            </span>
            <span className="bc-meta-pill">
              <FiBookOpen size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Rooms</span>
              <strong className="bc-meta-value">{statusMeta.completedRooms}/{statusMeta.totalRooms}</strong>
            </span>
            <span className="bc-meta-pill">
              <FiActivity size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Status</span>
              <strong className="bc-meta-value">{statusMeta.value}</strong>
            </span>
          </div>
        </header>

        <div className="bc-layout">
          <main className="bc-main">
            <section className="bc-section">
              <h2 className="bc-section-title">
                <FiLayers size={15} className="bc-section-icon" />
                Bootcamp Overview
              </h2>
              <p className="bc-section-desc">
                {HACKER_PROTOCOL_BOOTCAMP.subtitle} · {HACKER_PROTOCOL_BOOTCAMP.title} Learning App
              </p>
              <div className="bc-card-grid">
                <article className="bc-card">
                  <div className="bc-card-header">
                    <div>
                      <p className="bc-card-kicker">Progression</p>
                      <h3 className="bc-card-title">Structured phases</h3>
                      <p className="bc-card-subtitle">Modules unlock sequentially. Finish each room quiz to continue.</p>
                    </div>
                    <span className="bc-label bc-label-alpha">Guided</span>
                  </div>
                </article>
                <article className="bc-card">
                  <div className="bc-card-header">
                    <div>
                      <p className="bc-card-kicker">Live Class</p>
                      <h3 className="bc-card-title">Instructor support</h3>
                      <p className="bc-card-subtitle">Join instructor-led sessions directly from each room.</p>
                    </div>
                    <span className="bc-label bc-label-beta">Weekly</span>
                  </div>
                </article>
                <article className="bc-card">
                  <div className="bc-card-header">
                    <div>
                      <p className="bc-card-kicker">Next up</p>
                      <h3 className="bc-card-title">Phase {nextModule?.moduleId}</h3>
                      <p className="bc-card-subtitle">{nextModule?.title}</p>
                    </div>
                    <span className="bc-label bc-label-delta">Priority</span>
                  </div>
                </article>
              </div>
            </section>
            <div className="bc-divider" />

            <section className="bc-section">
              <h2 className="bc-section-title">
                <FiClock size={15} className="bc-section-icon" />
                Momentum Check
              </h2>
              <p className="bc-section-desc">Pick up where you left off and keep progression steady.</p>
              <div className="bc-panel">
                <p className="bc-panel-kicker">Recommended next action</p>
                <h3 className="bc-panel-title">Continue Phase {nextModule?.moduleId}</h3>
                <p>{nextModule?.title}</p>
                <button
                  type="button"
                  className="bc-btn bc-btn-primary"
                  onClick={() => navigate('/student-bootcamps/modules')}
                >
                  Resume Training
                  <FiArrowRight size={14} />
                </button>
              </div>
            </section>
          </main>
        </div>
    </div>
  );
};

export default BootcampOverview;
