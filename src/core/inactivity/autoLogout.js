/**
 * Auto Logout on Inactivity
 * Location: src/core/inactivity/autoLogout.js
 * 
 * Features:
 * - Monitors user activity (mouse, keyboard, touch)
 * - Auto logout after specified timeout
 * - Configurable timeout duration
 * - Configurable events to monitor
 * - Warning before logout (optional)
 * 
 * Security:
 * - Prevents unauthorized access from unattended sessions
 * - Clears sensitive data on timeout
 */

/**
 * Setup auto logout monitor
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Inactivity timeout in milliseconds (default: 15 minutes)
 * @param {Function} options.onTimeout - Callback when timeout occurs
 * @param {Function} options.onWarning - Optional callback for warning before timeout
 * @param {number} options.warningTime - Time before timeout to trigger warning (default: 2 minutes)
 * @param {Array<string>} options.events - Events to monitor (default: common user events)
 * @returns {Function} - Cleanup function to remove event listeners
 */
export const setupAutoLogout = ({
  timeout = 15 * 60 * 1000, // 15 minutes default
  onTimeout,
  onWarning = null,
  warningTime = 2 * 60 * 1000, // 2 minutes before timeout
  events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'mousemove']
} = {}) => {
  if (!onTimeout || typeof onTimeout !== 'function') {
    console.error('Auto logout requires onTimeout callback');
    return () => {};
  }

  let timeoutId = null;
  let warningId = null;
  let lastActivity = Date.now();
  let hasWarned = false;

  /**
   * Reset activity timers
   */
  const resetTimer = () => {
    lastActivity = Date.now();
    hasWarned = false;

    // Clear existing timers
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (warningId) {
      clearTimeout(warningId);
    }

    // Set warning timer if callback provided
    if (onWarning && warningTime > 0 && warningTime < timeout) {
      warningId = setTimeout(() => {
        if (!hasWarned) {
          hasWarned = true;
          onWarning({
            remainingTime: timeout - warningTime,
            totalTimeout: timeout
          });
        }
      }, timeout - warningTime);
    }

    // Set logout timer
    timeoutId = setTimeout(() => {
      console.log('Auto logout triggered due to inactivity');
      onTimeout();
    }, timeout);
  };

  /**
   * Activity handler
   */
  const handleActivity = () => {
    resetTimer();
  };

  // Add event listeners
  events.forEach(event => {
    window.addEventListener(event, handleActivity, { passive: true });
  });

  // Start initial timer
  resetTimer();

  /**
   * Cleanup function
   * Returns a function that removes all event listeners and clears timers
   */
  return () => {
    // Remove event listeners
    events.forEach(event => {
      window.removeEventListener(event, handleActivity);
    });

    // Clear timers
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (warningId) {
      clearTimeout(warningId);
    }

    console.log('Auto logout monitor cleaned up');
  };
};

/**
 * Get time since last activity
 * @param {number} lastActivityTimestamp - Timestamp of last activity
 * @returns {number} - Milliseconds since last activity
 */
export const getTimeSinceLastActivity = (lastActivityTimestamp) => {
  return Date.now() - lastActivityTimestamp;
};

/**
 * Format time remaining for display
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} - Formatted time string (e.g., "5 minutes 30 seconds")
 */
export const formatTimeRemaining = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return seconds > 0 
      ? `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`
      : `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
};

export default setupAutoLogout;