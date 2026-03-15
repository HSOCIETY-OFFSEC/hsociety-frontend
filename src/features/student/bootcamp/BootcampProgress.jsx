import React, { useEffect, useMemo, useState } from 'react';
import { FiActivity, FiCheckCircle, FiLayers, FiTarget } from 'react-icons/fi';
import { getStudentOverview } from '../../dashboards/student/student.service';
import { HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';
import BootcampAccessGate from './components/BootcampAccessGate';

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

const BootcampProgress = () => {
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

  const progressMap = useMemo(() => (
    (overview?.modules || []).reduce((acc, module) => {
      acc[Number(module.id)] = Number(module.progress) || 0;
      return acc;
    }, {})
  ), [overview]);

  const statusMeta = useMemo(() => buildStatusMeta(overview), [overview]);

  return (
    <BootcampAccessGate>
      <div className="bc-page">
        <header className="bc-page-header">
          <div className="bc-page-header-inner">
            <div className="bc-header-left">
              <div className="bc-header-icon-wrap">
                <FiTarget size={20} className="bc-header-icon" />
              </div>
              <div>
                <div className="bc-header-breadcrumb">
                  <span className="bc-breadcrumb-org">HSOCIETY</span>
                  <span className="bc-breadcrumb-sep">/</span>
                  <span className="bc-breadcrumb-page">bootcamp-progress</span>
                  <span className="bc-header-visibility">Private</span>
                </div>
                <p className="bc-header-desc">
                  Track room completion and module status. Certification is handled through manual interviews.
                </p>
              </div>
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
                Phase Progress
              </h2>
              <p className="bc-section-desc">Progress is updated after each room quiz submission.</p>
              <div className="bc-item-list">
                {HACKER_PROTOCOL_PHASES.map((phase) => (
                  <article key={phase.moduleId} className="bc-item-row">
                    <div className="bc-item-main">
                      <span className="bc-item-title">Phase {phase.moduleId}: {phase.codename}</span>
                      <span className="bc-item-subtitle">{phase.title}</span>
                    </div>
                    <div className="bc-item-meta">
                      <span className="bc-item-progress">{progressMap[Number(phase.moduleId)] || 0}%</span>
                      <span className={`bc-label ${(progressMap[Number(phase.moduleId)] || 0) >= 100 ? 'bc-label-beta' : 'bc-label-alpha'}`}>
                        {(progressMap[Number(phase.moduleId)] || 0) >= 100 ? 'Complete' : 'In progress'}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <div className="bc-divider" />

            <section className="bc-section">
              <h2 className="bc-section-title">
                <FiCheckCircle size={15} className="bc-section-icon" />
                Final Evaluation
              </h2>
              <p className="bc-section-desc">
                Final certification is completed via a manual interview with instructors after all modules and quizzes are done.
              </p>
              <div className="bc-panel">
                <p className="bc-panel-title">Certification Interview</p>
                <p>Once every phase is complete, the team will schedule your final assessment.</p>
              </div>
            </section>
          </main>

          <aside className="bc-sidebar">
            <div className="bc-sidebar-box">
              <h3 className="bc-sidebar-heading">About</h3>
              <p className="bc-sidebar-about">
                Track phase completion and prepare for the final certification interview.
              </p>
              <div className="bc-sidebar-divider" />
              <ul className="bc-sidebar-list">
                <li><FiCheckCircle size={13} className="bc-sidebar-icon" />Phase milestones</li>
                <li><FiCheckCircle size={13} className="bc-sidebar-icon" />Room tracking</li>
                <li><FiCheckCircle size={13} className="bc-sidebar-icon" />Interview readiness</li>
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
                <span className="bc-topic">progress</span>
                <span className="bc-topic">certification</span>
                <span className="bc-topic">quizzes</span>
                <span className="bc-topic">tracking</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </BootcampAccessGate>
  );
};

export default BootcampProgress;
