/**
 * Feedback Service
 * Location: src/features/feedback/feedback.service.js
 * 
 * Features:
 * - Submit feedback (public endpoint)
 * - Get user feedback history
 * - Track feedback status
 * 
 * TODO: Backend integration
 */

import { apiClient } from '../../shared/services/api.client';
import { API_ENDPOINTS, buildEndpoint } from '../../config/api.config';

/**
 * Submit feedback
 * @param {Object} feedbackData - Feedback data
 * @returns {Promise<Object>} - Submission response
 */
export const submitFeedback = async (feedbackData) => {
  try {
    // TODO: Backend integration
    // const response = await apiClient.post(
    //   API_ENDPOINTS.FEEDBACK.SUBMIT,
    //   feedbackData
    // );

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Feedback submitted:', feedbackData);

    return {
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: 'feedback-' + Date.now(),
        status: 'received',
        ticketNumber: 'FB-' + Math.floor(Math.random() * 100000)
      }
    };
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit feedback'
    };
  }
};

/**
 * Get user's feedback history (authenticated)
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Feedback list
 */
export const getFeedbackHistory = async (params = {}) => {
  try {
    // TODO: Backend integration
    // const response = await apiClient.get(API_ENDPOINTS.FEEDBACK.LIST, {
    //   params
    // });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock data
    return {
      success: true,
      data: [
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
        },
        {
          id: '3',
          type: 'general',
          subject: 'Great platform!',
          status: 'acknowledged',
          date: Date.now() - (15 * 24 * 60 * 60 * 1000),
          ticketNumber: 'FB-12347'
        }
      ]
    };
  } catch (error) {
    console.error('Failed to fetch feedback history:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get feedback details
 * @param {string} feedbackId - Feedback ID
 * @returns {Promise<Object>} - Feedback details
 */
export const getFeedbackDetails = async (feedbackId) => {
  try {
    // TODO: Backend integration
    // const endpoint = buildEndpoint(API_ENDPOINTS.FEEDBACK.GET, { id: feedbackId });
    // const response = await apiClient.get(endpoint);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: {
        id: feedbackId,
        type: 'bug',
        subject: 'Login page issue',
        message: 'I encountered an issue when trying to log in...',
        status: 'resolved',
        priority: 'high',
        date: Date.now() - (5 * 24 * 60 * 60 * 1000),
        ticketNumber: 'FB-12345',
        responses: [
          {
            date: Date.now() - (4 * 24 * 60 * 60 * 1000),
            message: 'Thank you for reporting this. We are investigating.',
            from: 'Support Team'
          },
          {
            date: Date.now() - (2 * 24 * 60 * 60 * 1000),
            message: 'This issue has been resolved in the latest update.',
            from: 'Support Team'
          }
        ]
      }
    };
  } catch (error) {
    console.error('Failed to fetch feedback details:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  submitFeedback,
  getFeedbackHistory,
  getFeedbackDetails
};