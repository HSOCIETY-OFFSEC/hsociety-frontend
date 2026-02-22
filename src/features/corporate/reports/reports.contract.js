/**
 * Reports contract
 * Location: src/features/corporate/reports/reports.contract.js
 */

export const normalizeReport = (report = {}) => ({
  id: String(report.id || ''),
  title: report.title || 'Unnamed report',
  engagementName: report.engagementName || 'General Engagement',
  date: report.date || Date.now(),
  status: report.status || 'Final',
  downloadUrl: report.downloadUrl || ''
});

export const normalizeReports = (reports = []) => reports.map(normalizeReport);

export default {
  normalizeReport,
  normalizeReports
};
