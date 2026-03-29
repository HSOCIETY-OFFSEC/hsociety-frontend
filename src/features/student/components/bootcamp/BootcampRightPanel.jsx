import React, { useMemo } from 'react';
import { FiCheckCircle, FiTarget } from 'react-icons/fi';
import { HACKER_PROTOCOL_PHASES } from '../../../../data/static/bootcamps/hackerProtocolData';

const BootcampRightPanel = ({ overview }) => {
  const summary = useMemo(() => {
    const modules = overview?.modules || [];
    const totalRooms = modules.reduce((sum, module) => sum + (module.roomsTotal || 0), 0);
    const completedRooms = modules.reduce((sum, module) => sum + (module.roomsCompleted || 0), 0);
    const progress = totalRooms ? Math.round((completedRooms / totalRooms) * 100) : 0;

    const currentModule =
      modules.find((module) => (Number(module.progress) || 0) < 100) || modules[modules.length - 1];
    const moduleMeta = HACKER_PROTOCOL_PHASES.find(
      (phase) => Number(phase.moduleId) === Number(currentModule?.id)
    );

    return {
      progress,
      totalRooms,
      completedRooms,
      moduleTitle: moduleMeta?.title || currentModule?.title || 'Bootcamp module',
      nextLabel: currentModule
        ? `Phase ${currentModule.id} · Room ${Math.min(
            currentModule.roomsCompleted + 1,
            currentModule.roomsTotal || 1
          )}`
        : 'Next lesson'
    };
  }, [overview]);

  const panelClassName = 'rounded-lg border border-border bg-bg-secondary p-4';
  const headingClassName = 'text-sm font-semibold text-text-primary';
  const bodyClassName = 'text-sm text-text-secondary';
  const dividerClassName = 'my-3 h-px bg-border';
  const itemTitleClassName = 'flex items-center gap-2 text-sm font-semibold text-text-primary';
  const itemSubtitleClassName = 'text-xs text-text-tertiary';

  return (
    <div className="flex flex-col gap-4">
      <div className={panelClassName}>
        <h3 className={headingClassName}>Your Progress</h3>
        <p className={bodyClassName}>Track overall completion and next lesson.</p>
        <div className={dividerClassName} />
        <div className="flex flex-col gap-1">
          <span className={itemTitleClassName}>
            <FiTarget size={14} className="text-text-tertiary" />
            {summary.progress}% complete
          </span>
          <span className={itemSubtitleClassName}>{summary.completedRooms} / {summary.totalRooms} rooms complete</span>
        </div>
        <div className={dividerClassName} />
        <div className="flex flex-col gap-1">
          <span className={itemTitleClassName}>
            <FiCheckCircle size={14} className="text-text-tertiary" />
            {summary.nextLabel}
          </span>
          <span className={itemSubtitleClassName}>{summary.moduleTitle}</span>
        </div>
      </div>
    </div>
  );
};

export default BootcampRightPanel;
