/**
 * Quiz Service
 * Location: src/features/student/quizzes/quiz.service.js
 *
 * Responsibility:
 * - Handle quiz start / submit for rooms or modules
 * - Uses backend for quiz generation and grading
 */

import { API_ENDPOINTS } from '../../../config/api/api.config';
import { apiClient } from '../../../shared/services/api.client';

/**
 * Request a quiz definition for a given scope (room or module).
 * Requests a quiz definition from the backend.
 */
export const fetchQuizForScope = async ({ type, id, courseId }) => {
  // Shape future backend integration
  const endpoint = API_ENDPOINTS.STUDENT.QUIZ;
  const params = { type, id, courseId };

  // Call the API
  const response = await apiClient.post(endpoint, params);

  if (response.success && response.data) {
    return {
      success: true,
      data: response.data
    };
  }
  return {
    success: false,
    error: response.error || 'Unable to load quiz at this time'
  };
};

/**
 * Submit quiz answers for scoring.
 * Currently scored locally; later this can be delegated to the backend.
 */
export const submitQuizAnswers = async (quiz, answers) => {
  const response = await apiClient.post(API_ENDPOINTS.STUDENT.QUIZ, {
    scope: quiz.scope,
    answers
  });

  if (response.success) {
    return {
      success: true,
      data: response.data
    };
  }

  return {
    success: false,
    error: response.error || 'Quiz submission failed'
  };
};

export default {
  fetchQuizForScope,
  submitQuizAnswers
};
