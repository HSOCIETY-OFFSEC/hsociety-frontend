import React, { useEffect, useState } from 'react';
import { FiActivity, FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../../../shared/components/ui/PageLoader';
import { getAdminOverview } from './admin.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import PublicError from '../../../shared/components/ui/PublicError';
import './index.css';

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
        setError(getPublicErrorMessage({ action: 'load', response }));
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

        <aside className="ad-sidebar">
          <div className="ad-sidebar-box">
            <h3 className="ad-sidebar-heading">About</h3>
            <p className="ad-sidebar-about">
              Admin control panel for managing users, pentests, community, and platform security.
            </p>
            <div className="ad-sidebar-divider" />
            <ul className="ad-sidebar-list">
              <li><FiUsers size={13} className="ad-sidebar-icon" />User management</li>
              <li><FiShield size={13} className="ad-sidebar-icon" />Pentest operations</li>
              <li><FiMessageSquare size={13} className="ad-sidebar-icon" />Community moderation</li>
            </ul>
          </div>

          <div className="ad-sidebar-box ad-status-box">
            <div className="ad-status-row">
              <span className="ad-status-dot" />
              <span className="ad-status-label">PLATFORM STATUS</span>
            </div>
            <strong className="ad-status-value">LIVE</strong>
            <div className="ad-status-track">
              <div className="ad-status-fill" style={{ width: '100%' }} />
            </div>
            <p className="ad-status-note">All systems operational.</p>
          </div>

          <div className="ad-sidebar-box">
            <h3 className="ad-sidebar-heading">Topics</h3>
            <div className="ad-topics">
              <span className="ad-topic">admin</span>
              <span className="ad-topic">users</span>
              <span className="ad-topic">pentests</span>
              <span className="ad-topic">community</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminOverview;
