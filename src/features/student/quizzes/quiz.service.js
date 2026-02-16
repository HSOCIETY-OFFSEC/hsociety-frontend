/**
 * Quiz Service (placeholder for future backend integration)
 * Location: src/features/student/quizzes/quiz.service.js
 *
 * Responsibility:
 * - Handle quiz start / submit for rooms or modules
 * - Currently operates fully client-side, but shaped to call APIs later
 */

import { API_ENDPOINTS } from '../../../config/api.config';
import { apiClient } from '../../../shared/services/api.client';

/**
 * Request a quiz definition for a given scope (room or module).
 * In the current mock implementation, this simply builds a
 * lightweight quiz structure on the client.
 */
export const fetchQuizForScope = async ({ type, id, courseId }) => {
  // Shape future backend integration
  const endpoint = API_ENDPOINTS.STUDENT.QUIZ;
  const params = { type, id, courseId };

  // Try calling the API – OK if it fails in dev
  const response = await apiClient.post(endpoint, params);

  if (response.success && response.data) {
    return {
      success: true,
      data: response.data
    };
  }

  // Local mock quiz for now
  const mockQuiz = {
    scope: { type, id, courseId },
    questions: [
      {
        id: 'q1',
        text: 'What is the primary mindset of an ethical hacker?',
        options: [
          'Break everything without limits',
          'Think like an attacker while respecting boundaries',
          'Ignore rules to find vulnerabilities',
          'Automate all security work'
        ],
        correctIndex: 1
      },
      {
        id: 'q2',
        text: 'What is the most important first step when learning a new hacking topic?',
        options: [
          'Memorize every tool command',
          'Run tools blindly until something works',
          'Understand the underlying system and threat model',
          'Skip basics and jump into advanced exploits'
        ],
        correctIndex: 2
      }
    ]
  };

  return {
    success: true,
    data: mockQuiz,
    isMock: true
  };
};

/**
 * Submit quiz answers for scoring.
 * Currently scored locally; later this can be delegated to the backend.
 */
export const submitQuizAnswers = async (quiz, answers) => {
  const total = quiz.questions.length;
  const correct = quiz.questions.reduce((acc, q) => {
    const answerIndex = answers[q.id];
    return acc + (answerIndex === q.correctIndex ? 1 : 0);
  }, 0);

  const score = Math.round((correct / total) * 100);

  // Placeholder API call – safe to ignore failure in dev
  await apiClient.post(API_ENDPOINTS.STUDENT.QUIZ, {
    scope: quiz.scope,
    score,
    total,
    correct
  });

  return {
    success: true,
    data: {
      score,
      total,
      correct,
      passed: score >= 70
    }
  };
};

export default {
  fetchQuizForScope,
  submitQuizAnswers
};

