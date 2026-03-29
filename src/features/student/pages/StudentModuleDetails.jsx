import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiPlayCircle } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { getStudentOverview } from '../../dashboards/student/services/student.service';
import {
  getHackerProtocolModule,
  HACKER_PROTOCOL_BOOTCAMP,
} from '../../../data/static/bootcamps/hackerProtocolData';

const StudentModuleDetails = () => {
  const { moduleId } = useParams();
  const id = Number(moduleId);
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);

  const module = getHackerProtocolModule(id);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const overviewResponse = await getStudentOverview();
      if (!mounted) return;
      if (overviewResponse.success) setOverview(overviewResponse.data);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const currentOverviewModule = useMemo(
    () => overview?.modules?.find((item) => Number(item.id) === id),
    [overview, id]
  );

  const roomsTotal = currentOverviewModule?.roomsTotal || module?.rooms?.length || 0;
  const roomsCompleted = currentOverviewModule?.roomsCompleted || 0;
  const nextRoom = module?.rooms?.[Math.min(roomsCompleted, Math.max(roomsTotal - 1, 0))];
  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] pb-16 text-text-primary';
  const shellClassName = 'grid gap-4';
  const heroClassName =
    'grid gap-4 rounded-lg border border-border p-5 lg:grid-cols-[1.6fr_0.7fr]';
  const heroLeftClassName = 'flex flex-col gap-2';
  const heroProgressClassName = 'flex flex-col gap-1 text-xs text-text-tertiary';
  const heroActionsClassName = 'mt-4 flex flex-wrap gap-2';
  const heroImageClassName = 'overflow-hidden rounded-md border border-border';
  const listClassName = 'grid gap-4';
  const roomListClassName = 'grid gap-2';
  const roomItemBaseClass =
    'flex items-center gap-3 rounded-sm border border-border bg-bg-secondary px-3 py-2 text-left text-sm text-text-secondary';

  if (!module) {
    return (
      <div className={pageClassName}>
        <Card padding="large" shadow="small" className="border-border bg-card">
          <h1 className="text-xl font-semibold text-text-primary">Module not found</h1>
          <Button variant="secondary" size="small" onClick={() => navigate('/student-bootcamps/overview')}>
            <FiArrowLeft size={16} />
            Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={pageClassName}>
      <div className={shellClassName}>
        <header
          className={heroClassName}
          style={{
            '--module-color': module.color,
            background: 'linear-gradient(145deg, color-mix(in srgb, var(--module-color) 20%, var(--card-bg)), var(--card-bg))'
          }}
        >
          <div className={heroLeftClassName}>
            <p className="text-sm text-text-secondary">{HACKER_PROTOCOL_BOOTCAMP.title} · Phase {module.moduleId}</p>
            <h1 className="text-2xl font-semibold text-text-primary">{module.title}</h1>
            <p className="text-sm text-text-secondary">{module.description}</p>
            <div className={heroProgressClassName}>
              <span>Progress</span>
              <strong className="text-sm text-text-primary">{roomsCompleted} / {roomsTotal} rooms completed</strong>
            </div>
            <div className={heroActionsClassName}>
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  if (!nextRoom) return;
                  navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${nextRoom.roomId}`);
                }}
              >
                <FiPlayCircle size={15} />
                Continue Phase
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={() => navigate('/student-bootcamps/overview')}
              >
                <FiArrowLeft size={15} />
                Back to Dashboard
              </Button>
            </div>
          </div>
          <div className={heroImageClassName}>
            <img src={module.emblem} alt={`${module.codename} emblem`} className="h-full w-full object-cover" />
          </div>
        </header>

        <section className={listClassName}>
          <Card padding="medium" shadow="small" className="border-border bg-card">
            <h3 className="text-sm font-semibold text-text-primary">Room Progression</h3>
            <div className={roomListClassName}>
              {(module.rooms || []).map((room, index) => {
                const isDone = index < roomsCompleted;
                const isCurrent = index === roomsCompleted;
                const isLocked = index > roomsCompleted;
                const stateClassName = isDone
                  ? 'border-status-success/40'
                  : isCurrent
                    ? 'border-brand/50 bg-brand/5 text-text-primary'
                    : isLocked
                      ? 'opacity-70'
                      : '';
                return (
                  <div
                    key={room.roomId}
                    className={`${roomItemBaseClass} ${stateClassName}`}
                  >
                    <FiCheckCircle size={15} className="text-text-tertiary" />
                    <span>
                      <strong className="block text-sm text-text-primary">Room {room.roomId} — {room.title}</strong>
                      <small className="block text-xs text-text-tertiary">{isDone ? 'Completed' : isCurrent ? 'Next up' : 'Locked'}</small>
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      </div>

    </div>
  );
};

export default StudentModuleDetails;
