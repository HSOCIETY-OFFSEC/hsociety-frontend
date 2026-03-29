import React, { useEffect, useState } from 'react';
import { FiShield, FiCheckCircle, FiAlertTriangle, FiDownload } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getRemediationReports, getRemediationSummary } from '../services/remediation.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS, buildEndpoint } from '../../../config/api/api.config';
import { logger } from '../../../core/logging/logger';

const Remediation = () => {
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
    fetchReports();
  }, []);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await getRemediationSummary();
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'load', response }));
      }
      setSummary(response.data);
    } catch (err) {
      logger.error(err);
      setError('Unable to load remediation overview.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const response = await getRemediationReports();
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'load', response }));
      }
      setReports(response.data);
    } catch (err) {
      logger.error(err);
      setError('Unable to load remediation reports.');
    } finally {
      setLoadingReports(false);
    }
  };

  const downloadReport = async (report) => {
    if (!report?.id) return;
    const endpoint = buildEndpoint(API_ENDPOINTS.REMEDIATION.DOWNLOAD, { id: report.id });
    await apiClient.download(endpoint, `${report.title || report.id}.pdf`);
  };

  const summaryStats = [
    {
      label: 'Total Vulnerabilities',
      value: summary?.totalVulnerabilities,
      icon: FiAlertTriangle
    },
    {
      label: 'Fixed Vulnerabilities',
      value: summary?.fixedVulnerabilities,
      icon: FiCheckCircle
    },
    {
      label: 'Open Vulnerabilities',
      value: summary?.openVulnerabilities,
      icon: FiShield
    },
    {
      label: 'Remediation Rate',
      value: summary?.remediationRate,
      suffix: '%',
      icon: FiShield
    }
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Remediation Progress</h1>
          <p className="text-sm leading-relaxed text-text-secondary">
            Monitor fixed vs open vulnerabilities and download remediation reports.
          </p>
        </div>
        <Button variant="ghost" size="small" onClick={fetchSummary}>
          Refresh Summary
        </Button>
      </header>

      {error && (
        <p className="rounded-md border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loadingSummary
          ? summaryStats.map((_, index) => (
              <Card key={index} padding="medium" shadow="small">
                <Skeleton className="h-5 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-3/5 rounded-md" />
              </Card>
            ))
          : summaryStats.map((stat) => (
              <Card key={stat.label} padding="medium" shadow="small" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-bg-secondary text-text-secondary">
                  <stat.icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight text-text-primary">
                    {stat.value ?? 0}
                    {stat.suffix || ''}
                  </p>
                </div>
              </Card>
            ))}
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-text-primary">Remediation Reports</h2>
          <p className="text-sm text-text-secondary">Each report is a downloadable PDF outlining next steps.</p>
        </div>
        <div className="flex flex-col gap-3">
          {loadingReports
            ? [...Array(2)].map((_, index) => (
                <Card key={index} padding="large" shadow="small" className="flex flex-wrap items-center justify-between gap-4">
                  <Skeleton className="h-5 w-4/5 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                </Card>
              ))
            : reports.map((report) => (
                <Card
                  key={report.id}
                  padding="large"
                  shadow="medium"
                  className="flex flex-wrap items-center justify-between gap-4 transition-colors hover:border-brand/30"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-text-primary">{report.title}</h3>
                    <p className="text-sm text-text-secondary">{report.owner}</p>
                    <small className="text-xs text-text-tertiary">
                      Generated on{' '}
                      {new Date(report.generatedOn).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </small>
                  </div>
                  <Button variant="secondary" size="small" onClick={() => downloadReport(report)}>
                    Download PDF <FiDownload size={16} />
                  </Button>
                </Card>
              ))}
        </div>
      </section>
    </div>
  );
};

export default Remediation;
