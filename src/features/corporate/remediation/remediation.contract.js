/**
 * Remediation contract
 * Location: src/features/corporate/remediation/remediation.contract.js
 */

export const normalizeRemediationSummary = (summary = {}) => ({
  totalVulnerabilities: Number(summary.totalVulnerabilities || 0),
  fixedVulnerabilities: Number(summary.fixedVulnerabilities || 0),
  openVulnerabilities: Number(summary.openVulnerabilities || 0),
  remediationRate: Number(summary.remediationRate || 0)
});

export const normalizeRemediationReport = (report = {}) => ({
  id: String(report.id || ''),
  title: report.title || 'Remediation summary',
  generatedOn: report.generatedOn || Date.now(),
  owner: report.owner || 'HSOCIETY Security Team',
  downloadUrl: report.downloadUrl || ''
});

export const normalizeRemediationReports = (reports = []) => reports.map(normalizeRemediationReport);

export default {
  normalizeRemediationSummary,
  normalizeRemediationReport,
  normalizeRemediationReports
};
