import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';
import { listNotifications } from '../services/notifications.service';
import { getStudentCourse } from '../courses/course.service';
import { getStudentOverview } from '../../dashboards/student/student.service';
import BootcampAccessGate from './components/BootcampAccessGate';
import BootcampRightPanel from './components/BootcampRightPanel';
import LiveClassCard from './components/LiveClassCard';

const BootcampLiveClass = () => {
  const { setRightPanel } = useOutletContext() || {};
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

  useEffect(() => {
    if (!setRightPanel) return undefined;
    setRightPanel(<BootcampRightPanel overview={overview} />);
    return () => setRightPanel(null);
  }, [overview, setRightPanel]);

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

  return (
    <section className="bootcamp-page">
      <BootcampAccessGate>
        <header className="bootcamp-page-header">
          <div>
            <h1>Live Class</h1>
            <p>Join instructor-led sessions. Links appear when instructors publish them.</p>
          </div>
        </header>

        <div className="bootcamp-live-grid">
          {(notificationClasses.length === 0 && roomClasses.length === 0) && (
            <Card padding="medium" className="bootcamp-status-card">
              <p>Live class schedules will appear here when posted.</p>
            </Card>
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
      </BootcampAccessGate>
    </section>
  );
};

export default BootcampLiveClass;
