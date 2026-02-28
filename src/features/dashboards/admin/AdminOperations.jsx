import React from 'react';
import { FiActivity, FiClipboard, FiShield, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import '../../../styles/dashboards/admin/index.css';

const AdminOperations = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-shell">
        <div className="admin-hero dashboard-shell-header">
          <div>
            <p className="admin-kicker dashboard-shell-kicker">MANAGEMENT HUB</p>
            <h1 className="dashboard-shell-title">Admin Operations</h1>
            <p className="admin-subtitle dashboard-shell-subtitle">
              Jump into the tools that keep HSOCIETY running.
            </p>
          </div>
        </div>

        <div className="admin-overview-grid">
          <Card className="admin-card" padding="medium">
            <div className="admin-section-header">
              <h2>Community</h2>
              <p>Channels, tags, and stats.</p>
            </div>
            <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/community')}>
              <FiActivity size={14} />
              Open Community Manager
            </Button>
          </Card>

          <Card className="admin-card" padding="medium">
            <div className="admin-section-header">
              <h2>Users</h2>
              <p>Roles, bootcamp status, and access.</p>
            </div>
            <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/users')}>
              <FiUsers size={14} />
              Open User Manager
            </Button>
          </Card>

          <Card className="admin-card" padding="medium">
            <div className="admin-section-header">
              <h2>Pentests</h2>
              <p>Assignments and engagement status.</p>
            </div>
            <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/pentests')}>
              <FiShield size={14} />
              Open Pentest Manager
            </Button>
          </Card>

          <Card className="admin-card" padding="medium">
            <div className="admin-section-header">
              <h2>Content</h2>
              <p>Landing page + blog entries.</p>
            </div>
            <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/content')}>
              <FiClipboard size={14} />
              Open Content Manager
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOperations;
