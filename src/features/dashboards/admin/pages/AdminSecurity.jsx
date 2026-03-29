import React, { useEffect, useState } from 'react';
import { FiActivity, FiAlertTriangle, FiDownload, FiGlobe, FiLock } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';
import TableSkeleton from '../../../../shared/components/ui/TableSkeleton';
import { downloadSecurityEventsCsv, getSecurityEvents, getSecuritySummary } from '../services/admin.service';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import PublicError from '../../../../shared/components/ui/PublicError';

const alertClassName =
 'flex items-center gap-3 rounded-sm border border-[color-mix(in_srgb,#ef4444_30%,var(--border-color))] bg-[color-mix(in_srgb,#ef4444_8%,var(--card-bg))] px-4 py-3 text-sm text-[color-mix(in_srgb,#ef4444_80%,var(--text-primary))]';

const cardClassName =
 'card-plain';

const AdminSecurity = () => {
 const pageSize = 60;
 const [loading, setLoading] = useState(true);
 const [events, setEvents] = useState([]);
 const [summary, setSummary] = useState({});
 const [error, setError] = useState('');
 const [page, setPage] = useState(1);
 const [total, setTotal] = useState(0);

 useEffect(() => {
  let mounted = true;
  const load = async () => {
   setLoading(true);
   setError('');
   const [eventsRes, summaryRes] = await Promise.all([getSecurityEvents(pageSize, page), getSecuritySummary()]);
   if (!mounted) return;

   if (!eventsRes.success) setError(getPublicErrorMessage({ action: 'load', response: eventsRes }));
   if (!summaryRes.success) setError(getPublicErrorMessage({ action: 'load', response: summaryRes }));

   setEvents(eventsRes.data?.items || []);
   setTotal(Number(eventsRes.data?.total || 0));
   setSummary(summaryRes.data || {});
   setLoading(false);
  };

  load();
  const interval = window.setInterval(load, 30 * 1000);
  return () => {
   mounted = false;
   window.clearInterval(interval);
  };
 }, [page]);

 const totalPages = Math.max(1, Math.ceil(total / pageSize));

 const handleDownload = async () => {
  const response = await downloadSecurityEventsCsv(pageSize, page);
  if (!response.success) {
   setError(getPublicErrorMessage({ action: 'load', response }));
   return;
  }
  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `security-events-page-${page}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
 };

 if (loading) {
  return (
   <div className="min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1.25rem,3vw,2rem)] pb-16 text-text-primary">
    <div className="flex flex-col gap-6">
     <TableSkeleton rows={8} columns={7} />
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1.25rem,3vw,2rem)] pb-16 text-text-primary">
   <div className="flex flex-col gap-6">
    <PublicError message={error} className={`${alertClassName} mb-0`} />

    <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
     <Card className={cardClassName} padding="medium" shadow="none">
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
       <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-primary px-3 py-2">
        <FiActivity size={16} />
        <span className="text-xs uppercase tracking-widest text-text-tertiary">Events (24h)</span>
        <strong className="text-base text-text-primary">{summary.events24h || 0}</strong>
       </div>
       <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-primary px-3 py-2">
        <FiGlobe size={16} />
        <span className="text-xs uppercase tracking-widest text-text-tertiary">Unique IPs</span>
        <strong className="text-base text-text-primary">{summary.uniqueIps24h || 0}</strong>
       </div>
       <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-primary px-3 py-2">
        <FiAlertTriangle size={16} />
        <span className="text-xs uppercase tracking-widest text-text-tertiary">Auth/API Failures</span>
        <strong className="text-base text-text-primary">{summary.authFailures24h || 0}</strong>
       </div>
      </div>
      <p className="mt-3 text-sm text-text-secondary">
       {summary.macAddressNote || 'MAC addresses are unavailable from browser traffic.'}
      </p>
     </Card>
    </div>

    <Card className={cardClassName} padding="medium" shadow="none">
     <div className="mb-4 flex flex-col gap-1.5">
      <h2 className="text-base font-semibold text-text-primary">Latest Security Events</h2>
      <p className="text-sm text-text-secondary">Latest security events across authentication and route activity.</p>
     </div>
     <div className="flex flex-wrap items-center justify-between gap-3">
      <Button type="button" variant="secondary" size="small" onClick={handleDownload}>
       <FiDownload size={14} /> Download CSV
      </Button>
      <div className="flex items-center gap-3 text-sm text-text-secondary">
       <Button
        type="button"
        variant="ghost"
        size="small"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page <= 1}
       >
        Prev
       </Button>
       <span>Page {page} of {totalPages}</span>
       <Button
        type="button"
        variant="ghost"
        size="small"
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page >= totalPages}
       >
        Next
       </Button>
      </div>
     </div>
     <div className="mt-4 w-full overflow-x-auto">
      <table className="block w-full min-w-[600px] border-collapse table-fixed text-left sm:table sm:min-w-[600px]">
       <thead className="hidden sm:table-header-group">
        <tr className="border-b-2 border-border">
         <th className="px-2 py-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">Time</th>
         <th className="px-2 py-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">Type</th>
         <th className="px-2 py-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">Action</th>
         <th className="px-2 py-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">User</th>
         <th className="px-2 py-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">IP</th>
         <th className="px-2 py-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">MAC</th>
         <th className="px-2 py-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">Path</th>
         <th className="px-2 py-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">Status</th>
        </tr>
       </thead>
       <tbody className="block w-full sm:table-row-group">
        {events.map((event) => (
         <tr
          key={event.id}
          className="mb-3 block rounded-md border border-border bg-bg-secondary px-3 py-3 sm:mb-0 sm:table-row sm:rounded-none sm:border-0 sm:bg-transparent"
         >
          <td
           data-label="Time"
           className="block py-1 text-sm text-text-primary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:table-cell sm:py-2 sm:before:content-none"
          >
           {new Date(event.createdAt).toLocaleString()}
          </td>
          <td
           data-label="Type"
           className="block py-1 text-sm text-text-primary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:table-cell sm:py-2 sm:before:content-none"
          >
           {event.eventType}
          </td>
          <td
           data-label="Action"
           className="block py-1 text-sm text-text-primary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:table-cell sm:py-2 sm:before:content-none"
          >
           {event.action}
          </td>
          <td
           data-label="User"
           className="block py-1 text-sm text-text-primary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:table-cell sm:py-2 sm:before:content-none"
          >
           {event.user?.email || 'anonymous'}
          </td>
          <td
           data-label="IP"
           className="block py-1 text-sm text-text-primary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:table-cell sm:py-2 sm:before:content-none"
          >
           {event.ipAddress || '-'}
          </td>
          <td
           data-label="MAC"
           className="block py-1 text-sm text-text-primary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:table-cell sm:py-2 sm:before:content-none"
          >
           {event.macAddress || 'unavailable'}
          </td>
          <td
           data-label="Path"
           className="block py-1 text-sm text-text-primary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:table-cell sm:py-2 sm:before:content-none"
          >
           {event.path || '-'}
          </td>
          <td
           data-label="Status"
           className="block py-1 text-sm text-text-primary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:table-cell sm:py-2 sm:before:content-none"
          >
           {event.statusCode > 0 ? event.statusCode : <FiLock size={14} />}
          </td>
         </tr>
        ))}
        {events.length === 0 && (
         <tr className="block sm:table-row">
          <td className="block px-2 py-3 text-sm text-text-tertiary sm:table-cell" colSpan={8}>
           No events available.
          </td>
         </tr>
        )}
       </tbody>
      </table>
     </div>
    </Card>
   </div>
  </div>
 );
};

export default AdminSecurity;
