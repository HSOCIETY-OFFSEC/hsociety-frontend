import React from 'react';
import cpIcon from '../../../../assets/icons/CP/cp-icon.png';
import Card from '../../../../shared/components/ui/Card';
import { STUDENT_DASHBOARD_UI } from '../../../../data/student/studentDashboardUiData';

const StudentXpSummaryCard = ({ xpSummary }) => {
  if (!xpSummary) return null;

  return (
    <Card padding="medium" className="student-card reveal-on-scroll">
      <div className="student-card-header">
        <img src={cpIcon} alt="CP" className="student-cp-icon" />
        <h3>{STUDENT_DASHBOARD_UI.cards.cpRankTitle}</h3>
      </div>
      <p className="student-cp-rank-line">
        <strong>{xpSummary.rank}</strong> · {xpSummary.totalXp} {STUDENT_DASHBOARD_UI.xp.cpSuffix}
      </p>
      <p className="student-muted-text">
        {xpSummary.streakDays} {STUDENT_DASHBOARD_UI.xp.dayStreakLabel} · {xpSummary.visits}{' '}
        {STUDENT_DASHBOARD_UI.xp.visitsLabel}
      </p>
    </Card>
  );
};

export default StudentXpSummaryCard;
