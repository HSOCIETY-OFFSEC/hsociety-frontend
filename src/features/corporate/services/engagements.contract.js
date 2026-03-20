/**
 * Engagements contract
 * Location: src/features/corporate/engagements/engagements.contract.js
 */

export const normalizeEngagement = (engagement = {}) => ({
  id: String(engagement.id || ''),
  name: engagement.name || 'Unnamed engagement',
  scope: engagement.scope || 'Unknown scope',
  status: engagement.status || 'recon',
  startDate: engagement.startDate || null,
  expectedCompletion: engagement.expectedCompletion || null,
  summary: engagement.summary || '',
  budget: Number(engagement.budget || 0),
  currency: engagement.currency || 'USD'
});

export const normalizeEngagements = (items = []) =>
  items.map(normalizeEngagement);

export default {
  normalizeEngagement,
  normalizeEngagements
};
