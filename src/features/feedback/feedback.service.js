/**
 * Feedback Service
 * Location: src/features/feedback/feedback.service.js
 */

import { apiClient } from '../../shared/services/api.client';
import { API_ENDPOINTS, buildEndpoint } from '../../config/api.config';
import { buildFeedbackDTO } from './feedback.contract';

const mockHistory = [
  {
    id: '1',
    type: 'bug',
    subject: 'Login page issue',
    status: 'resolved',
    date: Date.now() - (5 * 24 * 60 * 60 * 1000),
    ticketNumber: 'FB-12345'
  },
  {
    id: '2',
    type: 'feature',
    subject: 'Add dark mode toggle',
    status: 'in-progress',
    date: Date.now() - (10 * 24 * 60 * 60 * 1000),
    ticketNumber: 'FB-12346'
  }
];

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

  if (import.meta.env.DEV) {
    return {
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: 'feedback-' + Date.now(),
        status: 'received',
        ticketNumber: 'FB-' + Math.floor(Math.random() * 100000),
        type: payload.type,
        subject: payload.subject,
        priority: payload.priority,
        date: Date.now(),
        contact: payload.contact
      },
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to submit feedback'
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

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: normalizeFeedbackList(mockHistory),
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to fetch feedback history'
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

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: normalizeFeedback({
        id: feedbackId,
        type: 'bug',
        subject: 'Login page issue',
        message: 'I encountered an issue when trying to log in...',
        status: 'resolved',
        priority: 'high',
        date: Date.now() - (5 * 24 * 60 * 60 * 1000),
        ticketNumber: 'FB-12345'
      }),
      isMock: true
    };
  }

  return {
    success: false,
    error: response.error || 'Failed to fetch feedback details'
  };
};

export default {
  submitFeedback,
  getFeedbackHistory,
  getFeedbackDetails
};
