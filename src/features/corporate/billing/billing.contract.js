/**
 * Billing contract
 * Location: src/features/corporate/billing/billing.contract.js
 */

export const normalizeInvoice = (item = {}) => ({
  id: String(item.id || ''),
  engagementName: item.engagementName || 'Corporate Engagement',
  date: item.date || Date.now(),
  amount: Number(item.amount || 0),
  status: item.status || 'Pending',
  downloadUrl: item.downloadUrl || ''
});

export const normalizeAgreement = (agreement = {}) => ({
  id: String(agreement.id || ''),
  title: agreement.title || 'Engagement Agreement',
  date: agreement.date || Date.now(),
  downloadUrl: agreement.downloadUrl || ''
});

export const normalizeInvoices = (items = []) => items.map(normalizeInvoice);
export const normalizeAgreements = (items = []) => items.map(normalizeAgreement);

export default {
  normalizeInvoice,
  normalizeAgreement,
  normalizeInvoices,
  normalizeAgreements
};
