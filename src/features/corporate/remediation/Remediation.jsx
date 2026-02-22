import React, { useEffect, useState } from 'react';
import { FiShield, FiCheckCircle, FiAlertTriangle, FiDownload } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getRemediationReports, getRemediationSummary } from './remediation.service';
import '../../../styles/features/remediation.css';

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
        throw new Error(response.error || 'Failed to load remediation summary');
      }
      setSummary(response.data);
    } catch (err) {
      console.error(err);
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
        throw new Error(response.error || 'Failed to load remediation reports');
      }
      setReports(response.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load remediation reports.');
    } finally {
      setLoadingReports(false);
    }
  };

  const downloadReport = (report) => {
    const blob = new Blob([`Remediation summary for ${report.title}`], {
      type: 'application/pdf'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    <div className="remediation-page">
      <header className="remediation-header">
        <div>
          <h1>Remediation Progress</h1>
          <p>Monitor fixed vs open vulnerabilities and download remediation reports.</p>
        </div>
        <Button variant="ghost" size="small" onClick={fetchSummary}>
          Refresh Summary
        </Button>
      </header>

      {error && <p className="remediation-error">{error}</p>}

      <div className="remediation-summary">
        {loadingSummary
          ? summaryStats.map((_, index) => (
              <Card key={index} padding="medium" shadow="small">
                <Skeleton className="skeleton-line" style={{ width: '80%', height: '22px' }} />
                <Skeleton className="skeleton-line" style={{ width: '60%' }} />
              </Card>
            ))
          : summaryStats.map((stat) => (
              <Card key={stat.label} padding="medium" shadow="small" className="remediation-stat-card">
                <div className="stat-icon">
                  <stat.icon size={18} />
                </div>
                <div>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">
                    {stat.value ?? 0}
                    {stat.suffix || ''}
                  </p>
                </div>
              </Card>
            ))}
      </div>

      <section className="remediation-reports">
        <div className="section-title-row">
          <h2>Remediation Reports</h2>
          <p>Each report is a downloadable PDF outlining next steps.</p>
        </div>
        <div className="remediation-list">
          {loadingReports
            ? [...Array(2)].map((_, index) => (
                <Card key={index} padding="large" shadow="small" className="remediation-report-card">
                  <Skeleton className="skeleton-line" style={{ width: '70%', height: '20px' }} />
                  <Skeleton className="skeleton-line" style={{ width: '50%' }} />
                </Card>
              ))
            : reports.map((report) => (
                <Card key={report.id} padding="large" shadow="medium" className="remediation-report-card">
                  <div className="remediation-report-meta">
                    <h3>{report.title}</h3>
                    <p>{report.owner}</p>
                    <small>
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
