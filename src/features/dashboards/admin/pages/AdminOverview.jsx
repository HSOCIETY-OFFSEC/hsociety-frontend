import React, { useEffect, useState } from 'react';
import { FiActivity, FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../../../../shared/components/ui/PageLoader';
import { getAdminOverview, getRumSummary } from '../services/admin.service';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import PublicError from '../../../../shared/components/ui/PublicError';
import '../styles/admin-dashboard.css';

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const [rumSummary, setRumSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      const [response, rumResponse] = await Promise.all([
        getAdminOverview(),
        getRumSummary(),
      ]);
      if (!mounted) return;
      if (response.success) {
        setOverview(response.data || {});
      } else {
        setError(getPublicErrorMessage({ action: 'load', response }));
      }
      if (rumResponse?.success) {
        setRumSummary(rumResponse.data || {});
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <PageLoader message="Loading admin overview..." durationMs={0} />;

  const users = overview?.users || {};
  const community = overview?.community || {};
  const pentests = overview?.pentests || {};
  const rumMetrics = rumSummary?.metrics?.dashboard_load;
  const rumWindow = rumSummary?.windowMs ? Math.round(rumSummary.windowMs / 60000) : 0;
  const rumCards = [
    { label: 'Student', key: 'student' },
    { label: 'Corporate', key: 'corporate' },
    { label: 'Pentester', key: 'pentester' },
  ];

  const statCards = [
    {
      icon: <FiUsers size={16} />,
      label: 'Total Users',
      value: users.total || 0,
      sub: `${users.byRole?.student || 0} students · ${users.byRole?.pentester || 0} pentesters`,
      action: () => navigate('/mr-robot/users'),
      actionLabel: 'Manage Users'
    },
    {
      icon: <FiShield size={16} />,
      label: 'Pentests',
      value: pentests.total || 0,
      sub: `${pentests.byStatus?.['in-progress'] || 0} active · ${pentests.byStatus?.completed || 0} done`,
      action: () => navigate('/mr-robot/pentests'),
      actionLabel: 'Manage Pentests'
    },
    {
      icon: <FiMessageSquare size={16} />,
      label: 'Community',
      value: community.messages || 0,
      sub: `${community.posts || 0} posts · ${community.comments || 0} comments`,
      action: () => navigate('/mr-robot/community'),
      actionLabel: 'Manage Community'
    }
  ];

  return (
    <div className="ad-page">
      <header className="ad-page-header">
        <div className="ad-page-header-inner">
          <div className="ad-header-left">
            <div className="ad-header-icon-wrap">
              <FiActivity size={20} className="ad-header-icon" />
            </div>
            <div>
              <div className="ad-header-breadcrumb">
                <span className="ad-breadcrumb-org">HSOCIETY</span>
                <span className="ad-breadcrumb-sep">/</span>
                <span className="ad-breadcrumb-page">admin-overview</span>
                <span className="ad-header-visibility">Admin</span>
              </div>
              <p className="ad-header-desc">Platform-wide stats and quick access to management tools.</p>
            </div>
          </div>
        </div>
        <div className="ad-header-meta">
          <span className="ad-meta-pill">
            <FiUsers size={13} className="ad-meta-icon" />
            <span className="ad-meta-label">Users</span>
            <strong className="ad-meta-value">{users.total || 0}</strong>
          </span>
          <span className="ad-meta-pill">
            <FiShield size={13} className="ad-meta-icon" />
            <span className="ad-meta-label">Pentests</span>
            <strong className="ad-meta-value">{pentests.total || 0}</strong>
          </span>
          <span className="ad-meta-pill">
            <FiMessageSquare size={13} className="ad-meta-icon" />
            <span className="ad-meta-label">Messages</span>
            <strong className="ad-meta-value">{community.messages || 0}</strong>
          </span>
        </div>
      </header>

      <div className="ad-layout">
        <main className="ad-main">
          <PublicError message={error} className="admin-alert" />

          <section className="ad-section">
            <h2 className="ad-section-title">
              <FiActivity size={15} className="ad-section-icon" />
              Platform Overview
            </h2>
            <p className="ad-section-desc">Live stats across users, pentests, and community activity.</p>
            <div className="ad-stat-grid">
              {statCards.map((card) => (
                <div key={card.label} className="ad-stat-card">
                  <div className="ad-stat-card-header">
                    {card.icon}
                    <span className="ad-stat-card-label">{card.label}</span>
                  </div>
                  <strong className="ad-stat-card-value">{card.value}</strong>
                  <p className="ad-stat-card-sub">{card.sub}</p>
                  <button
                    type="button"
                    className="ad-btn ad-btn-secondary"
                    onClick={card.action}
                  >
                    {card.actionLabel}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="ad-divider" />

          <section className="ad-section">
            <h2 className="ad-section-title">
              <FiActivity size={15} className="ad-section-icon" />
              Experience Telemetry
            </h2>
            <p className="ad-section-desc">
              Dashboard load performance from real user sessions{rumWindow ? ` · last ${rumWindow} min` : ''}.
            </p>
            <div className="ad-rum-grid">
              {rumMetrics ? (
                rumCards.map((card) => {
                  const data = rumMetrics.byDashboard?.[card.key] || { count: 0, avg: 0, p95: 0 };
                  return (
                    <div key={card.key} className="ad-rum-card">
                      <span className="ad-rum-label">{card.label}</span>
                      <div className="ad-rum-metrics">
                        <div>
                          <span>Avg</span>
                          <strong>{data.avg} ms</strong>
                        </div>
                        <div>
                          <span>P95</span>
                          <strong>{data.p95} ms</strong>
                        </div>
                        <div>
                          <span>Samples</span>
                          <strong>{data.count}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="ad-rum-empty">No telemetry received yet.</div>
              )}
            </div>
          </section>

          <div className="ad-divider" />

          <section className="ad-section">
            <h2 className="ad-section-title">
              <FiShield size={15} className="ad-section-icon" />
              Quick Actions
            </h2>
            <p className="ad-section-desc">Jump into the tools you need to manage the platform.</p>
            <div className="ad-quick-actions">
              <button type="button" className="ad-btn ad-btn-primary" onClick={() => navigate('/mr-robot/users')}>
                <FiUsers size={14} /> Users
              </button>
              <button type="button" className="ad-btn ad-btn-secondary" onClick={() => navigate('/mr-robot/pentests')}>
                <FiShield size={14} /> Pentests
              </button>
              <button type="button" className="ad-btn ad-btn-secondary" onClick={() => navigate('/mr-robot/community')}>
                <FiMessageSquare size={14} /> Community
              </button>
              <button type="button" className="ad-btn ad-btn-secondary" onClick={() => navigate('/mr-robot/security')}>
                <FiActivity size={14} /> Security
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminOverview;
