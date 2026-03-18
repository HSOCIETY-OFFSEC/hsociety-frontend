export const getPublicErrorMessage = (options = {}) => {
  const { action = 'request', response, fallback } = options;
  const status =
    response?.status ??
    response?.statusCode ??
    response?.response?.status ??
    response?.status;

  if (status === 0) {
    return 'Connection error. Please try again.';
  }

  switch (action) {
    case 'load':
      return 'Unable to load data. Please try again.';
    case 'save':
      return 'Unable to save changes. Please try again.';
    case 'submit':
      return 'Submission failed. Please try again.';
    case 'payment':
      return 'Payment could not be processed. Please try again.';
    default:
      return fallback || 'Request failed. Please try again.';
  }
};

export default {
  getPublicErrorMessage
};
