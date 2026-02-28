import { runFrontendVulnerabilityChecks } from './vulnerability.checks';
import { trackSecurityEvent } from './security-events.service';

const severityRank = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  info: 0,
};

export const runSecurityScan = async () => {
  const issues = runFrontendVulnerabilityChecks();
  const sorted = [...issues].sort(
    (a, b) => (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0)
  );

  if (sorted.length > 0) {
    console.warn('[SECURITY] Frontend security scan issues:', sorted);
  } else {
    console.info('[SECURITY] Frontend security scan passed');
  }

  const highSeverity = sorted.filter((item) => ['critical', 'high'].includes(item.severity));
  if (highSeverity.length > 0) {
    await trackSecurityEvent({
      eventType: 'frontend_security_alert',
      action: 'scan_detected_issues',
      metadata: {
        totalIssues: sorted.length,
        highSeverity: highSeverity.length,
        issueIds: highSeverity.map((item) => item.id),
      },
    });
  }

  return sorted;
};

export default {
  runSecurityScan,
};
