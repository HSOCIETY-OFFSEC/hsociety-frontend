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

  return (
    <div className="bootcamp-right-inner">
      <div className="bc-sidebar-box">
        <h3 className="bc-sidebar-heading">Your Progress</h3>
        <p className="bc-sidebar-about">Track overall completion and next lesson.</p>
        <div className="bc-sidebar-divider" />
        <div className="bc-item-main">
          <span className="bc-item-title">
            <FiTarget size={14} />
            {summary.progress}% complete
          </span>
          <span className="bc-item-subtitle">{summary.completedRooms} / {summary.totalRooms} rooms complete</span>
        </div>
        <div className="bc-panel-divider" />
        <div className="bc-item-main">
          <span className="bc-item-title">
            <FiCheckCircle size={14} />
            {summary.nextLabel}
          </span>
          <span className="bc-item-subtitle">{summary.moduleTitle}</span>
        </div>
      </div>
    </div>
  );
};

export default BootcampRightPanel;
