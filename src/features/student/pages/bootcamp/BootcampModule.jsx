import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLayers,
  FiLock,
  FiPlayCircle,
  FiTarget
} from 'react-icons/fi';
import { getStudentOverview } from '../../../dashboards/student/services/student.service';
import { completeLearningCtf } from '../../../dashboards/student/services/student.service';
import { getStudentCourse } from '../../services/course.service';
import { getHackerProtocolModule } from '../../../../data/static/bootcamps/hackerProtocolData';

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

const BootcampModule = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const id = Number(moduleId);
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
  const headerActionsClassName = 'flex flex-wrap gap-2';
  const buttonPrimaryClassName =
    'inline-flex items-center gap-2 rounded-xs border border-brand bg-brand px-3 py-2 text-xs font-semibold text-ink-onBrand transition hover:bg-brand/90';
  const buttonSecondaryClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-bg-tertiary';
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
  const labelBaseClassName = 'inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs font-semibold';
  const labelAlphaClassName = `${labelBaseClassName} border-brand/30 bg-brand/10 text-brand`;
  const labelBetaClassName = `${labelBaseClassName} border-status-success/30 bg-status-success/10 text-status-success`;
  const labelGammaClassName = `${labelBaseClassName} border-status-warning/30 bg-status-warning/10 text-status-warning`;
  const dividerClassName = 'h-px bg-border';

  const moduleMeta = getHackerProtocolModule(id);

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
  }, [id]);

  const module = useMemo(() =>
    course?.modules?.find((item) => item.moduleId === id),
  [course, id]);

  const moduleProgress = useMemo(() =>
    overview?.modules?.find((item) => Number(item.id) === id),
  [overview, id]);

  const roomsCompleted = Number(moduleProgress?.roomsCompleted) || 0;
  const roomsTotal = Number(moduleProgress?.roomsTotal) || module?.rooms?.length || 0;
  const ctfCompleted = Boolean(moduleProgress?.ctfCompleted);

  const statusMeta = useMemo(() => buildStatusMeta(overview), [overview]);

  if (!module || !moduleMeta) {
    return (
      <div className={pageClassName}>
        <div className={panelClassName}>
          <h3 className="text-base font-semibold text-text-primary">Module not found</h3>
          <button
            type="button"
            className={buttonSecondaryClassName}
            onClick={() => navigate('/student-bootcamps/modules')}
          >
            <FiArrowLeft size={14} />
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

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
                  <span className={breadcrumbStrongClassName}>phase-{module.moduleId}</span>
                  <span className={visibilityClassName}>Private</span>
                </div>
                <p className={headerDescClassName}>{module?.description || moduleMeta.description}</p>
              </div>
            </div>
            <div className={headerActionsClassName}>
              <button
                type="button"
                className={buttonPrimaryClassName}
                onClick={() => {
                  const nextRoom = module.rooms?.[roomsCompleted] || module.rooms?.[0];
                  if (!nextRoom) return;
                  navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${nextRoom.roomId}`);
                }}
              >
                <FiPlayCircle size={14} />
                Continue Module
              </button>
              <button
                type="button"
                className={buttonSecondaryClassName}
                onClick={() => navigate('/student-bootcamps/modules')}
              >
                <FiArrowLeft size={14} />
                Back to Modules
              </button>
            </div>
          </div>
          <div className={metaRowClassName}>
            <span className={metaPillClassName}>
              <FiTarget size={13} className="text-text-tertiary" />
              <span>Progress</span>
              <strong className={metaValueClassName}>{roomsCompleted}/{roomsTotal}</strong>
            </span>
            <span className={metaPillClassName}>
              <FiLayers size={13} className="text-text-tertiary" />
              <span>Phase</span>
              <strong className={metaValueClassName}>{module.moduleId}</strong>
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
                Rooms
              </h2>
              <p className={sectionDescClassName}>Complete room quizzes in order to unlock the next lesson.</p>
              <div className={cardGridClassName}>
                {(module.rooms || []).map((room, index) => {
                  const isCompleted = index < roomsCompleted;
                  const isCurrent = index === roomsCompleted;
                  const isLocked = index > roomsCompleted;
                  const labelClass = isCompleted
                    ? labelBetaClassName
                    : isCurrent
                      ? labelAlphaClassName
                      : labelGammaClassName;

                  return (
                    <button
                      key={room.roomId}
                      type="button"
                      className={`${cardBaseClassName}${isLocked ? ' opacity-60 cursor-not-allowed' : ' hover:-translate-y-0.5 hover:border-brand/40'}`}
                      onClick={() => {
                        if (isLocked) {
                          setStatusMessage('Complete the previous room quiz to unlock this lesson.');
                          return;
                        }
                        setStatusMessage('');
                        navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${room.roomId}`);
                      }}
                    >
                      <div className={cardHeaderClassName}>
                        <div>
                          <p className={cardKickerClassName}>Room {room.roomId}</p>
                          <h3 className={cardTitleClassName}>{room.title}</h3>
                          <p className={cardSubtitleClassName}>
                            {isCompleted ? 'Completed' : isCurrent ? 'Next up' : 'Locked'}
                          </p>
                        </div>
                        <span className={labelClass}>
                          {isCompleted ? (
                            <>
                              <FiCheckCircle size={12} />
                              Completed
                            </>
                          ) : isCurrent ? (
                            'Current'
                          ) : (
                            <>
                              <FiLock size={12} />
                              Locked
                            </>
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
            <div className={dividerClassName} />

            <section className={sectionClassName}>
              <h2 className={sectionTitleClassName}>
                <FiTarget size={15} className="mr-2 inline-block text-brand" />
                CTF Completion
              </h2>
              <p className={sectionDescClassName}>
                Finish the module CTF to close this phase and unlock the next one.
              </p>
              <div className={panelClassName}>
                <p className="text-sm text-text-secondary">{module.ctf}</p>
                <button
                  type="button"
                  className={buttonPrimaryClassName}
                  disabled={ctfCompleted || roomsCompleted < roomsTotal}
                  onClick={async () => {
                    const response = await completeLearningCtf(module.moduleId);
                    if (response.success) {
                      const overviewResponse = await getStudentOverview();
                      if (overviewResponse.success) setOverview(overviewResponse.data);
                      setStatusMessage('CTF completed. Phase unlocked.');
                    } else {
                      setStatusMessage(response.error || 'Unable to complete CTF.');
                    }
                  }}
                >
                  {ctfCompleted ? 'CTF Completed' : 'Mark CTF Complete'}
                </button>
              </div>
            </section>
          </main>
        </div>
    </div>
  );
};

export default BootcampModule;
