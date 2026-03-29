import React from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';
import Button from '../../../../shared/components/ui/Button';

const panelClassName =
  'flex flex-col gap-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)]';
const panelTitleClassName = 'text-base font-semibold text-text-primary';

const ReportsListCard = ({ reports = [], onViewReport, onDownloadReport }) => (
  <div className={panelClassName}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className={panelTitleClassName}>Recent Reports</h3>
      </div>
    </div>
    {reports.length === 0 ? (
      <p className="text-sm text-text-tertiary">No reports available yet.</p>
    ) : (
      <div className="overflow-hidden rounded-sm border border-border">
        {reports.slice(0, 4).map((report) => (
          <article key={report.id} className="flex flex-col gap-3 border-b border-border bg-bg-secondary px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span className="block truncate font-semibold text-text-primary">
                {report.name || `Report #${report.engagementId || report.id}`}
              </span>
              <span className="text-sm text-text-secondary">{report.date}</span>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
              <Button type="button" variant="secondary" size="small" onClick={() => onViewReport(report)}>
                <FiFileText size={14} />
                View
              </Button>
              <Button type="button" variant="secondary" size="small" onClick={() => onDownloadReport(report)}>
                <FiDownload size={14} />
                PDF
              </Button>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
);

export default ReportsListCard;
