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
    <div className="bc-page">
        <header className="bc-page-header">
          <div className="bc-page-header-inner">
            <div className="bc-header-left">
              <div className="bc-header-icon-wrap">
                <FiVideo size={20} className="bc-header-icon" />
              </div>
              <div>
                <div className="bc-header-breadcrumb">
                  <span className="bc-breadcrumb-org">HSOCIETY</span>
                  <span className="bc-breadcrumb-sep">/</span>
                  <span className="bc-breadcrumb-page">bootcamp-live-class</span>
                  <span className="bc-header-visibility">Private</span>
                </div>
                <p className="bc-header-desc">Join instructor-led sessions. Links appear when instructors publish them.</p>
              </div>
            </div>
          </div>
          <div className="bc-header-meta">
            <span className="bc-meta-pill">
              <FiVideo size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Sessions</span>
              <strong className="bc-meta-value">{notificationClasses.length + roomClasses.length}</strong>
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
                <FiVideo size={15} className="bc-section-icon" />
                Live Sessions
              </h2>
              <p className="bc-section-desc">Join live classes or review upcoming room sessions.</p>
              <div className="bc-section-grid">
                {(notificationClasses.length === 0 && roomClasses.length === 0) && (
                  <div className="bc-panel">
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
