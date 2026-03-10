import React from 'react';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const ReportsListCard = ({ reports = [], onViewReport, onDownloadReport }) => (
  <Card padding="medium" className="corp-card corp-reports-card">
    {/* Section 5: Recent Reports */}
    <div className="corp-card-header">
      <h3 className="corp-card-title">Recent Reports</h3>
      <span className="corp-card-subtitle">Latest security findings</span>
    </div>
    {reports.length === 0 ? (
      <p className="corp-muted-text">No reports available yet.</p>
    ) : (
      <div className="corp-reports-list">
        {reports.slice(0, 4).map((report) => (
          <div key={report.id} className="corp-report-row">
            <div>
              <p className="corp-report-title">{report.name || `Report #${report.engagementId || report.id}`}</p>
              <span className="corp-report-date">{report.date}</span>
            </div>
            <div className="corp-report-actions">
              <Button variant="ghost" size="small" onClick={() => onViewReport(report)}>
                View Report
              </Button>
              <Button variant="secondary" size="small" onClick={() => onDownloadReport(report)}>
                Download PDF
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default ReportsListCard;
