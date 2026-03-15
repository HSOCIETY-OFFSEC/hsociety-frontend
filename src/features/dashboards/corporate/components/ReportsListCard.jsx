import React from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';

const ReportsListCard = ({ reports = [], onViewReport, onDownloadReport }) => (
  <div className="cd-panel cd-reports-panel">
    <div className="cd-panel-header">
      <div>
        <h3 className="cd-panel-title">Recent Reports</h3>
        <p className="cd-panel-desc">Latest security findings</p>
      </div>
    </div>
    {reports.length === 0 ? (
      <p className="cd-muted-text">No reports available yet.</p>
    ) : (
      <div className="cd-item-list">
        {reports.slice(0, 4).map((report) => (
          <article key={report.id} className="cd-item-row">
            <div className="cd-item-main">
              <span className="cd-item-title">{report.name || `Report #${report.engagementId || report.id}`}</span>
              <span className="cd-item-subtitle">{report.date}</span>
            </div>
            <div className="cd-item-meta">
              <button type="button" className="cd-btn cd-btn-secondary" onClick={() => onViewReport(report)}>
                <FiFileText size={14} />
                View
              </button>
              <button type="button" className="cd-btn cd-btn-secondary" onClick={() => onDownloadReport(report)}>
                <FiDownload size={14} />
                PDF
              </button>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
);

export default ReportsListCard;
