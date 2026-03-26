import React, { useEffect, useState } from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getReports } from '../services/reports.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS, buildEndpoint } from '../../../config/api/api.config';
import { logger } from '../../../core/logging/logger';
import '../styles/reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getReports();
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'load', response }));
      }
      setReports(response.data);
    } catch (err) {
      logger.error(err);
      setError('Unable to load reports at this time.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (report) => {
    if (!report?.id) return;
    const endpoint = buildEndpoint(API_ENDPOINTS.REPORTS.DOWNLOAD, { id: report.id });
    await apiClient.download(endpoint, `${report.title || report.id}.pdf`);
  };

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <p className="reports-kicker">Reports</p>
          <h1>Downloadable PDF Reports</h1>
          <p>Each card represents an engagement report that can be downloaded instantly.</p>
        </div>
        <Button variant="ghost" size="small" onClick={loadReports}>
          Refresh
        </Button>
      </header>

      {error && <p className="reports-error">{error}</p>}

      <div className="reports-grid">
        {loading
          ? [...Array(3)].map((_, index) => (
              <Card key={index} padding="large" shadow="small">
                <Skeleton className="skeleton-line" style={{ width: '65%', height: '24px' }} />
                <Skeleton className="skeleton-line" style={{ width: '40%' }} />
                <Skeleton className="skeleton-line" style={{ width: '80%' }} />
                <Skeleton className="skeleton-line" style={{ width: '40%' }} />
              </Card>
            ))
          : reports.map((report) => {
              const statusLabel = report.status || 'Draft';
              return (
                <Card key={report.id} className="report-card" padding="large" shadow="medium">
                  <div className="report-header">
                    <FiFileText size={20} />
                    <span className={`report-status status-${statusLabel.toLowerCase()}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <h3>{report.title}</h3>
                  <p className="report-engagement">{report.engagementName}</p>
                  <p className="report-date">
                    Generated on{' '}
                    {new Date(report.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <Button variant="secondary" size="small" onClick={() => downloadReport(report)}>
                    Download PDF <FiDownload size={16} />
                  </Button>
                </Card>
              );
            })}
      </div>
    </div>
  );
};

export default Reports;
