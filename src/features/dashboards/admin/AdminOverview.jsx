import React, { useEffect, useState } from 'react';
import { FiActivity, FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import PageLoader from '../../../shared/components/ui/PageLoader';
import { getAdminOverview } from './admin.service';
import '../../../styles/dashboards/admin/index.css';

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      const response = await getAdminOverview();
      if (!mounted) return;
      if (response.success) {
        setOverview(response.data || {});
      } else {
        setError(response.error || 'Failed to load admin overview');
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <PageLoader message="Loading admin overview..." durationMs={0} />;

  const users = overview?.users || {};
  const community = overview?.community || {};
  const pentests = overview?.pentests || {};

  return (
    <div className="admin-dashboard">
      <div className="dashboard-shell">
        <div className="admin-hero dashboard-shell-header">
          <div>
            <p className="admin-kicker dashboard-shell-kicker">HSOCIETY CONTROL NODE</p>
            <h1 className="dashboard-shell-title">Admin Overview</h1>
            <p className="admin-subtitle dashboard-shell-subtitle">
              Monitor activity, manage teams, and keep operations aligned.
            </p>
          </div>
          <div className="admin-badges dashboard-shell-actions">
            <div className="admin-badge">
              <FiUsers size={18} />
              <div>
                <span>Total Users</span>
                <strong>{users.total || 0}</strong>
              </div>
            </div>
            <div className="admin-badge">
              <FiActivity size={18} />
              <div>
                <span>Active (24h)</span>
                <strong>{users.active24h || 0}</strong>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="admin-alert">{error}</div>}

        <div className="admin-overview-grid">
          <Card className="admin-card" padding="medium">
            <div className="admin-section-header">
              <h2>Community Activity</h2>
              <p>Live stats from community messaging.</p>
            </div>
            <div className="admin-overview-stats">
              <div>
                <FiMessageSquare size={16} />
                <span>Messages</span>
                <strong>{community.messages || 0}</strong>
              </div>
              <div>
                <FiMessageSquare size={16} />
                <span>Comments</span>
                <strong>{community.comments || 0}</strong>
              </div>
              <div>
                <FiMessageSquare size={16} />
                <span>Posts</span>
                <strong>{community.posts || 0}</strong>
              </div>
            </div>
            <div className="admin-overview-actions">
              <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/community')}>
                Manage Community
              </Button>
            </div>
          </Card>

          <Card className="admin-card" padding="medium">
            <div className="admin-section-header">
              <h2>User Management</h2>
              <p>Role distribution and bootcamp progress.</p>
            </div>
            <div className="admin-overview-stats">
              <div>
                <FiUsers size={16} />
                <span>Students</span>
                <strong>{users.byRole?.student || 0}</strong>
              </div>
              <div>
                <FiUsers size={16} />
                <span>Pentesters</span>
                <strong>{users.byRole?.pentester || 0}</strong>
              </div>
              <div>
                <FiUsers size={16} />
                <span>Corporate</span>
                <strong>{users.byRole?.corporate || 0}</strong>
              </div>
            </div>
            <div className="admin-overview-actions">
              <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/users')}>
                Manage Users
              </Button>
            </div>
          </Card>

          <Card className="admin-card" padding="medium">
            <div className="admin-section-header">
              <h2>Pentest Operations</h2>
              <p>Keep engagements assigned and moving.</p>
            </div>
            <div className="admin-overview-stats">
              <div>
                <FiShield size={16} />
                <span>Total Pentests</span>
                <strong>{pentests.total || 0}</strong>
              </div>
              <div>
                <FiShield size={16} />
                <span>In Progress</span>
                <strong>{pentests.byStatus?.['in-progress'] || 0}</strong>
              </div>
              <div>
                <FiShield size={16} />
                <span>Completed</span>
                <strong>{pentests.byStatus?.completed || 0}</strong>
              </div>
            </div>
            <div className="admin-overview-actions">
              <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/pentests')}>
                Manage Pentests
              </Button>
            </div>
          </Card>
        </div>

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Management Hub</h2>
            <p>Jump into the tools you need to update the platform.</p>
          </div>
          <div className="admin-management-actions">
            <Button variant="secondary" size="small" onClick={() => navigate('/mr-robot/community')}>
              Community Config
            </Button>
            <Button variant="secondary" size="small" onClick={() => navigate('/mr-robot/users')}>
              Users
            </Button>
            <Button variant="secondary" size="small" onClick={() => navigate('/mr-robot/pentests')}>
              Pentests
            </Button>
            <Button variant="secondary" size="small" onClick={() => navigate('/mr-robot/security')}>
              Security
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
