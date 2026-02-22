import React, { useEffect, useState } from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getReports } from './reports.service';
import '../../../styles/features/reports.css';

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
        throw new Error(response.error || 'Failed to load reports');
      }
      setReports(response.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load reports at this time.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (report) => {
    const blob = new Blob([`Report content placeholder for ${report.title}`], {
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
          : reports.map((report) => (
              <Card key={report.id} className="report-card" padding="large" shadow="medium">
                <div className="report-header">
                  <FiFileText size={20} />
                  <span className={`report-status status-${report.status.toLowerCase()}`}>
                    {report.status}
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
            ))}
      </div>
    </div>
  );
};

export default Reports;
