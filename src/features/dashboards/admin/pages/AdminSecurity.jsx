import React, { useEffect, useState } from 'react';
import { FiActivity, FiAlertTriangle, FiDownload, FiGlobe, FiLock } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import TableSkeleton from '../../../../shared/components/ui/TableSkeleton';
import { downloadSecurityEventsCsv, getSecurityEvents, getSecuritySummary } from '../services/admin.service';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import PublicError from '../../../../shared/components/ui/PublicError';
import '../styles/admin-dashboard.css';

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
      <div className="admin-dashboard">
        <div className="flex flex-col gap-5">
          <TableSkeleton rows={8} columns={7} />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="flex flex-col gap-5">
        <PublicError message={error} className="admin-alert" />

        <div className="admin-overview-grid">
          <Card className="admin-card dashboard-card" padding="medium">
            <div className="admin-overview-stats">
              <div>
                <FiActivity size={16} />
                <span>Events (24h)</span>
                <strong>{summary.events24h || 0}</strong>
              </div>
              <div>
                <FiGlobe size={16} />
                <span>Unique IPs</span>
                <strong>{summary.uniqueIps24h || 0}</strong>
              </div>
              <div>
                <FiAlertTriangle size={16} />
                <span>Auth/API Failures</span>
                <strong>{summary.authFailures24h || 0}</strong>
              </div>
            </div>
            <p className="admin-security-note">
              {summary.macAddressNote || 'MAC addresses are unavailable from browser traffic.'}
            </p>
          </Card>
        </div>

        <Card className="admin-card dashboard-card" padding="medium">
          <div className="admin-section-header">
            <h2>Latest Security Events</h2>
            <p>Latest security events across authentication and route activity.</p>
          </div>
          <div className="admin-toolbar">
            <button
              type="button"
              className="ad-btn ad-btn-secondary"
              onClick={handleDownload}
            >
              <FiDownload size={14} /> Download CSV
            </button>
            <div className="admin-pagination">
              <button
                type="button"
                className="ad-btn ad-btn-ghost"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                type="button"
                className="ad-btn ad-btn-ghost"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>IP</th>
                  <th>MAC</th>
                  <th>Path</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td data-label="Time">{new Date(event.createdAt).toLocaleString()}</td>
                    <td data-label="Type">{event.eventType}</td>
                    <td data-label="Action">{event.action}</td>
                    <td data-label="User">{event.user?.email || 'anonymous'}</td>
                    <td data-label="IP">{event.ipAddress || '-'}</td>
                    <td data-label="MAC">{event.macAddress || 'unavailable'}</td>
                    <td data-label="Path">{event.path || '-'}</td>
                    <td data-label="Status">
                      {event.statusCode > 0 ? event.statusCode : <FiLock size={14} />}
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={8}>No events available.</td>
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
