/**
 * Feedback Service
 * Location: src/features/feedback/feedback.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS, buildEndpoint } from '../../../config/api/api.config';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { buildFeedbackDTO } from './feedback.contract';

const normalizeFeedback = (item = {}) => ({
  id: String(item.id || ''),
  type: item.type || 'general',
  subject: item.subject || '',
  message: item.message || '',
  status: item.status || 'received',
  priority: item.priority || 'normal',
  date: item.date || Date.now(),
  ticketNumber: item.ticketNumber || '',
  contact: {
    name: item?.contact?.name || '',
    email: item?.contact?.email || '',
    allowContact: Boolean(item?.contact?.allowContact)
  }
});

const normalizeFeedbackList = (items = []) => items.map(normalizeFeedback);

/**
 * Submit feedback
 * @param {Object} feedbackData - Feedback data
 * @returns {Promise<Object>} - Submission response
 */
export const submitFeedback = async (feedbackData) => {
  const payload = buildFeedbackDTO(feedbackData);
  const response = await apiClient.post(API_ENDPOINTS.FEEDBACK.SUBMIT, payload);
  if (response.success) {
    return {
      success: true,
      message: 'Feedback submitted successfully',
      data: normalizeFeedback(response.data)
    };
  }

  return {
    success: false,
    error: getPublicErrorMessage({ action: 'submit', response })
  };
};

/**
 * Get user's feedback history (authenticated)
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Feedback list
 */
export const getFeedbackHistory = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `${API_ENDPOINTS.FEEDBACK.LIST}?${query}` : API_ENDPOINTS.FEEDBACK.LIST;
  const response = await apiClient.get(endpoint);
  if (response.success) {
    return {
      success: true,
      data: normalizeFeedbackList(Array.isArray(response.data) ? response.data : response.data?.items || [])
    };
  }

  return {
    success: false,
    error: getPublicErrorMessage({ action: 'load', response })
  };
};

/**
 * Get feedback details
 * @param {string} feedbackId - Feedback ID
 * @returns {Promise<Object>} - Feedback details
 */
export const getFeedbackDetails = async (feedbackId) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.FEEDBACK.GET, { id: feedbackId });
  const response = await apiClient.get(endpoint);
  if (response.success) {
    return {
      success: true,
      data: normalizeFeedback(response.data)
    };
  }

  return {
    success: false,
    error: getPublicErrorMessage({ action: 'load', response })
  };
};

export default {
  submitFeedback,
  getFeedbackHistory,
  getFeedbackDetails
};
