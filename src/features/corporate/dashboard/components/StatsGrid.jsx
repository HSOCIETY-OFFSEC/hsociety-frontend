import React from 'react';
import { FiAlertTriangle, FiFileText, FiShield } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';

const statConfig = [
  {
    key: 'activePentests',
    label: 'Active Pentests',
    icon: FiShield,
    color: '#10b981'
  },
  {
    key: 'completedAudits',
    label: 'Completed Audits',
    icon: FiFileText,
    color: '#3b82f6'
  },
  {
    key: 'pendingReports',
    label: 'Pending Reports',
    icon: FiFileText,
    color: '#f59e0b'
  },
  {
    key: 'vulnerabilitiesFound',
    label: 'Vulnerabilities Found',
    icon: FiAlertTriangle,
    color: '#ef4444'
  }
];

const StatsGrid = ({ stats = {} }) => (
  <div className="stats-grid reveal-on-scroll">
    {statConfig.map((stat) => (
      <Card
        key={stat.key}
        hover3d={true}
        padding="large"
        shadow="medium"
        className="reveal-on-scroll dramatic-card"
      >
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: `${stat.color}20`, color: stat.color }}
          >
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
