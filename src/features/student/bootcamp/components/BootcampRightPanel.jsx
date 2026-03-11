import React, { useMemo } from 'react';
import { FiCheckCircle, FiTarget } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import { HACKER_PROTOCOL_PHASES } from '../../../../data/bootcamps/hackerProtocolData';

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
      <Card padding="medium" className="bootcamp-right-card">
        <div className="bootcamp-right-header">
          <FiTarget size={16} />
          <h3>Your Progress</h3>
        </div>
        <div className="bootcamp-right-stat">
          <strong>{summary.progress}%</strong>
          <span>Bootcamp completion</span>
        </div>
        <div className="bootcamp-right-sub">
          <span>{summary.completedRooms} / {summary.totalRooms} rooms complete</span>
        </div>
        <div className="bootcamp-right-next">
          <FiCheckCircle size={14} />
          <span>{summary.nextLabel}</span>
        </div>
        <p className="bootcamp-right-module">{summary.moduleTitle}</p>
      </Card>
    </div>
  );
};

export default BootcampRightPanel;
