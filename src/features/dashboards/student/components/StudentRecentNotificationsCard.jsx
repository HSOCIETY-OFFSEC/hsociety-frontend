import React from 'react';
import { FiFlag } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import { STUDENT_DASHBOARD_UI } from '../../../../data/student/studentDashboardUiData';

const StudentRecentNotificationsCard = ({ notifications = [] }) => (
  <Card padding="medium" className="student-card">
    <div className="student-card-header">
      <FiFlag size={20} />
      <h3>{STUDENT_DASHBOARD_UI.cards.notificationsTitle}</h3>
    </div>
    {notifications.length === 0 ? (
      <p className="student-muted-text">{STUDENT_DASHBOARD_UI.body.noNotifications}</p>
    ) : (
      notifications.slice(0, 4).map((item) => (
        <div key={item.id} className="student-notification-item">
          <strong className="student-notification-title">{item.title}</strong>
          <span className="student-notification-message">{item.message}</span>
        </div>
      ))
    )}
  </Card>
);

export default StudentRecentNotificationsCard;
