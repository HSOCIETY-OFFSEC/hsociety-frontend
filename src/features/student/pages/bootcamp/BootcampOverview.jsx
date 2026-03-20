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
import BootcampAccessGate from '../../components/bootcamp/BootcampAccessGate';

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
    <BootcampAccessGate>
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
                onClick={() => navigate('/student-bootcamps/modules')}
              >
                Go to Modules
                <FiArrowRight size={14} />
              </button>
              <button
                type="button"
                className="bc-btn bc-btn-secondary"
                onClick={() => navigate('/student-bootcamps/live-class')}
              >
                Live Class Hub
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
              <div className="bc-item-list">
                <article className="bc-item-row">
                  <div className="bc-item-main">
                    <span className="bc-item-title">Structured progression</span>
                    <span className="bc-item-subtitle">Modules unlock sequentially. Finish each room quiz to continue.</span>
                  </div>
                  <span className="bc-label bc-label-alpha">Guided</span>
                </article>
                <article className="bc-item-row">
                  <div className="bc-item-main">
                    <span className="bc-item-title">Live class support</span>
                    <span className="bc-item-subtitle">Join instructor-led sessions directly from each room.</span>
                  </div>
                  <span className="bc-label bc-label-beta">Weekly</span>
                </article>
                <article className="bc-item-row">
                  <div className="bc-item-main">
                    <span className="bc-item-title">Next up</span>
                    <span className="bc-item-subtitle">
                      Phase {nextModule?.moduleId}: {nextModule?.title}
                    </span>
                  </div>
                  <span className="bc-label bc-label-delta">Priority</span>
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

          <aside className="bc-sidebar">
            <div className="bc-sidebar-box">
              <h3 className="bc-sidebar-heading">About</h3>
              <p className="bc-sidebar-about">
                A structured offensive-security bootcamp with live classes, quiz gating, and hands-on rooms.
              </p>
              <div className="bc-sidebar-divider" />
              <ul className="bc-sidebar-list">
                <li><FiCheckCircle size={13} className="bc-sidebar-icon" />Phased roadmap</li>
                <li><FiCheckCircle size={13} className="bc-sidebar-icon" />Room-by-room guidance</li>
                <li><FiCheckCircle size={13} className="bc-sidebar-icon" />Instructor check-ins</li>
              </ul>
            </div>

            <div className={`bc-sidebar-box bc-status-box ${statusMeta.paused ? 'bc-status-paused' : ''}`}>
              <div className="bc-status-row">
                <span className="bc-status-dot" />
                <span className="bc-status-label">{statusMeta.label}</span>
              </div>
              <strong className="bc-status-value">{statusMeta.value}</strong>
              <div className="bc-status-track">
                <div className="bc-status-fill" style={{ width: `${statusMeta.fill}%` }} />
              </div>
              <p className="bc-status-note">{statusMeta.note}</p>
            </div>

            <div className="bc-sidebar-box">
              <h3 className="bc-sidebar-heading">Topics</h3>
              <div className="bc-topics">
                <span className="bc-topic">bootcamp</span>
                <span className="bc-topic">phases</span>
                <span className="bc-topic">live-class</span>
                <span className="bc-topic">rooms</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </BootcampAccessGate>
  );
};

export default BootcampOverview;
