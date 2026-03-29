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

const reportStatusStyles = {
  final: 'border-status-success/40 bg-status-success/10 text-status-success',
  draft: 'border-status-warning/40 bg-status-warning/10 text-status-warning',
  pending: 'border-status-info/40 bg-status-info/10 text-status-info',
  archived: 'border-border bg-bg-secondary text-text-tertiary',
};

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
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-tertiary">Reports</p>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Downloadable PDF Reports</h1>
          <p className="text-sm leading-relaxed text-text-secondary">
            Each card represents an engagement report that can be downloaded instantly.
          </p>
        </div>
        <Button variant="ghost" size="small" onClick={loadReports}>
          Refresh
        </Button>
      </header>

      {error && (
        <p className="rounded-md border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [...Array(3)].map((_, index) => (
              <Card key={index} padding="large" shadow="small">
                <Skeleton className="h-6 w-2/3 rounded-md" />
                <Skeleton className="h-4 w-2/5 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-2/5 rounded-md" />
              </Card>
            ))
          : reports.map((report) => {
              const statusLabel = report.status || 'Draft';
              const statusKey = statusLabel.toLowerCase();
              const statusClass = reportStatusStyles[statusKey] || reportStatusStyles.archived;
              return (
                <Card key={report.id} className="flex flex-col gap-2 transition-colors hover:border-brand/30" padding="large" shadow="medium">
                  <div className="flex items-center justify-between">
                    <FiFileText size={20} className="text-text-tertiary" />
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">{report.title}</h3>
                  <p className="text-sm text-text-secondary">{report.engagementName}</p>
                  <p className="text-xs text-text-tertiary">
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
