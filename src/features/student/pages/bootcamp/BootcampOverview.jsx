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
import { getStudentCourse } from '../../services/course.service';
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
  const [course, setCourse] = useState(null);
  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] pb-16 text-text-primary';
  const headerClassName = 'mb-6 flex flex-col gap-4';
  const headerInnerClassName = 'flex flex-wrap items-center justify-between gap-6';
  const headerLeftClassName = 'flex items-center gap-4';
  const iconWrapClassName = 'flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-bg-secondary text-brand';
  const breadcrumbClassName = 'flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary';
  const breadcrumbStrongClassName = 'font-semibold text-text-secondary';
  const visibilityClassName =
    'rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-text-secondary';
  const headerDescClassName = 'mt-1 text-sm text-text-secondary';
  const headerActionsClassName = 'flex flex-wrap gap-2';
  const buttonPrimaryClassName =
    'inline-flex items-center gap-2 rounded-xs border border-brand bg-brand px-3 py-2 text-xs font-semibold text-ink-onBrand transition hover:bg-brand/90';
  const buttonSecondaryClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-bg-tertiary';
  const metaRowClassName = 'flex flex-wrap gap-3';
  const metaPillClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';
  const metaValueClassName = 'font-semibold text-text-primary';
  const sectionClassName = 'flex flex-col gap-4';
  const sectionTitleClassName = 'text-lg font-semibold text-text-primary';
  const sectionDescClassName = 'text-sm text-text-secondary';
  const cardGridClassName = 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4';
  const cardClassName = 'rounded-lg border border-border bg-bg-secondary p-5 shadow-sm';
  const cardKickerClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const cardTitleClassName = 'text-base font-semibold text-text-primary';
  const cardSubtitleClassName = 'text-sm text-text-secondary';
  const labelBaseClassName = 'inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs font-semibold';
  const labelAlphaClassName = `${labelBaseClassName} border-brand/30 bg-brand/10 text-brand`;
  const labelBetaClassName = `${labelBaseClassName} border-status-success/30 bg-status-success/10 text-status-success`;
  const labelGammaClassName = `${labelBaseClassName} border-status-warning/30 bg-status-warning/10 text-status-warning`;
  const labelDeltaClassName = `${labelBaseClassName} border-status-purple/30 bg-status-purple/10 text-status-purple`;
  const dividerClassName = 'h-px bg-border';
  const panelClassName = 'rounded-lg border border-border bg-bg-secondary p-5';
  const panelKickerClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const panelTitleClassName = 'text-base font-semibold text-text-primary';

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [overviewResponse, courseResponse] = await Promise.all([
        getStudentOverview(),
        getStudentCourse(),
      ]);
      if (!mounted) return;
      if (overviewResponse.success) setOverview(overviewResponse.data);
      if (courseResponse.success) setCourse(courseResponse.data);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const modules = course?.modules?.length ? course.modules : HACKER_PROTOCOL_PHASES;

  const progressMap = useMemo(() => (
    (overview?.modules || []).reduce((acc, module) => {
      acc[Number(module.id)] = Number(module.progress) || 0;
      return acc;
    }, {})
  ), [overview]);

  const nextModule = useMemo(() => {
    return (
      modules.find((phase) => (progressMap[Number(phase.moduleId)] || 0) < 100)
      || modules[modules.length - 1]
    );
  }, [modules, progressMap]);

  const earnedModule = useMemo(() => {
    const completed = modules.filter((phase) => (progressMap[Number(phase.moduleId)] || 0) >= 100);
    return completed.length ? completed[completed.length - 1] : null;
  }, [modules, progressMap]);

  const statusMeta = useMemo(() => buildStatusMeta(overview), [overview]);

  return (
    <div className={pageClassName}>
        <header className={headerClassName}>
          <div className={headerInnerClassName}>
            <div className={headerLeftClassName}>
              <div className={iconWrapClassName}>
                <FiPlayCircle size={20} />
              </div>
              <div>
                <div className={breadcrumbClassName}>
                  <span className={breadcrumbStrongClassName}>HSOCIETY</span>
                  <span>/</span>
                  <span className={breadcrumbStrongClassName}>bootcamp</span>
                  <span className={visibilityClassName}>Private</span>
                </div>
                <p className={headerDescClassName}>{HACKER_PROTOCOL_BOOTCAMP.overview}</p>
              </div>
            </div>
            <div className={headerActionsClassName}>
              <button
                type="button"
                className={buttonPrimaryClassName}
                onClick={() => navigate('/student-bootcamps/live-class')}
              >
                Live Class Hub
              </button>
              <button
                type="button"
                className={buttonSecondaryClassName}
                onClick={() => navigate('/student-bootcamps/modules')}
              >
                Go to Modules
                <FiArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className={metaRowClassName}>
            <span className={metaPillClassName}>
              <FiLayers size={13} className="text-text-tertiary" />
              <span>Phases</span>
              <strong className={metaValueClassName}>{modules.length}</strong>
            </span>
            <span className={metaPillClassName}>
              <FiTarget size={13} className="text-text-tertiary" />
              <span>Completion</span>
              <strong className={metaValueClassName}>{statusMeta.progress}%</strong>
            </span>
            <span className={metaPillClassName}>
              <FiBookOpen size={13} className="text-text-tertiary" />
              <span>Rooms</span>
              <strong className={metaValueClassName}>{statusMeta.completedRooms}/{statusMeta.totalRooms}</strong>
            </span>
            <span className={metaPillClassName}>
              <FiActivity size={13} className="text-text-tertiary" />
              <span>Status</span>
              <strong className={metaValueClassName}>{statusMeta.value}</strong>
            </span>
          </div>
        </header>

        <div className="grid gap-6">
          <main>
            <section className={sectionClassName}>
              <h2 className={sectionTitleClassName}>
                <FiLayers size={15} className="mr-2 inline-block text-brand" />
                Bootcamp Overview
              </h2>
              <p className={sectionDescClassName}>
                {HACKER_PROTOCOL_BOOTCAMP.subtitle} · {HACKER_PROTOCOL_BOOTCAMP.title} Learning App
              </p>
              <div className={cardGridClassName}>
                <article className={cardClassName}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={cardKickerClassName}>Progression</p>
                      <h3 className={cardTitleClassName}>Structured phases</h3>
                      <p className={cardSubtitleClassName}>Modules unlock sequentially. Finish each room quiz to continue.</p>
                    </div>
                    <span className={labelAlphaClassName}>Guided</span>
                  </div>
                </article>
                <article className={cardClassName}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={cardKickerClassName}>Live Class</p>
                      <h3 className={cardTitleClassName}>Instructor support</h3>
                      <p className={cardSubtitleClassName}>Join instructor-led sessions directly from each room.</p>
                    </div>
                    <span className={labelBetaClassName}>Weekly</span>
                  </div>
                </article>
                <article className={cardClassName}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={cardKickerClassName}>Next up</p>
                      <h3 className={cardTitleClassName}>Phase {nextModule?.moduleId}</h3>
                      <p className={cardSubtitleClassName}>{nextModule?.title}</p>
                    </div>
                    <span className={labelDeltaClassName}>Priority</span>
                  </div>
                </article>
                <article className={cardClassName}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={cardKickerClassName}>Role unlocked</p>
                      <h3 className={cardTitleClassName}>
                        {earnedModule?.roleTitle || 'Candidate'}
                      </h3>
                      <p className={cardSubtitleClassName}>
                        {earnedModule?.badge || 'Complete phases to unlock badges.'}
                      </p>
                    </div>
                    <span className={labelBetaClassName}>Earned</span>
                  </div>
                </article>
              </div>
            </section>
            <div className={dividerClassName} />

            <section className={sectionClassName}>
              <h2 className={sectionTitleClassName}>
                <FiClock size={15} className="mr-2 inline-block text-brand" />
                Momentum Check
              </h2>
              <p className={sectionDescClassName}>Pick up where you left off and keep progression steady.</p>
              <div className={panelClassName}>
                <p className={panelKickerClassName}>Recommended next action</p>
                <h3 className={panelTitleClassName}>Continue Phase {nextModule?.moduleId}</h3>
                <p className="text-sm text-text-secondary">{nextModule?.title}</p>
                <button
                  type="button"
                  className={buttonPrimaryClassName}
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
