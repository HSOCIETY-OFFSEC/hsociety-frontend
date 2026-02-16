/**
 * Audits contract
 * Location: src/features/audits/audits.contract.js
 */

export const normalizeAudit = (audit = {}) => ({
  id: String(audit.id || ''),
  title: audit.title || 'Untitled audit',
  type: audit.type || 'General',
  date: audit.date || Date.now(),
  status: audit.status || 'draft',
  severity: {
    critical: Number(audit?.severity?.critical || 0),
    high: Number(audit?.severity?.high || 0),
    medium: Number(audit?.severity?.medium || 0),
    low: Number(audit?.severity?.low || 0),
    info: Number(audit?.severity?.info || 0)
  },
  remediationProgress: Number(audit.remediationProgress || 0),
  tester: audit.tester || 'Security Team',
  reportAvailable: Boolean(audit.reportAvailable)
});

export const normalizeAudits = (audits = []) => audits.map(normalizeAudit);

export default {
  normalizeAudit,
  normalizeAudits
};
