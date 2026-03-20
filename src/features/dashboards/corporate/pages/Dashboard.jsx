import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
  FiShield
} from 'react-icons/fi';
import { getDashboardOverview } from '../services/dashboard.service';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import SecurityCommandCenterCard from '../components/SecurityCommandCenterCard';
import SecurityActionCenterCard from '../components/SecurityActionCenterCard';
import SecurityIndicatorsCard from '../components/SecurityIndicatorsCard';
import VulnerabilitySnapshotCard from '../components/VulnerabilitySnapshotCard';
import ReportsListCard from '../components/ReportsListCard';
import SecurityActivityFeedCard from '../components/SecurityActivityFeedCard';
import Skeleton from '../../../../shared/components/ui/Skeleton';
import reportRum from '../../../../shared/utils/perf/rum';
import '../styles/corporate-dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const rumSentRef = useRef(false);
  const loadStartRef = useRef(performance.now());

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

  useEffect(() => {
    if (loading || rumSentRef.current) return;
    rumSentRef.current = true;
    const duration = Math.round(performance.now() - loadStartRef.current);
    reportRum({
      metric: 'dashboard_load',
      value: duration,
      tags: { dashboard: 'corporate', status: error ? 'error' : 'success' }
    });
  }, [loading, error]);

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

  const statusMeta = useMemo(() => {
    if (engagementStatus === 'active') {
      return {
        label: 'ENGAGEMENT STATUS',
        value: 'ACTIVE',
        note: 'Engagement in progress. Monitor milestones.',
        fill: 70
      };
    }
    if (engagementStatus === 'completed') {
      return {
        label: 'ENGAGEMENT STATUS',
        value: 'COMPLETE',
        note: 'Reports ready. Review and remediate.',
        fill: 100
      };
    }
    return {
      label: 'ENGAGEMENT STATUS',
      value: 'OPEN',
      note: 'Request an engagement to begin.',
      fill: 40
    };
  }, [engagementStatus]);

  const activeEngagements = Number(overview?.stats?.activeEngagements ?? 0);
  const showData = !loading && !error;

  const renderMetaValue = (value, width = 36) => {
    if (loading) {
      return <Skeleton className="cd-meta-skeleton" style={{ width }} />;
    }
    if (error) return '—';
    return value;
  };

  return (
    <div className="cd-page">
      <header className="cd-page-header">
        <div className="cd-page-header-inner">
          <div className="cd-header-left">
            <div className="cd-header-icon-wrap">
              <FiShield size={20} className="cd-header-icon" />
            </div>
            <div>
              <div className="cd-header-breadcrumb">
                <span className="cd-breadcrumb-org">HSOCIETY</span>
                <span className="cd-breadcrumb-sep">/</span>
                <span className="cd-breadcrumb-page">corporate-dashboard</span>
                <span className="cd-header-visibility">Private</span>
              </div>
              <p className="cd-header-desc">Security overview for engagements, vulnerabilities, and reports.</p>
            </div>
          </div>
          <div className="cd-header-actions">
            <button type="button" className="cd-btn cd-btn-primary" onClick={() => navigate('/engagements')}>
              <FiShield size={14} />
              Run Security Scan
            </button>
            <button type="button" className="cd-btn cd-btn-secondary" onClick={() => navigate('/reports')}>
              <FiFileText size={14} />
              View Reports
            </button>
          </div>
        </div>
        <div className="cd-header-meta">
          <span className="cd-meta-pill">
            <FiBarChart2 size={13} className="cd-meta-icon" />
            <span className="cd-meta-label">Security Score</span>
            <strong className="cd-meta-value">{renderMetaValue(securityScore, 38)}</strong>
          </span>
          <span className="cd-meta-pill">
            <FiActivity size={13} className="cd-meta-icon" />
            <span className="cd-meta-label">Engagements</span>
            <strong className="cd-meta-value">{renderMetaValue(activeEngagements, 28)}</strong>
          </span>
          <span className="cd-meta-pill">
            <FiAlertTriangle size={13} className="cd-meta-icon" />
            <span className="cd-meta-label">Critical</span>
            <strong className="cd-meta-value">{renderMetaValue(criticalCount, 28)}</strong>
          </span>
          <span className="cd-meta-pill">
            <FiFileText size={13} className="cd-meta-icon" />
            <span className="cd-meta-label">Last Scan</span>
            <strong className="cd-meta-value">{renderMetaValue(lastScan, 72)}</strong>
          </span>
        </div>
      </header>

      <div className="cd-layout">
        <main className="cd-main">
          {loading && (
            <div className="cd-loading">
              <p>Loading your security dashboard...</p>
              <div className="cd-loading-list">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={`cd-load-${index}`} className="cd-skeleton" />
                ))}
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="cd-panel cd-alert">
              <h3 className="cd-panel-title">Dashboard Unavailable</h3>
              <p>We couldn&apos;t load your security data.</p>
              <button type="button" className="cd-btn cd-btn-secondary" onClick={loadDashboardData}>
                Retry
              </button>
            </div>
          )}

          {!error && !loading && (
            <>
              <section className="cd-section">
                <h2 className="cd-section-title">
                  <FiShield size={15} className="cd-section-icon" />
                  Security Command Center
                </h2>
                <p className="cd-section-desc">Monitor risk level, security score, and last scan status.</p>
                <SecurityCommandCenterCard
                  securityScore={securityScore}
                  riskLevel={riskLevel}
                  lastScan={lastScan}
                  onRunScan={() => navigate('/engagements')}
                  onViewReports={() => navigate('/reports')}
                />
              </section>
              <div className="cd-divider" />

              <section className="cd-section">
                <h2 className="cd-section-title">
                  <FiActivity size={15} className="cd-section-icon" />
                  Action Center
                </h2>
                <p className="cd-section-desc">Launch or review security engagements.</p>
                <div className="cd-section-grid">
                  <SecurityActionCenterCard
                    status={engagementStatus}
                    onNavigate={(route) => navigate(route)}
                  />
                  <SecurityIndicatorsCard
                    securityScore={securityScore}
                    riskLevel={riskLevel}
                    criticalCount={criticalCount}
                  />
                </div>
              </section>
              <div className="cd-divider" />

              <section className="cd-section">
                <h2 className="cd-section-title">
                  <FiAlertTriangle size={15} className="cd-section-icon" />
                  Vulnerability Snapshot
                </h2>
                <p className="cd-section-desc">Critical vulnerabilities are prioritized for remediation.</p>
                <VulnerabilitySnapshotCard
                  breakdown={vulnerabilityBreakdown}
                  onView={() => navigate('/remediation')}
                />
              </section>
              <div className="cd-divider" />

              <section className="cd-section">
                <h2 className="cd-section-title">
                  <FiFileText size={15} className="cd-section-icon" />
                  Activity & Reports
                </h2>
                <p className="cd-section-desc">Review recent reports and security activity.</p>
                <div className="cd-section-grid">
                  <ReportsListCard
                    reports={reports}
                    onViewReport={() => navigate('/reports')}
                    onDownloadReport={() => navigate('/reports')}
                  />
                  <SecurityActivityFeedCard activity={activityFeed} />
                </div>
              </section>
            </>
          )}
        </main>

        <aside className="cd-sidebar">
          <div className="cd-sidebar-box">
            <h3 className="cd-sidebar-heading">About</h3>
            <p className="cd-sidebar-about">
              Corporate security overview tracking engagement status, vulnerabilities, and reports.
            </p>
            <div className="cd-sidebar-divider" />
            <ul className="cd-sidebar-list">
              <li><FiCheckCircle size={13} className="cd-sidebar-icon" />Engagement tracking</li>
              <li><FiCheckCircle size={13} className="cd-sidebar-icon" />Risk monitoring</li>
              <li><FiCheckCircle size={13} className="cd-sidebar-icon" />Report access</li>
            </ul>
          </div>

          <div className="cd-sidebar-box cd-status-box">
            {loading && (
              <div className="cd-status-skeleton">
                <Skeleton className="cd-status-line" style={{ width: '58%' }} />
                <Skeleton className="cd-status-value-skeleton" style={{ width: '42%' }} />
                <Skeleton className="cd-status-track-skeleton" variant="rect" style={{ width: '100%', height: '6px' }} />
                <Skeleton className="cd-status-line" style={{ width: '78%' }} />
              </div>
            )}
            {!loading && error && (
              <div className="cd-status-empty">
                <p className="cd-muted-text">Status unavailable.</p>
              </div>
            )}
            {showData && (
              <>
                <div className="cd-status-row">
                  <span className="cd-status-dot" />
                  <span className="cd-status-label">{statusMeta.label}</span>
                </div>
                <strong className="cd-status-value">{statusMeta.value}</strong>
                <div className="cd-status-track">
                  <div className="cd-status-fill" style={{ width: `${statusMeta.fill}%` }} />
                </div>
                <p className="cd-status-note">{statusMeta.note}</p>
              </>
            )}
          </div>

          <div className="cd-sidebar-box">
            <h3 className="cd-sidebar-heading">Topics</h3>
            <div className="cd-topics">
              <span className="cd-topic">engagements</span>
              <span className="cd-topic">reports</span>
              <span className="cd-topic">vulnerabilities</span>
              <span className="cd-topic">risk</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
