import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardOverview } from './dashboard.service';
import { getPublicErrorMessage } from '../../../shared/utils/publicError';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import SecurityCommandCenterCard from './components/SecurityCommandCenterCard';
import SecurityActionCenterCard from './components/SecurityActionCenterCard';
import SecurityIndicatorsCard from './components/SecurityIndicatorsCard';
import VulnerabilitySnapshotCard from './components/VulnerabilitySnapshotCard';
import ReportsListCard from './components/ReportsListCard';
import SecurityActivityFeedCard from './components/SecurityActivityFeedCard';
import '../../../styles/dashboards/corporate/index.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');

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
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-wrapper dashboard-shell">
          <div className="dashboard-header">
            <div>
              <Skeleton className="skeleton-title" />
              <Skeleton className="skeleton-subtitle" />
            </div>
          </div>
          <div className="status-grid">
            {['status', 'action', 'reports'].map((section) => (
              <div key={section} className="skeleton-card">
                <Skeleton className="skeleton-title short" />
                <Skeleton className="skeleton-line" />
                <Skeleton className="skeleton-line short" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const engagementStatus = overview?.status?.engagementStatus
    || (overview?.stats?.activeEngagements ? 'active' : 'none');

  const securityScore = Number(
    overview?.status?.securityScore ?? overview?.stats?.securityScore ?? 0
  );

  const riskLevel = overview?.status?.riskLevel
    || (securityScore >= 80 ? 'Low' : securityScore >= 60 ? 'Medium' : 'High');

  const lastScan = overview?.status?.lastScan
    ? new Date(overview.status.lastScan).toLocaleDateString()
    : 'No scan data';

  const criticalCount = Number(
    overview?.stats?.criticalVulnerabilities
    ?? overview?.stats?.criticalCount
    ?? overview?.stats?.critical
    ?? 0
  );

  const vulnerabilityBreakdown = useMemo(() => {
    const vulns = overview?.stats?.vulnerabilities || {};
    return [
      { key: 'critical', label: 'Critical', value: Number(vulns.critical ?? criticalCount ?? 0) },
      { key: 'high', label: 'High', value: Number(vulns.high ?? overview?.stats?.high ?? 0) },
      { key: 'medium', label: 'Medium', value: Number(vulns.medium ?? overview?.stats?.medium ?? 0) },
      { key: 'low', label: 'Low', value: Number(vulns.low ?? overview?.stats?.low ?? 0) }
    ];
  }, [overview, criticalCount]);

  const reports = overview?.reports?.length > 0
    ? overview.reports
    : (overview?.recentActivity || [])
        .filter((item) => item.type === 'report')
        .map((item) => ({
          id: item.id,
          engagementId: item.engagementId || item.id,
          name: item.title || item.name,
          date: item.date ? new Date(item.date).toLocaleDateString() : 'Recent',
          url: item.url || '#'
        }));

  const activityFeed = useMemo(() => (
    (overview?.recentActivity || []).map((item) => ({
      id: item.id,
      time: item.date
        ? new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : item.time || '—',
      message: item.message || item.title || 'Security activity update'
    }))
  ), [overview]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper dashboard-shell">
        <header className="dashboard-header dashboard-shell-header reveal-on-scroll dramatic-header corporate-hero">
          <div>
            <p className="corp-header-kicker">Corporate Dashboard</p>
            <h1 className="dashboard-title dashboard-shell-title">Security Command Overview</h1>
            <p className="dashboard-subtitle dashboard-shell-subtitle">
              Actionable security insight, prioritized for your team.
            </p>
          </div>
        </header>

        {loading && (
          <div className="corp-loading-text">Loading your security dashboard...</div>
        )}

        {error && (
          <Card padding="medium" className="corp-card corp-error-card">
            <h3>Dashboard Unavailable</h3>
            <p>We couldn't load your security data.</p>
            <Button variant="secondary" size="small" onClick={loadDashboardData}>
              Retry
            </Button>
          </Card>
        )}

        {!error && (
          <>
            {loading ? (
              <div className="corp-skeleton-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`sk-${index}`} className="corp-skeleton-card" />
                ))}
              </div>
            ) : (
              <>
                {/* 1. Security Command Center */}
                <section className="corp-section">
                  <SecurityCommandCenterCard
                    securityScore={securityScore}
                    riskLevel={riskLevel}
                    lastScan={lastScan}
                    onRunScan={() => navigate('/engagements')}
                    onViewReports={() => navigate('/reports')}
                  />
                </section>

                {/* 2. Action Center */}
                <section className="corp-section corp-section-grid">
                  <SecurityActionCenterCard
                    status={engagementStatus}
                    onNavigate={(route) => navigate(route)}
                  />
                  {/* 3. Security Indicators */}
                  <SecurityIndicatorsCard
                    securityScore={securityScore}
                    riskLevel={riskLevel}
                    criticalCount={criticalCount}
                  />
                </section>

                {/* 4. Vulnerability Snapshot */}
                <section className="corp-section">
                  <VulnerabilitySnapshotCard
                    breakdown={vulnerabilityBreakdown}
                    onView={() => navigate('/remediation')}
                  />
                </section>

                {/* 5. Activity & Reports */}
                <section className="corp-section corp-section-grid">
                  <ReportsListCard
                    reports={reports}
                    onViewReport={() => navigate('/reports')}
                    onDownloadReport={() => navigate('/reports')}
                  />
                  <SecurityActivityFeedCard activity={activityFeed} />
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
