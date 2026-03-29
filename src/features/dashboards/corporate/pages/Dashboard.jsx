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
import Button from '../../../../shared/components/ui/Button';
import reportRum from '../../../../shared/utils/perf/rum';
import { logger } from '../../../../core/logging/logger';

const pageClassName =
 'min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] pt-[clamp(1.5rem,3vw,2.5rem)] pb-16 text-text-primary';
const headerClassName = 'mb-6 flex flex-col gap-4';
const headerInnerClassName = 'flex flex-wrap items-center justify-between gap-6';
const breadcrumbClassName = 'flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary';
const metaPillClassName =
 'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2.5 py-1 text-xs text-text-secondary';
const metaLabelClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
const sectionClassName = 'py-6';
const sectionTitleClassName = 'mb-2 flex items-center gap-2 text-base font-semibold text-text-primary';
const sectionGridClassName = 'grid grid-cols-1 gap-5 lg:grid-cols-2';

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
   logger.error('Failed to load dashboard data:', error);
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
   return <Skeleton className="h-3 rounded-full" style={{ width }} />;
  }
  if (error) return '—';
  return value;
 };

 return (
  <div className={pageClassName}>
   <header className={headerClassName}>
    <div className={headerInnerClassName}>
     <div className="flex items-center gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border bg-bg-secondary">
       <FiShield size={20} className="text-brand" />
      </div>
      <div>
       <div className={breadcrumbClassName}>
        <span className="font-semibold text-text-secondary">HSOCIETY</span>
        <span className="text-text-tertiary">/</span>
        <span className="font-semibold text-text-secondary">corporate-dashboard</span>
        <span className="rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold text-text-secondary">
         Private
        </span>
       </div>
      </div>
     </div>
     <div className="flex flex-wrap gap-2">
      <Button type="button" variant="primary" size="small" onClick={() => navigate('/engagements')}>
       <FiShield size={14} />
       Run Security Scan
      </Button>
      <Button type="button" variant="secondary" size="small" onClick={() => navigate('/reports')}>
       <FiFileText size={14} />
       View Reports
      </Button>
     </div>
    </div>
    <div className="flex flex-wrap gap-2">
     <span className={metaPillClassName}>
      <FiBarChart2 size={13} className="text-text-tertiary" />
      <span className={metaLabelClassName}>Security Score</span>
      <strong className="font-semibold text-text-primary">{renderMetaValue(securityScore, 38)}</strong>
     </span>
     <span className={metaPillClassName}>
      <FiActivity size={13} className="text-text-tertiary" />
      <span className={metaLabelClassName}>Engagements</span>
      <strong className="font-semibold text-text-primary">{renderMetaValue(activeEngagements, 28)}</strong>
     </span>
     <span className={metaPillClassName}>
      <FiAlertTriangle size={13} className="text-text-tertiary" />
      <span className={metaLabelClassName}>Critical</span>
      <strong className="font-semibold text-text-primary">{renderMetaValue(criticalCount, 28)}</strong>
     </span>
     <span className={metaPillClassName}>
      <FiFileText size={13} className="text-text-tertiary" />
      <span className={metaLabelClassName}>Last Scan</span>
      <strong className="font-semibold text-text-primary">{renderMetaValue(lastScan, 72)}</strong>
     </span>
    </div>
   </header>

   <div className="grid gap-6">
    <main className="min-w-0">
     {loading && (
      <div className="rounded-sm border border-border bg-bg-secondary p-5 text-sm text-text-secondary">
       <p>Loading your security dashboard...</p>
       <div className="mt-4 grid gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
         <div key={`cd-load-${index}`} className="h-12 rounded-xs bg-bg-tertiary" />
        ))}
       </div>
      </div>
     )}

     {error && !loading && (
      <div className="card-plain flex flex-col gap-3 p-5">
       <h3 className="text-base font-semibold text-text-primary">Dashboard Unavailable</h3>
       <p className="text-sm text-text-secondary">We couldn&apos;t load your security data.</p>
       <Button type="button" variant="secondary" size="small" onClick={loadDashboardData}>
        Retry
       </Button>
      </div>
     )}

     {!error && !loading && (
      <>
       <section className={sectionClassName}>
        <h2 className={sectionTitleClassName}>
         <FiShield size={15} className="text-text-tertiary" />
         Security Command Center
        </h2>
        <SecurityCommandCenterCard
         securityScore={securityScore}
         riskLevel={riskLevel}
         lastScan={lastScan}
         onRunScan={() => navigate('/engagements')}
         onViewReports={() => navigate('/reports')}
        />
       </section>
       <div className="h-px bg-border" />

       <section className={sectionClassName}>
        <h2 className={sectionTitleClassName}>
         <FiActivity size={15} className="text-text-tertiary" />
         Action Center
        </h2>
        <div className={sectionGridClassName}>
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
       <div className="h-px bg-border" />

       <section className={sectionClassName}>
        <h2 className={sectionTitleClassName}>
         <FiAlertTriangle size={15} className="text-text-tertiary" />
         Vulnerability Snapshot
        </h2>
        <VulnerabilitySnapshotCard
         breakdown={vulnerabilityBreakdown}
         onView={() => navigate('/remediation')}
        />
       </section>
       <div className="h-px bg-border" />

       <section className={sectionClassName}>
        <h2 className={sectionTitleClassName}>
         <FiFileText size={15} className="text-text-tertiary" />
         Activity & Reports
        </h2>
        <div className={sectionGridClassName}>
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
   </div>
  </div>
 );
};

export default Dashboard;
