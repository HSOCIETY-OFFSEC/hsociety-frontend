/**
 * Feedback contract
 * Location: src/features/feedback/feedback.contract.js
 */

export const buildFeedbackDTO = (data) => ({
  type: data.type,
  priority: data.priority,
  subject: data.subject.trim(),
  message: data.message.trim(),
  contact: {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    allowContact: Boolean(data.allowContact)
  },
  metadata: {
    source: 'web',
    version: '1'
  }
});

export default {
  buildFeedbackDTO
};
