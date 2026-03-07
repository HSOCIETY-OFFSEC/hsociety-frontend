import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { getDashboardOverview } from './dashboard.service';
import { getPublicErrorMessage } from '../../../shared/utils/publicError';
import SecurityStatusCard from './components/SecurityStatusCard';
import PrimaryActionCard from './components/PrimaryActionCard';
import ReportsList from './components/ReportsList';
import '../../../styles/dashboards/corporate/index.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Debug: verify the corporate dashboard is mounting in the browser.
    // This helps diagnose cases where only the nav + sidebar are visible.
    // eslint-disable-next-line no-console
    console.log('[CorporateDashboard] mounted');
    loadDashboardData();
  }, []);


  const loadDashboardData = async () => {
    setLoading(true);

    try {
      const response = await getDashboardOverview();
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'load', response }));
      }
      setOverview(response.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-wrapper dashboard-shell">
          <div className="dashboard-header">
            <div>
              <div className="skeleton-title" />
              <div className="skeleton-subtitle" />
            </div>
          </div>
          <div className="status-grid">
            {['status', 'action', 'reports'].map((section) => (
              <div key={section} className="skeleton-card">
                <div className="skeleton-title short" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const engagementStatus = overview?.status?.engagementStatus
    || (overview?.stats?.activeEngagements ? 'active' : 'none');
  const riskLevel = overview?.status?.riskLevel
    || (overview?.stats?.securityScore
      ? overview.stats.securityScore >= 80
        ? 'low'
        : overview.stats.securityScore >= 60
          ? 'medium'
          : 'high'
      : 'medium');
  const lastScan = overview?.status?.lastScan
    ? new Date(overview.status.lastScan).toLocaleDateString()
    : 'No scan data';
  const reports = overview?.reports?.length > 0
    ? overview.reports
    : (overview?.recentActivity || [])
        .filter((item) => item.type === 'report')
        .map((item) => ({
          id: item.id,
          engagementId: item.engagementId || item.id,
          date: new Date(item.date).toLocaleDateString(),
          url: item.url || '#'
        }));

  const handlePrimaryAction = (status) => {
    if (status === 'active') {
      navigate('/engagements');
      return;
    }
    if (status === 'completed') {
      navigate('/reports');
      return;
    }
    navigate('/engagements');
  };

  return (
    <div className="dashboard-container">
      {/* Lightweight debug marker so it's obvious when the dashboard is rendering */}
      <div className="dashboard-debug-banner">
        Corporate dashboard workspace
      </div>
      <div className="dashboard-wrapper dashboard-shell">
        <div className="dashboard-header dashboard-shell-header reveal-on-scroll dramatic-header corporate-hero">
          <div>
            <h1 className="dashboard-title dashboard-shell-title">
              Welcome back, {user?.name || 'Partner'}!
            </h1>
            <p className="dashboard-subtitle dashboard-shell-subtitle">
              Always-on security for your organization.
            </p>
          </div>
        </div>

        {error && (
          <div className="security-notice-card reveal-on-scroll">
            <p className="security-notice-text">{error}</p>
          </div>
        )}

        <div className="dashboard-grid reveal-on-scroll">
          <SecurityStatusCard
            status={engagementStatus}
            risk={riskLevel}
            lastScan={lastScan}
          />
          <PrimaryActionCard
            engagementStatus={engagementStatus}
            onAction={handlePrimaryAction}
          />
          <ReportsList reports={reports} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
