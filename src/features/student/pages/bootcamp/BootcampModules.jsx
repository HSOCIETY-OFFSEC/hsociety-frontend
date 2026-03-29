import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiCheckCircle, FiLayers, FiLock, FiTarget } from 'react-icons/fi';
import { getStudentCourse } from '../../services/course.service';
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

const BootcampModules = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [course, setCourse] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
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
  const panelClassName = 'rounded-lg border border-border bg-bg-secondary p-5 text-sm text-text-secondary';
  const sectionClassName = 'flex flex-col gap-4';
  const sectionTitleClassName = 'text-lg font-semibold text-text-primary';
  const sectionDescClassName = 'text-sm text-text-secondary';
  const cardGridClassName = 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3';
  const cardBaseClassName =
    'flex w-full flex-col gap-4 rounded-lg border border-border bg-bg-secondary p-5 text-left shadow-sm transition';
  const cardHeaderClassName = 'flex items-start justify-between gap-4';
  const cardKickerClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const cardTitleClassName = 'text-base font-semibold text-text-primary';
  const cardSubtitleClassName = 'text-sm text-text-secondary';
  const cardMetaClassName = 'flex items-center justify-between text-sm text-text-secondary';
  const labelBaseClassName = 'inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs font-semibold';
  const labelAlphaClassName = `${labelBaseClassName} border-brand/30 bg-brand/10 text-brand`;
  const labelGammaClassName = `${labelBaseClassName} border-status-warning/30 bg-status-warning/10 text-status-warning`;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [overviewResponse, courseResponse] = await Promise.all([
        getStudentOverview(),
        getStudentCourse()
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

  const modules = useMemo(() => {
    const progressMap = (overview?.modules || []).reduce((acc, module) => {
      acc[Number(module.id)] = module;
      return acc;
    }, {});

    return (course?.modules || []).map((module, index) => {
      const meta = HACKER_PROTOCOL_PHASES.find((phase) => phase.moduleId === module.moduleId);
      const progress = Number(progressMap[module.moduleId]?.progress) || 0;
      const roomsCompleted = Number(progressMap[module.moduleId]?.roomsCompleted) || 0;
      const roomsTotal = Number(progressMap[module.moduleId]?.roomsTotal) || module.rooms.length || 0;
      const previousModule = course?.modules?.[index - 1];
      const previousProgress = previousModule
        ? Number(progressMap[previousModule.moduleId]?.progress) || 0
        : 100;

      return {
        ...module,
        meta,
        progress,
        roomsCompleted,
        roomsTotal,
        locked: previousProgress < 100
      };
    });
  }, [course, overview]);

  const statusMeta = useMemo(() => buildStatusMeta(overview), [overview]);

  return (
    <div className={pageClassName}>
        <header className={headerClassName}>
          <div className={headerInnerClassName}>
            <div className={headerLeftClassName}>
              <div className={iconWrapClassName}>
                <FiLayers size={20} />
              </div>
              <div>
                <div className={breadcrumbClassName}>
                  <span className={breadcrumbStrongClassName}>HSOCIETY</span>
                  <span>/</span>
                  <span className={breadcrumbStrongClassName}>bootcamp-modules</span>
                  <span className={visibilityClassName}>Private</span>
                </div>
                <p className={headerDescClassName}>
                  Follow the guided progression. Each module unlocks after the previous quiz path is complete.
                </p>
              </div>
            </div>
          </div>
          <div className={metaRowClassName}>
            <span className={metaPillClassName}>
              <FiLayers size={13} className="text-text-tertiary" />
              <span>Modules</span>
              <strong className={metaValueClassName}>{modules.length}</strong>
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
            {statusMessage && (
              <div className={panelClassName}>
                <p>{statusMessage}</p>
              </div>
            )}

            <section className={sectionClassName}>
              <h2 className={sectionTitleClassName}>
                <FiLayers size={15} className="mr-2 inline-block text-brand" />
                Modules
              </h2>
              <p className={sectionDescClassName}>Select a phase to view lessons and rooms.</p>
              <div className={cardGridClassName}>
                {modules.map((module) => (
                  <button
                    key={module.moduleId}
                    type="button"
                    className={`${cardBaseClassName}${module.locked ? ' opacity-60 cursor-not-allowed' : ' hover:-translate-y-0.5 hover:border-brand/40'}`}
                    onClick={() => {
                      if (module.locked) {
                        setStatusMessage('Complete the previous module to unlock this phase.');
                        return;
                      }
                      setStatusMessage('');
                      navigate(`/student-bootcamps/modules/${module.moduleId}`);
                    }}
                  >
                    <div className={cardHeaderClassName}>
                      <div>
                        <p className={cardKickerClassName}>Phase {module.moduleId}</p>
                        <h3 className={cardTitleClassName}>{module.title || module.meta?.title}</h3>
                        <p className={cardSubtitleClassName}>{module.codename || module.meta?.codename || 'Bootcamp phase'}</p>
                      </div>
                      <span className={module.locked ? labelGammaClassName : labelAlphaClassName}>
                        {module.locked ? (
                          <>
                            <FiLock size={12} />
                            Locked
                          </>
                        ) : (
                          <>
                            <FiCheckCircle size={12} />
                            Open
                          </>
                        )}
                      </span>
                    </div>
                    <div className={cardMetaClassName}>
                      <span>Rooms</span>
                      <strong>{module.roomsCompleted}/{module.roomsTotal}</strong>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </main>
        </div>
    </div>
  );
};

export default BootcampModules;
