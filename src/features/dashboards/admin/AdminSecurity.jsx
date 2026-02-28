import React, { useEffect, useState } from 'react';
import { FiActivity, FiAlertTriangle, FiGlobe, FiLock } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import PageLoader from '../../../shared/components/ui/PageLoader';
import { getSecurityEvents, getSecuritySummary } from './admin.service';
import '../../../styles/dashboards/admin/index.css';

const AdminSecurity = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      const [eventsRes, summaryRes] = await Promise.all([getSecurityEvents(120), getSecuritySummary()]);
      if (!mounted) return;

      if (!eventsRes.success) setError(eventsRes.error || 'Failed to load events');
      if (!summaryRes.success) setError(summaryRes.error || 'Failed to load summary');

      setEvents(eventsRes.data?.items || []);
      setSummary(summaryRes.data || {});
      setLoading(false);
    };

    load();
    const interval = window.setInterval(load, 30 * 1000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  if (loading) return <PageLoader message="Loading security telemetry..." durationMs={0} />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-shell">
        <div className="admin-hero dashboard-shell-header">
          <div>
            <p className="admin-kicker dashboard-shell-kicker">MINI SOC</p>
            <h1 className="dashboard-shell-title">Security Activity Feed</h1>
            <p className="admin-subtitle dashboard-shell-subtitle">
              Real-time IP activity, auth failures, and API security signals.
            </p>
          </div>
        </div>

        {error && <div className="admin-alert">{error}</div>}

        <div className="admin-overview-grid">
          <Card className="admin-card" padding="medium">
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
            <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>
              {summary.macAddressNote || 'MAC addresses are unavailable from browser traffic.'}
            </p>
          </Card>
        </div>

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Latest Security Events</h2>
            <p>Latest 120 events across authentication and route activity.</p>
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
                    <td>{new Date(event.createdAt).toLocaleString()}</td>
                    <td>{event.eventType}</td>
                    <td>{event.action}</td>
                    <td>{event.user?.email || 'anonymous'}</td>
                    <td>{event.ipAddress || '-'}</td>
                    <td>{event.macAddress || 'unavailable'}</td>
                    <td>{event.path || '-'}</td>
                    <td>
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
