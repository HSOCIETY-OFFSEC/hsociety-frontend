import React, { useEffect, useState } from 'react';
import { FiActivity, FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../../../../shared/components/ui/PageLoader';
import { getAdminOverview, getRumSummary } from '../services/admin.service';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import PublicError from '../../../../shared/components/ui/PublicError';

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
    <div className="w-full px-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1.25rem,3vw,2rem)] pb-16 text-text-primary">
      <header className="mb-6 flex flex-col gap-4 border-b border-border pb-5">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border bg-bg-secondary">
              <FiActivity size={20} className="text-brand" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[0.78rem] uppercase tracking-[0.08em] text-text-tertiary">
                <span className="font-semibold text-text-secondary">HSOCIETY</span>
                <span className="text-text-tertiary">/</span>
                <span className="font-semibold text-text-secondary">admin-overview</span>
                <span className="rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-[0.7rem] font-semibold text-text-secondary">
                  Admin
                </span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">Platform-wide stats and quick access to management tools.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2.5 py-1 text-[0.78rem] text-text-secondary">
            <FiUsers size={13} className="text-text-tertiary" />
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-text-tertiary">Users</span>
            <strong className="font-semibold text-text-primary">{users.total || 0}</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2.5 py-1 text-[0.78rem] text-text-secondary">
            <FiShield size={13} className="text-text-tertiary" />
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-text-tertiary">Pentests</span>
            <strong className="font-semibold text-text-primary">{pentests.total || 0}</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2.5 py-1 text-[0.78rem] text-text-secondary">
            <FiMessageSquare size={13} className="text-text-tertiary" />
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-text-tertiary">Messages</span>
            <strong className="font-semibold text-text-primary">{community.messages || 0}</strong>
          </span>
        </div>
      </header>

      <div className="grid gap-6">
        <main className="min-w-0">
          <PublicError
            message={error}
            className="mb-6 flex items-center gap-3 rounded-sm border border-[color-mix(in_srgb,#ef4444_30%,var(--border-color))] bg-[color-mix(in_srgb,#ef4444_8%,var(--card-bg))] px-4 py-3 text-sm text-[color-mix(in_srgb,#ef4444_80%,var(--text-primary))]"
          />

          <section className="py-5">
            <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-text-primary">
              <FiActivity size={15} className="text-text-tertiary" />
              Platform Overview
            </h2>
            <p className="mb-4 text-sm text-text-secondary">Live stats across users, pentests, and community activity.</p>
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
              {statCards.map((card) => (
                <div key={card.label} className="flex flex-col gap-2 rounded-sm border border-border bg-bg-secondary p-6">
                  <div className="flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                    {card.icon}
                    <span className="text-[0.78rem] text-text-secondary">{card.label}</span>
                  </div>
                  <strong className="text-[1.6rem] font-semibold tracking-[-0.03em] text-text-primary">{card.value}</strong>
                  <p className="text-[0.8rem] text-text-tertiary">{card.sub}</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1.5 text-[0.85rem] font-semibold text-text-primary transition-colors hover:border-[color-mix(in_srgb,var(--text-primary)_25%,var(--border-color))] hover:bg-bg-tertiary"
                    onClick={card.action}
                  >
                    {card.actionLabel}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-border" />

          <section className="py-5">
            <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-text-primary">
              <FiActivity size={15} className="text-text-tertiary" />
              Experience Telemetry
            </h2>
            <p className="mb-4 text-sm text-text-secondary">
              Dashboard load performance from real user sessions{rumWindow ? ` · last ${rumWindow} min` : ''}.
            </p>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
              {rumMetrics ? (
                rumCards.map((card) => {
                  const data = rumMetrics.byDashboard?.[card.key] || { count: 0, avg: 0, p95: 0 };
                  return (
                    <div key={card.key} className="flex flex-col gap-3 rounded-md border border-border bg-bg-primary p-4">
                      <span className="text-[0.7rem] uppercase tracking-[0.18em] text-text-tertiary">{card.label}</span>
                      <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(80px,1fr))]">
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-[0.08em] text-text-tertiary">Avg</span>
                          <strong className="block text-base">{data.avg} ms</strong>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-[0.08em] text-text-tertiary">P95</span>
                          <strong className="block text-base">{data.p95} ms</strong>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-[0.08em] text-text-tertiary">Samples</span>
                          <strong className="block text-base">{data.count}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-md border border-dashed border-border p-4 text-text-tertiary">No telemetry received yet.</div>
              )}
            </div>
          </section>

          <div className="h-px bg-border" />

          <section className="py-5">
            <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-text-primary">
              <FiShield size={15} className="text-text-tertiary" />
              Quick Actions
            </h2>
            <p className="mb-4 text-sm text-text-secondary">Jump into the tools you need to manage the platform.</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xs border border-brand bg-brand px-3 py-1.5 text-[0.85rem] font-semibold text-ink-onBrand transition-opacity hover:opacity-90"
                onClick={() => navigate('/mr-robot/users')}
              >
                <FiUsers size={14} /> Users
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1.5 text-[0.85rem] font-semibold text-text-primary transition-colors hover:border-[color-mix(in_srgb,var(--text-primary)_25%,var(--border-color))] hover:bg-bg-tertiary"
                onClick={() => navigate('/mr-robot/pentests')}
              >
                <FiShield size={14} /> Pentests
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1.5 text-[0.85rem] font-semibold text-text-primary transition-colors hover:border-[color-mix(in_srgb,var(--text-primary)_25%,var(--border-color))] hover:bg-bg-tertiary"
                onClick={() => navigate('/mr-robot/community')}
              >
                <FiMessageSquare size={14} /> Community
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1.5 text-[0.85rem] font-semibold text-text-primary transition-colors hover:border-[color-mix(in_srgb,var(--text-primary)_25%,var(--border-color))] hover:bg-bg-tertiary"
                onClick={() => navigate('/mr-robot/security')}
              >
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
