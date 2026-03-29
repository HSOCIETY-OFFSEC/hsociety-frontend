import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
 FiActivity,
 FiArrowRight,
 FiBell,
 FiBookOpen,
 FiCheckCircle,
 FiCompass,
 FiCreditCard,
 FiLock,
 FiMessageSquare,
 FiShoppingBag,
 FiShield,
 FiTarget,
 FiUserPlus
} from 'react-icons/fi';
import { getStudentOverview } from '../services/student.service';
import { listNotifications } from '../../../student/services/notifications.service';
import useBootcampAccess from '../../../student/hooks/useBootcampAccess';
import StudentXpSummaryCard from '../components/StudentXpSummaryCard';
import StudentRecentNotificationsCard from '../components/StudentRecentNotificationsCard';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import SkillProgressCard from '../components/SkillProgressCard';
import Skeleton from '../../../../shared/components/ui/Skeleton';
import Button from '../../../../shared/components/ui/Button';
import Card from '../../../../shared/components/ui/Card';
import reportRum from '../../../../shared/utils/perf/rum';
import { logger } from '../../../../core/logging/logger';
import { envConfig } from '../../../../config/app/env.config';

const pageClassName =
 'min-h-[calc(100vh-60px)] w-full max-w-[1280px] mx-auto px-[clamp(1.1rem,4vw,2.25rem)] pt-[clamp(1.75rem,3.2vw,2.75rem)] pb-16 text-text-primary';
const headerClassName = 'mb-8 flex flex-col gap-4';
const headerInnerClassName = 'flex flex-wrap items-center justify-between gap-6';
const breadcrumbClassName = 'flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary';
const metaPillClassName =
  'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';
const metaLabelClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
const panelClassName =
  'flex flex-col gap-5 card-plain p-6';
const progressBarClassName = 'h-1.5 w-full rounded-full bg-bg-tertiary';
const progressFillClassName = 'block h-full rounded-full bg-brand';
const itemListClassName = 'overflow-hidden rounded-sm border border-border';
const itemRowClassName =
  'flex flex-col gap-3 border-b border-border bg-bg-secondary px-4 py-4 text-sm transition-colors hover:bg-bg-tertiary sm:flex-row sm:items-center sm:justify-between';
const actionGridClassName =
 'grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]';
const labelBaseClassName =
 'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold';
const labelStyles = {
 alpha: 'border-brand/30 bg-brand/10 text-brand',
 beta: 'border-status-success/30 bg-status-success/10 text-status-success',
 gamma: 'border-status-warning/30 bg-status-warning/10 text-status-warning',
 delta: 'border-status-purple/30 bg-status-purple/10 text-status-purple',
};

const StudentDashboard = () => {
 const navigate = useNavigate();
 const [loading, setLoading] = useState(true);
 const [data, setData] = useState({
  learningPath: [],
  modules: [],
  snapshot: [],
  bootcampStatus: 'not_enrolled',
  bootcampPaymentStatus: 'unpaid'
 });
 const [error, setError] = useState('');
 const [notifications, setNotifications] = useState([]);
 const { isRegistered, isPaid, accessRevoked } = useBootcampAccess();
 const bootcampComingSoon = envConfig.features.bootcampComingSoon;
 const rumSentRef = useRef(false);
 const loadStartRef = useRef(performance.now());
 const loadStudentData = useCallback(async () => {
  setLoading(true);
  setError('');
  try {
   const [response, notificationsResponse] = await Promise.all([
    getStudentOverview(),
    listNotifications(),
   ]);
   if (!response.success) {
    throw new Error(getPublicErrorMessage({ action: 'load', response }));
   }
   setData(response.data);
   if (notificationsResponse.success) {
    setNotifications(notificationsResponse.data || []);
   }
  } catch (err) {
   logger.error('Student dashboard error:', err);
   setError('Unable to load student dashboard data.');
  } finally {
   setLoading(false);
  }
 }, []);

 useEffect(() => {
  loadStudentData();
 }, [loadStudentData]);

 useEffect(() => {
  if (loading || rumSentRef.current) return;
  rumSentRef.current = true;
  const duration = Math.round(performance.now() - loadStartRef.current);
  reportRum({
   metric: 'dashboard_load',
   value: duration,
   tags: { dashboard: 'student', status: error ? 'error' : 'success' }
  });
 }, [loading, error]);

 const continueModule = useMemo(() => {
  if (data.learningPath?.length) {
   return data.learningPath.find((item) => item.status === 'in-progress' || item.status === 'current')
    || data.learningPath.find((item) => item.status === 'next')
    || data.learningPath[0];
  }
  if (data.modules?.length) {
   return data.modules.find((item) => (Number(item.progress) || 0) < 100) || data.modules[0];
  }
  return null;
 }, [data.learningPath, data.modules]);

 const primaryAction = useMemo(
  () => ({ label: 'Explore Free Resources', onClick: () => navigate('/student-resources') }),
  [navigate]
 );

 const skillPillars = useMemo(() => {
  const parsePercent = (value) => {
   const raw = String(value || '').replace(/[^\d.]/g, '');
   return Math.max(0, Math.min(100, Math.round(Number(raw) || 0)));
  };

  const getSnapshotValue = (keyword) => {
   const match = data.snapshot?.find((item) =>
    item.label?.toLowerCase().includes(keyword)
   );
   return match ? parsePercent(match.value) : null;
  };

  const avgModuleProgress = (keywords) => {
   const matches = (data.modules || []).filter((module) =>
    keywords.some((keyword) => module.title?.toLowerCase().includes(keyword))
   );
   if (!matches.length) return null;
   const avg = matches.reduce((sum, item) => sum + (Number(item.progress) || 0), 0) / matches.length;
   return Math.round(avg);
  };

  const fallbackValue = (keywords) =>
   avgModuleProgress(keywords) ?? getSnapshotValue(keywords[0]) ?? 0;

  return [
   { key: 'linux', label: 'Linux', progress: fallbackValue(['linux', 'terminal']) },
   { key: 'networking', label: 'Networking', progress: fallbackValue(['network', 'tcp']) },
   { key: 'web', label: 'Web Hacking', progress: fallbackValue(['web', 'http']) },
   { key: 'priv-esc', label: 'Privilege Escalation', progress: fallbackValue(['privilege', 'escalation', 'privesc']) }
  ];
 }, [data.modules, data.snapshot]);

 const bootcampProgressItems = useMemo(() => {
  const source = (data.learningPath && data.learningPath.length)
   ? data.learningPath
   : (data.modules || []);

  return (source || []).map((item, index) => ({
   ...item,
   phaseNumber: Number(item.id) || index + 1,
   status: item.status || (Number(item.progress) >= 100 ? 'done' : index === 0 ? 'in-progress' : 'next')
  }));
 }, [data.learningPath, data.modules]);

 const xpTotal = Number(data.xpSummary?.totalXp || 0);
 const moduleCount = data.learningPath?.length || data.modules?.length || 0;
 const showData = !loading && !error;
 const onboardingComplete = Boolean(data.onboarding?.completed);

 const renderMetaValue = (value, width = 36) => {
  if (loading) {
   return <Skeleton className="h-3 rounded-full" style={{ width }} />;
  }
  if (error) return '—';
  return value;
 };

 const statusMeta = useMemo(() => {
  if (bootcampComingSoon) {
   return {
    label: 'BOOTCAMP STATUS',
    value: 'COMING SOON',
    note: 'Bootcamp access opens soon. Explore free resources and join the community.',
    fill: 10,
    paused: true
   };
  }
  if (accessRevoked) {
   return {
    label: 'BOOTCAMP STATUS',
    value: 'REVOKED',
    note: 'Access was revoked. Contact support to resolve.',
    fill: 20,
    paused: true
   };
  }
  if (!isRegistered) {
   return {
    label: 'BOOTCAMP STATUS',
    value: 'NOT ENROLLED',
    note: 'Register to unlock bootcamp phases.',
    fill: 20,
    paused: true
   };
  }
  if (!isPaid) {
   return {
    label: 'BOOTCAMP STATUS',
    value: 'PAYMENT DUE',
    note: 'Complete payment to unlock phases.',
    fill: 20,
    paused: true
   };
  }
  const hasActive = bootcampProgressItems.some((item) => {
   const status = String(item.status || '').toLowerCase();
   return status === 'in-progress' || status === 'current';
  });
  const avgProgress = bootcampProgressItems.length
   ? Math.round(bootcampProgressItems.reduce((sum, item) => sum + (Number(item.progress) || 0), 0) / bootcampProgressItems.length)
   : 0;

  if (avgProgress >= 100) {
   return {
    label: 'BOOTCAMP STATUS',
    value: 'COMPLETE',
    note: 'All phases completed. Ready for advanced tracks.',
    fill: 100,
    paused: false
   };
  }

  return {
   label: 'BOOTCAMP STATUS',
   value: hasActive ? 'ACTIVE' : 'OPEN',
   note: hasActive ? 'Current phase in progress.' : 'Choose a phase to begin.',
   fill: hasActive ? 70 : 40,
   paused: false
  };
 }, [accessRevoked, bootcampProgressItems, isPaid, isRegistered]);

 return (
  <div className={pageClassName}>
   <header className={headerClassName}>
    <div className={headerInnerClassName}>
     <div className="flex items-center gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border bg-bg-secondary">
       <FiCompass size={20} className="text-brand" />
      </div>
      <div>
       <div className={breadcrumbClassName}>
        <span className="font-semibold text-text-secondary">HSOCIETY</span>
        <span className="text-text-tertiary">/</span>
        <span className="font-semibold text-text-secondary">student-dashboard</span>
        <span className="rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold text-text-secondary">
         Private
        </span>
       </div>
      </div>
     </div>
     <div className="flex flex-wrap gap-2">
      <Button
       type="button"
       variant="secondary"
       size="small"
       onClick={() => navigate('/student-resources')}
       disabled={loading}
      >
       <FiBookOpen size={16} />
       Free Resources
      </Button>
      <Button
       type="button"
       variant="primary"
       size="small"
       onClick={() => navigate('/community')}
       disabled={loading}
      >
       <FiMessageSquare size={16} />
       Join Community
      </Button>
     </div>
    </div>
    <div className="flex flex-wrap gap-2">
     <span className={metaPillClassName}>
      <FiTarget size={13} className="text-text-tertiary" />
      <span className={metaLabelClassName}>XP</span>
      <strong className="font-semibold text-text-primary">{renderMetaValue(xpTotal, 34)}</strong>
     </span>
     <span className={metaPillClassName}>
      <FiBookOpen size={13} className="text-text-tertiary" />
      <span className={metaLabelClassName}>Modules</span>
      <strong className="font-semibold text-text-primary">{renderMetaValue(moduleCount, 28)}</strong>
     </span>
     <span className={metaPillClassName}>
      <FiBell size={13} className="text-text-tertiary" />
      <span className={metaLabelClassName}>Alerts</span>
      <strong className="font-semibold text-text-primary">{renderMetaValue(notifications.length, 24)}</strong>
     </span>
     <span className={metaPillClassName}>
      <FiActivity size={13} className="text-text-tertiary" />
      <span className={metaLabelClassName}>Bootcamp</span>
      <strong className="font-semibold text-text-primary">{renderMetaValue(statusMeta.value, 54)}</strong>
     </span>
    </div>
   </header>

   <div className="grid gap-8">
    <main className="min-w-0">
     <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-text-primary">
       <FiCompass size={15} className="text-text-tertiary" />
       Student essentials
      </h2>
      <div className={actionGridClassName}>
       <Card padding="medium" shadow="small" className="border-border bg-card">
        <div className="flex items-start gap-3">
         <span className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-bg-secondary text-brand">
          <FiUserPlus size={18} />
         </span>
         <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Complete registration</h3>
          <p className="text-sm text-text-secondary">
           Finish your student profile to unlock learning pathways and marketplace access.
          </p>
          <Button
           type="button"
           variant="secondary"
           size="small"
           onClick={() => navigate('/student-onboarding')}
          >
           Register now <FiArrowRight size={14} />
          </Button>
         </div>
        </div>
       </Card>
       <Card padding="medium" shadow="small" className="border-border bg-card">
        <div className="flex items-start gap-3">
         <span className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-bg-secondary text-brand">
          <FiShoppingBag size={18} />
         </span>
         <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Visit the marketplace</h3>
          <p className="text-sm text-text-secondary">
           Explore labs, tools, and challenges available with your CP balance.
          </p>
          <Button
           type="button"
           variant="primary"
           size="small"
           onClick={() => navigate('/cp-marketplace')}
          >
           Open marketplace <FiArrowRight size={14} />
          </Button>
         </div>
        </div>
       </Card>
       <Card padding="medium" shadow="small" className="border-border bg-card">
        <div className="flex items-start gap-3">
         <span className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-bg-secondary text-brand">
          <FiCreditCard size={18} />
         </span>
         <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Manage your wallet</h3>
          <p className="text-sm text-text-secondary">
           Track CP earnings, redemptions, and wallet history in one place.
          </p>
          <Button
           type="button"
           variant="secondary"
           size="small"
           onClick={() => navigate('/cp-wallet')}
          >
           View wallet <FiArrowRight size={14} />
          </Button>
         </div>
        </div>
       </Card>
      </div>
     </section>
     {!onboardingComplete && (
      <div className={panelClassName}>
       <p className="text-sm text-text-secondary">Complete onboarding to unlock your full HSOCIETY experience.</p>
       <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => navigate('/student-onboarding')}
       >
        Go to Onboarding <FiArrowRight size={14} />
       </Button>
      </div>
     )}
     {loading && (
      <div className="rounded-sm border border-border bg-bg-secondary p-5 text-sm text-text-secondary">
       <p>Loading your training data...</p>
       <div className="mt-4 grid gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
         <div key={`sd-load-${index}`} className="h-12 rounded-xs bg-bg-tertiary" />
        ))}
       </div>
      </div>
     )}

     {error && !loading && (
      <div className={panelClassName}>
       <div className="flex items-center gap-2 font-semibold text-text-primary">
        <FiShield size={18} />
        <h3 className="text-sm">Something went wrong</h3>
       </div>
       <p className="text-sm text-text-secondary">We couldn&apos;t load your training dashboard.</p>
       <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={loadStudentData}
       >
        Reload Dashboard
       </Button>
      </div>
     )}

     {!error && !loading && (
      <>
       <div className={panelClassName}>
        <div className="flex items-center gap-2 font-semibold text-text-primary">
         <FiBookOpen size={18} />
         <h3 className="text-sm">Start With Free Resources</h3>
        </div>
        <p className="text-sm text-text-secondary">Bootcamp modules are opening soon. In the meantime, dive into curated free learning and connect with the community.</p>
        <div className="flex flex-wrap gap-3">
         <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={() => navigate('/student-resources')}
         >
          Browse Free Resources <FiArrowRight size={14} />
         </Button>
         <Button
          type="button"
          variant="primary"
          size="small"
          onClick={() => navigate('/community')}
         >
          Open Community <FiArrowRight size={14} />
         </Button>
        </div>
       </div>
       <section className="py-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-text-primary">
         <FiCompass size={15} className="text-text-tertiary" />
         Continue Learning
        </h2>
        <div className={`${panelClassName} lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center`}>
         <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-text-primary">{continueModule?.title || 'Start your bootcamp'}</h3>
          <p className="text-sm text-text-secondary">
           Phase {continueModule?.id || '1'}
           {continueModule?.roomsTotal
            ? ` · Rooms ${continueModule?.roomsCompleted || 0}/${continueModule?.roomsTotal}`
            : ''}
          </p>
          <div className={progressBarClassName} role="presentation">
           <span
            className={progressFillClassName}
            style={{ width: `${Math.round(continueModule?.progress || 0)}%` }}
           />
          </div>
          <span className="text-xs text-text-tertiary">
           Progress {Math.round(continueModule?.progress || 0)}%
          </span>
         </div>
         <Button
          type="button"
          variant="primary"
          size="small"
          onClick={primaryAction.onClick}
         >
          {primaryAction.label} <FiArrowRight size={14} />
         </Button>
        </div>
       </section>
       <section className="py-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-text-primary">
         <FiTarget size={15} className="text-text-tertiary" />
         Current Phase & Role
        </h2>
        <div className={`${panelClassName} lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center`}>
         <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-text-primary">
           {data.progressMeta?.currentPhase?.title || 'Phase 1'}
          </h3>
          <p className="text-sm text-text-secondary">
           Role: {data.progressMeta?.earned?.roleTitle || 'Candidate'}
          </p>
          <span className="text-xs text-text-tertiary">
           Badge: {data.progressMeta?.earned?.badge || 'Complete phases to unlock badges.'}
          </span>
         </div>
         <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={() => navigate('/student-bootcamps/overview')}
         >
          View Bootcamp <FiArrowRight size={14} />
         </Button>
        </div>
       </section>
       <div className="h-px bg-border" />

       <section className="py-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-text-primary">
         <FiBookOpen size={15} className="text-text-tertiary" />
         Bootcamp Progress
        </h2>
        <div className={itemListClassName}>
         {bootcampProgressItems.length === 0 ? (
          <div className="bg-bg-secondary px-4 py-4 text-sm text-text-tertiary">No bootcamp phases yet.</div>
         ) : (
          bootcampProgressItems.map((phase) => {
           const progress = Number(phase.progress) || 0;
           const status = String(phase.status || '').toLowerCase();
           const isCompleted = status === 'done' || progress >= 100;
           const isCurrent = status === 'in-progress' || status === 'current';
           const labelClass = isCompleted
            ? labelStyles.beta
            : isCurrent
             ? labelStyles.alpha
             : labelStyles.gamma;

           return (
            <article key={phase.id} className={itemRowClassName}>
             <div className="min-w-0">
              <span className="block font-semibold text-text-primary">Phase {phase.phaseNumber}</span>
              <span className="text-sm text-text-secondary">{phase.title}</span>
             </div>
             <div className="flex w-full items-center justify-start gap-3 sm:w-auto sm:justify-end">
              <span className={`${labelBaseClassName} ${labelClass}`}>
               {isCompleted ? (
                <>
                 <FiCheckCircle size={12} />
                 Completed
                </>
               ) : isCurrent ? (
                <>
                 <FiArrowRight size={12} />
                 Current
                </>
               ) : (
                <>
                 <FiLock size={12} />
                 Locked
                </>
               )}
              </span>
              <span className="text-xs text-text-tertiary">{progress}%</span>
             </div>
            </article>
           );
          })
         )}
        </div>
       </section>
       <div className="h-px bg-border" />

       <section className="py-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-text-primary">
         <FiActivity size={15} className="text-text-tertiary" />
         Progress Overview
        </h2>
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
         <StudentXpSummaryCard xpSummary={data.xpSummary} />
         <SkillProgressCard pillars={skillPillars} />
        </div>
       </section>
       <div className="h-px bg-border" />

       <section className="py-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-text-primary">
         <FiMessageSquare size={15} className="text-text-tertiary" />
         Community & Updates
        </h2>
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
         <StudentRecentNotificationsCard notifications={notifications} />
         <div className={panelClassName}>
          <div className="flex items-center gap-2 font-semibold text-text-primary">
           <FiMessageSquare size={18} />
           <h3 className="text-sm">Community</h3>
          </div>
          <Button
           type="button"
           variant="secondary"
           size="small"
           onClick={() => navigate('/community')}
          >
           Open Community
          </Button>
         </div>
        </div>
       </section>
      </>
     )}
    </main>
   </div>
  </div>
 );
};

export default StudentDashboard;
