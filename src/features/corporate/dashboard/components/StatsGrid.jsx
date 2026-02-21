import React from 'react';
import { FiAlertTriangle, FiFileText, FiShield } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';

const statConfig = [
  {
    key: 'activePentests',
    label: 'Active Pentests',
    icon: FiShield
  },
  {
    key: 'completedAudits',
    label: 'Completed Audits',
    icon: FiFileText
  },
  {
    key: 'pendingReports',
    label: 'Pending Reports',
    icon: FiFileText
  },
  {
    key: 'vulnerabilitiesFound',
    label: 'Vulnerabilities Found',
    icon: FiAlertTriangle
  }
];

const StatsGrid = ({ stats = {} }) => (
  <div className="stats-grid reveal-on-scroll">
    {statConfig.map((stat) => (
      <Card
        key={stat.key}
        hover3d={false}
        padding="medium"
        shadow="small"
        className="reveal-on-scroll dramatic-card"
      >
        <div className="stat-card">
          <div className="stat-icon">
            <stat.icon size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">{stat.label}</p>
            <h2 className="stat-value">{stats[stat.key] ?? 0}</h2>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default StatsGrid;
