import React from 'react';
import Button from '../../../../shared/components/ui/Button';
import Card from '../../../../shared/components/ui/Card';

const ReportsList = ({ reports = [] }) => (
  <Card padding="large" className="reports-card">
    <div className="reports-header">
      <h3>Reports</h3>
      <p>Latest deliverables</p>
    </div>
    <div className="reports-list">
      {reports.length === 0 ? (
        <p className="reports-empty">No reports yet. Start an engagement to generate one.</p>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="report-row">
            <div>
              <p className="report-id">Engagement {report.engagementId}</p>
              <p className="report-date">{report.date}</p>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={() => window.open(report.url, '_blank')}
            >
              Download PDF
            </Button>
          </div>
        ))
      )}
    </div>
  </Card>
);

export default ReportsList;
