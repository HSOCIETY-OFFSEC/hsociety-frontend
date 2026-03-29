import React, { useEffect, useMemo, useState } from 'react';
import { FiActivity, FiCheckCircle, FiLayers, FiTarget } from 'react-icons/fi';
import { getStudentOverview } from '../../../dashboards/student/services/student.service';
import { HACKER_PROTOCOL_PHASES } from '../../../../data/static/bootcamps/hackerProtocolData';

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
  const [loading, setLoading] = useState(true);
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
  const metaRowClassName = 'flex flex-wrap gap-3';
  const metaPillClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';
  const metaValueClassName = 'font-semibold text-text-primary';
  const sectionClassName = 'flex flex-col gap-4';
  const sectionTitleClassName = 'text-lg font-semibold text-text-primary';
  const sectionDescClassName = 'text-sm text-text-secondary';
  const listClassName = 'overflow-hidden rounded-sm border border-border';
  const rowClassName =
    'flex flex-col gap-3 border-b border-border bg-bg-secondary px-4 py-3 text-sm transition hover:bg-bg-tertiary sm:flex-row sm:items-center sm:justify-between';
  const rowTitleClassName = 'text-sm font-semibold text-text-primary';
  const rowSubtitleClassName = 'text-sm text-text-secondary';
  const rowMetaClassName = 'flex items-center gap-2 text-xs text-text-secondary';
  const labelBaseClassName = 'inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs font-semibold';
  const labelAlphaClassName = `${labelBaseClassName} border-brand/30 bg-brand/10 text-brand`;
  const labelBetaClassName = `${labelBaseClassName} border-status-success/30 bg-status-success/10 text-status-success`;
  const dividerClassName = 'h-px bg-border';
  const panelClassName = 'rounded-lg border border-border bg-bg-secondary p-5 text-sm text-text-secondary';

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await getStudentOverview();
      if (!mounted) return;
      if (response.success) setOverview(response.data);
      if (mounted) setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const progressMap = useMemo(() => (
    (overview?.modules || []).reduce((acc, module) => {
      const key = Number(module.moduleId ?? module.id ?? 0);
      if (key) acc[key] = Number(module.progress) || 0;
      return acc;
    }, {})
  ), [overview]);

  const statusMeta = useMemo(() => buildStatusMeta(overview), [overview]);

  return (
    <div className={pageClassName}>
        <header className={headerClassName}>
          <div className={headerInnerClassName}>
            <div className={headerLeftClassName}>
              <div className={iconWrapClassName}>
                <FiTarget size={20} />
              </div>
              <div>
                <div className={breadcrumbClassName}>
                  <span className={breadcrumbStrongClassName}>HSOCIETY</span>
                  <span>/</span>
                  <span className={breadcrumbStrongClassName}>bootcamp-progress</span>
                  <span className={visibilityClassName}>Private</span>
                </div>
                <p className={headerDescClassName}>
                  Track room completion and module status. Certification is handled through manual interviews.
                </p>
              </div>
            </div>
          </div>
          <div className={metaRowClassName}>
            <span className={metaPillClassName}>
              <FiLayers size={13} className="text-text-tertiary" />
              <span>Phases</span>
              <strong className={metaValueClassName}>{HACKER_PROTOCOL_PHASES.length}</strong>
            </span>
            <span className={metaPillClassName}>
              <FiTarget size={13} className="text-text-tertiary" />
              <span>Completion</span>
              <strong className={metaValueClassName}>{statusMeta.progress}%</strong>
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
                Phase Progress
              </h2>
              <p className={sectionDescClassName}>Progress is updated after each room quiz submission.</p>
              <div className={listClassName}>
                {HACKER_PROTOCOL_PHASES.map((phase) => {
                  const phaseProgress = progressMap[Number(phase.moduleId)] || 0;
                  const isComplete = phaseProgress >= 100;
                  return (
                  <article key={phase.moduleId} className={rowClassName}>
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className={rowTitleClassName}>Phase {phase.moduleId}: {phase.codename}</span>
                      <span className={rowSubtitleClassName}>{phase.title}</span>
                    </div>
                    <div className={rowMetaClassName}>
                      {loading ? (
                        <span>Loading…</span>
                      ) : (
                        <>
                          <span>{phaseProgress}%</span>
                          <span className={isComplete ? labelBetaClassName : labelAlphaClassName}>
                            {isComplete ? 'Complete' : 'In progress'}
                          </span>
                        </>
                      )}
                    </div>
                  </article>
                );
                })}
              </div>
            </section>
            <div className={dividerClassName} />

            <section className={sectionClassName}>
              <h2 className={sectionTitleClassName}>
                <FiCheckCircle size={15} className="mr-2 inline-block text-brand" />
                Final Evaluation
              </h2>
              <p className={sectionDescClassName}>
                Final certification is completed via a manual interview with instructors after all modules and quizzes are done.
              </p>
              <div className={panelClassName}>
                <p className="text-base font-semibold text-text-primary">Certification Interview</p>
                <p className="text-sm text-text-secondary">Once every phase is complete, the team will schedule your final assessment.</p>
              </div>
            </section>
          </main>
        </div>
    </div>
  );
};

export default BootcampProgress;
