import React, { useEffect, useMemo, useState } from 'react';
import { FiActivity, FiCheckCircle, FiVideo } from 'react-icons/fi';
import { listNotifications } from '../../services/notifications.service';
import { getStudentCourse } from '../../services/course.service';
import { getStudentOverview } from '../../../dashboards/student/services/student.service';
import LiveClassCard from '../../components/bootcamp/LiveClassCard';

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

const BootcampLiveClass = () => {
  const [overview, setOverview] = useState(null);
  const [notifications, setNotifications] = useState([]);
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
  const metaRowClassName = 'flex flex-wrap gap-3';
  const metaPillClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';
  const metaValueClassName = 'font-semibold text-text-primary';
  const sectionClassName = 'flex flex-col gap-4';
  const sectionTitleClassName = 'text-lg font-semibold text-text-primary';
  const sectionDescClassName = 'text-sm text-text-secondary';
  const panelClassName = 'rounded-lg border border-border bg-bg-secondary p-5 text-sm text-text-secondary';
  const gridClassName = 'grid gap-4 md:grid-cols-2';

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [notificationResponse, courseResponse, overviewResponse] = await Promise.all([
        listNotifications(),
        getStudentCourse(),
        getStudentOverview()
      ]);
      if (!mounted) return;
      if (notificationResponse.success) setNotifications(notificationResponse.data || []);
      if (courseResponse.success) setCourse(courseResponse.data);
      if (overviewResponse.success) setOverview(overviewResponse.data);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const notificationClasses = useMemo(() =>
    (notifications || []).filter((item) => item.type === 'bootcamp_meeting'),
  [notifications]);

  const roomClasses = useMemo(() => {
    const rooms = (course?.modules || []).flatMap((module) => module.rooms || []);
    return rooms
      .filter((room) => room.liveClass)
      .map((room) => ({
        title: room.liveClass?.title || room.title,
        instructor: room.liveClass?.instructor,
        time: room.liveClass?.time,
        link: room.liveClass?.link
      }));
  }, [course]);

  const statusMeta = useMemo(() => buildStatusMeta(overview), [overview]);

  return (
    <div className={pageClassName}>
        <header className={headerClassName}>
          <div className={headerInnerClassName}>
            <div className={headerLeftClassName}>
              <div className={iconWrapClassName}>
                <FiVideo size={20} />
              </div>
              <div>
                <div className={breadcrumbClassName}>
                  <span className={breadcrumbStrongClassName}>HSOCIETY</span>
                  <span>/</span>
                  <span className={breadcrumbStrongClassName}>bootcamp-live-class</span>
                  <span className={visibilityClassName}>Private</span>
                </div>
                <p className={headerDescClassName}>Join instructor-led sessions. Links appear when instructors publish them.</p>
              </div>
            </div>
          </div>
          <div className={metaRowClassName}>
            <span className={metaPillClassName}>
              <FiVideo size={13} className="text-text-tertiary" />
              <span>Sessions</span>
              <strong className={metaValueClassName}>{notificationClasses.length + roomClasses.length}</strong>
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
                <FiVideo size={15} className="mr-2 inline-block text-brand" />
                Live Sessions
              </h2>
              <p className={sectionDescClassName}>Join live classes or review upcoming room sessions.</p>
              <div className={gridClassName}>
                {(notificationClasses.length === 0 && roomClasses.length === 0) && (
                  <div className={panelClassName}>
                    <p>Live class schedules will appear here when posted.</p>
                  </div>
                )}

                {notificationClasses.map((item) => (
                  <LiveClassCard
                    key={item.id}
                    title={item.title}
                    instructor={item.metadata?.instructor || 'Admin'}
                    time={item.metadata?.time}
                    link={item.metadata?.meetUrl}
                  />
                ))}

                {roomClasses.map((item, index) => (
                  <LiveClassCard
                    key={`room-class-${index}`}
                    title={item.title}
                    instructor={item.instructor}
                    time={item.time}
                    link={item.link}
                  />
                ))}
              </div>
            </section>
          </main>
        </div>
    </div>
  );
};

export default BootcampLiveClass;
